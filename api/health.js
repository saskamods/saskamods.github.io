const { json } = require("./_lib/http");

module.exports = async function health(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed." });
  return json(res, 200, {
    ok: true,
    service: "saska-ai-api",
    timestamp: new Date().toISOString()
  });
};
