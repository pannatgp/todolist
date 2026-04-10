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
    hypothesisId: "H1-H4",
    location: "scripts/preinstall-debug.js:1",
    message: "npm preinstall environment snapshot",
    data: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      npmConfigCxx: process.env.npm_config_cxx || null,
      npmConfigJobs: process.env.npm_config_jobs || null
    },
    timestamp: Date.now()
  })
}).catch(() => {});
// #endregion
