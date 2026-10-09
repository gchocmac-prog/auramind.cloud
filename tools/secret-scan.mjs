#!/usr/bin/env node
/**
 * Cross-platform secret scanner for CI and local use.
 *
 * Scans the working tree (and optionally full git history) for committed
 * secrets and exits non-zero on findings. Reports MASKED excerpts only — never
 * a usable secret value.
 *
 * Usage:
 *   node tools/secret-scan.mjs [--root <dir>] [--history] [--json <file>]
 *
 * Exit codes:
 *   0 no findings
 *   1 findings present
 *   2 usage/environment error
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { execFileSync } from "node:child_process";

const PATTERNS = [
  ["Private key block", /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/],
  ["AWS access key id", /\b(?:AKIA|ASIA|ABIA|ACCA)[0-9A-Z]{16}\b/],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/],
  ["OpenAI / DeepSeek key", /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ["Anthropic key", /\bsk-ant-[A-Za-z0-9_-]{20,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["Slack token", /\bxox[abprs]-[0-9A-Za-z-]{10,}\b/],
  ["Resend key", /\bre_[A-Za-z0-9]{16,}\b/],
  ["Stripe key", /\b(?:sk|rk)_(?:live|test)_[0-9A-Za-z]{16,}\b/],
  ["SendGrid key", /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/],
  ["Twilio SID", /\bAC[0-9a-fA-F]{32}\b/],
  ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
  // Quoted value required: an optional quote matches minified JS such as
  // `password=t10.password` and buries real findings in noise.
  [
    "Credential assignment",
    /(?<![A-Za-z0-9_-])[A-Za-z0-9_]*?(?:api[_-]?key|apikey|access[_-]?token|auth[_-]?token|client[_-]?secret|secret[_-]?key|private[_-]?key|passwd|password)(?![A-Za-z0-9_])\s*[:=]\s*["'][^"'\s]{12,}["']/i,
  ],
  // Unquoted YAML/.env form, length-gated to limit noise.
  [
    "Credential assignment (unquoted)",
    /(?<![A-Za-z0-9_-])[A-Za-z0-9_]*?(?:api[_-]?key|apikey|access[_-]?token|auth[_-]?token|client[_-]?secret|secret[_-]?key|private[_-]?key|passwd|password)(?![A-Za-z0-9_])\s*[:=]\s*[A-Za-z0-9_\-+/=.]{20,}\b/i,
  ],
  ["Credential in URL", /:\/\/[^/\s:@]{2,64}:[^/\s:@]{6,}@/],
  ["Postgres URI", /\bpostgres(?:ql)?:\/\/[^\s"']{8,}/],
  ["MySQL URI", /\bmysql:\/\/[^\s"']{8,}/],
  ["MongoDB URI", /\bmongodb(?:\+srv)?:\/\/[^\s"']{8,}/],
];

const PLACEHOLDER_WORD =
  /(?:example|placeholder|changeme|change[-_]?me|redacted|masked|dummy|sample|todo|your[-_]?[A-Za-z0-9_]*|<set[^>]*>)/i;
const CODE_REFERENCE =
  /(?:process\.env\.[A-Za-z0-9_.]+|os\.environ[^\s,;]*|\$\{[^}]*\}|\{\{[^}]*\}\})/;

const SKIP_DIRS = new Set([
  "node_modules", ".git", ".next", "out", "dist", "build", ".turbo",
  ".cache", "coverage", ".venv", "venv", "__pycache__", ".wrangler",
]);
const TEXT_EXT = new Set([
  ".md", ".txt", ".json", ".jsonc", ".yml", ".yaml", ".ts", ".tsx", ".js",
  ".jsx", ".mjs", ".cjs", ".css", ".scss", ".html", ".ps1", ".sh", ".py",
  ".toml", ".ini", ".cfg", ".conf", ".env", ".example", ".sql", ".xml",
  ".properties", ".csv", ".lock",
]);

/**
 * Replaces placeholder *values* (right of an assignment operator) only.
 * Scrubbing whole lines, or replacing placeholder substrings anywhere, both
 * hide real secrets that share a line with a placeholder or contain letters
 * such as "xxxx" inside the token itself.
 */
function scrub(line) {
  return line
    .replace(
      new RegExp(`((?:=>|[:=])\\s*)"(?:${PLACEHOLDER_WORD.source}|${CODE_REFERENCE.source})"`, "gi"),
      '$1"<ph>"',
    )
    .replace(
      new RegExp(`((?:=>|[:=])\\s*)(?:${PLACEHOLDER_WORD.source}|${CODE_REFERENCE.source})`, "gi"),
      "$1<ph>",
    );
}

function mask(line) {
  let out = scrub(line);
  for (const [, re] of PATTERNS) out = out.replace(new RegExp(re.source, re.flags.includes("i") ? "gi" : "g"), "<masked>");
  out = out.replace(/\s+/g, " ").trim();
  return out.length > 200 ? `${out.slice(0, 200)}...` : out;
}

function matchPatterns(text) {
  const scrubbed = scrub(text);
  const names = [];
  for (const [name, re] of PATTERNS) if (re.test(scrubbed)) names.push(name);
  return names;
}

function looksBinary(file) {
  try {
    const buf = readFileSync(file);
    return buf.subarray(0, 8192).includes(0);
  } catch {
    return true;
  }
}

function walk(dir, root, acc) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, root, acc);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      const isText = TEXT_EXT.has(ext) || entry.name.startsWith(".env") || entry.name.endsWith(".env");
      if (isText) acc.push(full);
    }
  }
  return acc;
}

function scanWorkingTree(root, findings) {
  const files = walk(root, root, []);
  let scanned = 0;
  for (const file of files) {
    if (looksBinary(file)) continue;
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    scanned++;
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      const names = matchPatterns(line);
      if (names.length) {
        findings.push({
          source: "working-tree",
          location: relative(root, file).split("\\").join("/"),
          line: index + 1,
          patterns: names.join(", "),
          excerpt: mask(line),
        });
      }
    });
  }
  return scanned;
}

function scanHistory(root, findings) {
  let objects;
  try {
    objects = execFileSync("git", ["-C", root, "rev-list", "--objects", "--all"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }

  const blobs = new Map();
  for (const line of objects.split("\n")) {
    const match = /^([0-9a-f]{40}) ?(.*)$/.exec(line);
    if (match) blobs.set(match[1], match[2]);
  }

  let scanned = 0;
  for (const [sha, name] of blobs) {
    let content;
    try {
      content = execFileSync("git", ["-C", root, "cat-file", "-p", sha], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        maxBuffer: 64 * 1024 * 1024,
      });
    } catch {
      continue;
    }
    if (content.includes("\u0000")) continue;
    scanned++;
    // split() always yields an array, so single-line blobs are not mis-indexed.
    content.split("\n").forEach((line, index) => {
      const names = matchPatterns(line);
      if (names.length) {
        findings.push({
          source: "history",
          location: name || sha,
          line: index + 1,
          patterns: names.join(", "),
          excerpt: mask(line),
        });
      }
    });
  }
  return scanned;
}

function main() {
  const args = process.argv.slice(2);
  let root = process.cwd();
  let wantHistory = false;
  let jsonPath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--root") root = args[++i];
    else if (args[i] === "--history") wantHistory = true;
    else if (args[i] === "--json") jsonPath = args[++i];
    else {
      console.error(`Unknown argument: ${args[i]}`);
      process.exit(2);
    }
  }

  try {
    if (!statSync(root).isDirectory()) throw new Error("not a directory");
  } catch {
    console.error(`Root is not a readable directory: ${root}`);
    process.exit(2);
  }

  if (PATTERNS.length < 5) {
    console.error("Pattern list failed to initialise; refusing to report a clean result.");
    process.exit(2);
  }

  const findings = [];
  console.log(`== Secret scan: ${root}`);
  console.log(`   patterns loaded: ${PATTERNS.length}`);

  console.log("-- Working tree");
  console.log(`   files scanned: ${scanWorkingTree(root, findings)}`);

  if (wantHistory) {
    console.log("-- Git history");
    const scanned = scanHistory(root, findings);
    console.log(
      scanned === null
        ? "   skipped (not a git working tree)"
        : `   text blobs scanned: ${scanned}`,
    );
  }

  console.log("");
  if (findings.length === 0) {
    console.log("RESULT: no secret-pattern findings.");
    console.log("Note: heuristic scan. A clean result is not proof that no secret exists.");
    process.exit(0);
  }

  console.log(`RESULT: ${findings.length} finding(s)\n`);
  for (const f of findings.slice(0, 500)) {
    console.log(`[${f.source}] ${f.location}:${f.line}`);
    console.log(`    patterns: ${f.patterns}`);
    console.log(`    ${f.excerpt}`);
  }
  console.log("\nAll excerpts are masked. Verify each finding manually before rotating.");

  if (jsonPath) {
    writeFileSync(jsonPath, JSON.stringify(findings, null, 2), "utf8");
    console.log(`Findings written to ${jsonPath}`);
  }
  process.exit(1);
}

main();
