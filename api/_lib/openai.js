const crypto = require("node:crypto");

function requestId() {
  return crypto.randomUUID();
}

function openAiHeaders() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured.");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json"
  };
}

async function openAiRequest(path, payload) {
  const response = await fetch(`https://api.openai.com/v1/${path}`, {
    method: "POST",
    headers: openAiHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `OpenAI request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

module.exports = { openAiRequest, requestId };
