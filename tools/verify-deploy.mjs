#!/usr/bin/env node
/**
 * Post-deploy verification for the ITAD + privacy changes.
 *
 * Checks the LIVE site and Worker against what DEPLOY.md promises. Run this
 * after deploying the Worker and the front end.
 *
 * Usage:
 *   node tools/verify-deploy.mjs
 *   node tools/verify-deploy.mjs --site https://auramind.cloud --api https://api.auramind.cloud
 *
 * Exit codes: 0 all checks passed, 1 one or more failed, 2 usage error.
 *
 * Notes:
 *   - Read-only: issues GET/OPTIONS only. Never submits a real enquiry.
 *   - Pass criterion for the consent control is the *absence* of the old
 *     "no consent" state, i.e. the form copy must reference the privacy notice.
 */

const args = process.argv.slice(2);
let SITE = "https://auramind.cloud";
let API = "https://api.auramind.cloud";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--site") SITE = args[++i];
  else if (args[i] === "--api") API = args[++i];
  else {
    console.error(`Unknown argument: ${args[i]}`);
    process.exit(2);
  }
}

const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`  [${mark}] ${name}`);
  if (detail) console.log(`         ${detail}`);
}

async function fetchText(url, options = {}) {
  const { headers = {}, ...rest } = options;
  // Connection: close avoids leaving keep-alive sockets open, which on Windows
  // can trip a libuv assertion (UV_HANDLE_CLOSING) during process teardown and
  // corrupt the exit code. Caller headers are merged, not replaced.
  const response = await fetch(url, {
    ...rest,
    redirect: "manual",
    headers: { connection: "close", ...headers },
  });
  const body = await response.text().catch(() => "");
  return { status: response.status, body, headers: response.headers };
}

async function main() {
  console.log(`== Verify deploy`);
  console.log(`   site: ${SITE}`);
  console.log(`   api:  ${API}`);
  console.log("");

  // ---------------------------------------------------------------- Worker
  console.log("-- Worker (api)");
  try {
    const health = await fetchText(`${API}/health`);
    record(
      "Worker /health returns 200 {status:ok}",
      health.status === 200 && /"status"\s*:\s*"ok"/.test(health.body),
      `HTTP ${health.status} ${health.body.slice(0, 60)}`,
    );
  } catch (error) {
    record("Worker /health reachable", false, String(error.message ?? error));
  }

  const siteIsPublic = /^https:\/\/(www\.)?auramind\.cloud$/.test(SITE);
  try {
    const preflight = await fetchText(`${API}/api/inquiry`, {
      method: "OPTIONS",
      headers: {
        Origin: SITE,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });
    const allow = preflight.headers.get("access-control-allow-origin");
    if (!siteIsPublic) {
      // The deployed Worker only allow-lists production origins, so a local
      // build preview legitimately gets 403. Report, do not fail.
      console.log(
        `  [SKIP] Worker CORS check (origin ${SITE} is not a production origin)`,
      );
    } else {
      record(
        "Worker CORS allows the site origin",
        preflight.status === 204 && allow === SITE,
        `HTTP ${preflight.status}, Access-Control-Allow-Origin: ${allow}`,
      );
    }
  } catch (error) {
    record("Worker CORS preflight", false, String(error.message ?? error));
  }

  // ------------------------------------------------------------------ Site
  console.log("-- Site (front end)");
  let home = null;
  try {
    home = await fetchText(`${SITE}/`);
    record("Homepage returns 200", home.status === 200, `HTTP ${home.status}`);
  } catch (error) {
    record("Homepage reachable", false, String(error.message ?? error));
  }

  if (home && home.status === 200) {
    const html = home.body;
    // ITAD is positioned as product resale, so the card reads "ITAD Product
    // Resale". Keep this in sync with Services.tsx if the wording changes.
    const itadLive = /Pathway\s*03/i.test(html) && /ITAD Product Resale/i.test(html);
    record(
      "ITAD pathway is live (Pathway 03, product resale)",
      itadLive,
      itadLive
        ? "found 'ITAD Product Resale'"
        : "missing 'ITAD Product Resale' — front end not deployed, or the card wording changed",
    );
    record(
      "Pathway 04 (AI Website) is live",
      /Pathway\s*04/i.test(html),
      /Pathway\s*04/i.test(html) ? "found" : "missing — front end not deployed?",
    );
    record(
      "Rejected AI Market Research section is gone",
      !/AI Market Research/i.test(html),
      /AI Market Research/i.test(html)
        ? "STILL PRESENT — internal note says this service is not offered"
        : "absent, as intended",
    );
    record(
      "Four-pathway Services heading is live",
      /Four primary delivery pathways/i.test(html),
      /Four primary delivery pathways/i.test(html) ? "found" : "still the old 'Two primary' copy?",
    );
    record(
      "Enquiry form references the privacy notice",
      /Privacy Notice/i.test(html),
      /Privacy Notice/i.test(html)
        ? "consent control present"
        : "no privacy-notice reference on the page — PDPA gap still open",
    );
  }

  try {
    const privacy = await fetchText(`${SITE}/privacy`);
    record(
      "Privacy notice page returns 200",
      privacy.status === 200,
      privacy.status === 200
        ? "found"
        : `HTTP ${privacy.status} — this is the live PDPA compliance gap`,
    );
    if (privacy.status === 200) {
      record(
        "Privacy notice cites the PDPA",
        /Personal Data Protection Act 2010/i.test(privacy.body),
        /Personal Data Protection Act 2010/i.test(privacy.body) ? "found" : "PDPA reference missing",
      );
    }
  } catch (error) {
    record("Privacy notice reachable", false, String(error.message ?? error));
  }

  // -------------------------------------------------------------- summary
  const failed = results.filter((r) => !r.ok);
  console.log("");
  console.log(`== ${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length > 0) {
    console.log("");
    console.log("Failed:");
    for (const f of failed) console.log(`  - ${f.name}`);
    console.log("");
    console.log("If the ITAD / privacy checks failed, the front end is still the old");
    console.log("deployment. Deploy the Worker first, then the front end (see DEPLOY.md).");
    // Set the exit code and return; process.exit() during teardown can abort.
    process.exitCode = 1;
    return;
  }
  console.log("Deployment verified.");
  process.exitCode = 0;
}

main().catch((error) => {
  console.error("Verification crashed:", error);
  process.exit(2);
});
