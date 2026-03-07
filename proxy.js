/**
 * Proxies localhost to https://auramind.cloud for local preview
 * localhost will look exactly like auramind.cloud
 */
const http = require("http");

const PORT = 3000;
const TARGET = "https://auramind.cloud";

function start(port) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const targetUrl = `${TARGET}${url.pathname}${url.search}`;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          Host: "auramind.cloud",
          "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
          Accept: req.headers["accept"] || "*/*",
        },
      });

      const headers = {};
      response.headers.forEach((v, k) => {
        if (!["content-encoding", "transfer-encoding"].includes(k.toLowerCase())) {
          headers[k] = v;
        }
      });
      Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
      res.statusCode = response.status;
      res.write(Buffer.from(await response.arrayBuffer()));
      res.end();
    } catch (err) {
      res.statusCode = 502;
      res.end(`Proxy error: ${err.message}`);
    }
  });

  server.listen(port, () => {
    console.log("");
    console.log("  >> Local:   http://localhost:" + port);
    console.log("  >> Proxying to auramind.cloud");
    console.log("  >> Open in your browser (not Cursor Browser)");
    console.log("");
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE" && port < 3010) {
      console.log("Port " + port + " in use, trying " + (port + 1) + "...");
      start(port + 1);
    } else {
      console.error("Error:", err.message);
      process.exit(1);
    }
  });
}
start(PORT);
