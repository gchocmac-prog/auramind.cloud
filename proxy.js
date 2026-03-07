/**
 * Proxies localhost:3000 to https://auramind.cloud for local preview
 * Run: node proxy.js
 */
const http = require("http");

const TARGET = "https://auramind.cloud";

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:3000`);
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

server.listen(3000, () => {
  console.log("Proxying http://localhost:3000 -> https://auramind.cloud");
});
