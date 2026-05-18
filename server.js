const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

const PORT = 3443;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

const CERT_CANDIDATES = [
  { key: "025-key.pem", cert: "025.pem" },
  { key: "local-key.pem", cert: "local.pem" },
  { key: "key.pem", cert: "cert.pem" },
  { key: "server-key.pem", cert: "server.pem" },
];

function sendFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.end(err.code === "ENOENT" ? "404 Not Found" : "500 Server Error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    });
    res.end(data);
  });
}

function requestHandler(req, res) {
  const requestPath = decodeURIComponent(req.url.split("?")[0]);
  const safePath = path.normalize(requestPath).replace(/^(\.\.[\\/])+/, "");
  let filePath = path.join(ROOT, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("403 Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    sendFile(filePath, res);
  });
}

function loadHttpsOptions() {
  for (const pair of CERT_CANDIDATES) {
    const keyPath = path.join(ROOT, pair.key);
    const certPath = path.join(ROOT, pair.cert);

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
        keyPath,
        certPath,
      };
    }
  }

  return null;
}

const httpsOptions = loadHttpsOptions();

if (httpsOptions) {
  https.createServer(
    {
      key: httpsOptions.key,
      cert: httpsOptions.cert,
    },
    requestHandler
  ).listen(PORT, () => {
    console.log(`Vision site running at https://localhost:${PORT}`);
    console.log(`Using certificate: ${path.basename(httpsOptions.certPath)}`);
  });
} else {
  http.createServer(requestHandler).listen(PORT, () => {
    console.log(`Vision site running at http://localhost:${PORT}`);
    console.log("HTTPS is supported, but certificate files are missing.");
    console.log("Add one of these pairs to enable HTTPS:");
    console.log("  local-key.pem + local.pem");
    console.log("  key.pem + cert.pem");
    console.log("  server-key.pem + server.pem");
  });
}
