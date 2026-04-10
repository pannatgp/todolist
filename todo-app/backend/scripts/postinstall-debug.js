const fs = require("fs");
const path = require("path");

const lockPath = path.join(process.cwd(), "package-lock.json");
let resolved = null;
let lockVersion = null;

try {
  if (fs.existsSync(lockPath)) {
    const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    lockVersion = lock.lockfileVersion || null;
    resolved =
      lock?.packages?.["node_modules/better-sqlite3"]?.version ||
      lock?.dependencies?.["better-sqlite3"]?.version ||
      null;
  }
} catch (_) {}

// #region agent log
fetch("http://127.0.0.1:7334/ingest/8dc03aa6-de26-4457-afd2-894c68c40c39", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "2e3c95"
  },
  body: JSON.stringify({
    sessionId: "2e3c95",
    runId: "install-debug",
    hypothesisId: "H5-H6",
    location: "scripts/postinstall-debug.js:1",
    message: "postinstall lock resolution snapshot",
    data: { lockVersion, resolvedBetterSqlite3: resolved },
    timestamp: Date.now()
  })
}).catch(() => {});
// #endregion
