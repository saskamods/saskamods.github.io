const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");
}

function json(res, status, body) {
  setCors(res);
  res.status(status).json(body);
}

function readJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function validateText(value, field, maxLength = 4000) {
  if (typeof value !== "string" || value.trim().length < 2) {
    return `${field} must contain at least 2 characters.`;
  }
  if (value.length > maxLength) {
    return `${field} must be ${maxLength} characters or fewer.`;
  }
  return null;
}

module.exports = { allowedOrigin, json, readJsonBody, setCors, validateText };
