/**
 * Simple static file server - no dependencies, starts instantly
 * Serves the same files as workers.dev
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT = path.join(process.cwd(), "site", "auramind.cloud");

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join(ROOT, req.url === "/" ? "index.html" : req.url);
    filePath = path.resolve(filePath);
    const rootResolved = path.resolve(ROOT);
    if (!filePath.startsWith(rootResolved)) {
      res.statusCode = 403;
      return res.end();
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = err.code === "ENOENT" ? 404 : 500;
        return res.end(err.code === "ENOENT" ? "Not Found" : "Error");
      }
      const ext = path.extname(filePath);
      res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
      res.end(data);
    });
  });
}

function start(port) {
  const server = createServer();
  server.listen(port, () => {
    console.log("");
    console.log("  >> Local:   http://localhost:" + port);
    console.log("  >> Ready!   Run 'Open Preview in Browser' or open in your browser");
    console.log("");
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE" && port < 3010) {
      console.log("Port " + port + " in use, trying " + (port + 1) + "...");
      start(port + 1);
    } else {
      console.error("Error:", err.message);
      if (err.code === "EADDRINUSE") {
        console.error("Stop the process using port " + port + " or run: npx kill-port " + port);
      }
      process.exit(1);
    }
  });
}
start(PORT);
