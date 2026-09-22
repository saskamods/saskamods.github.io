const { json, readJsonBody, validateText } = require("./_lib/http");
const { openAiRequest, requestId } = require("./_lib/openai");
const { saveGeneration } = require("./_lib/storage");

module.exports = async function chat(req, res) {
  if (req.method === "OPTIONS") return json(res, 204, {});
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });

  const body = readJsonBody(req);
  const promptError = validateText(body.message, "message", 6000);
  if (promptError) return json(res, 400, { error: promptError });

  const id = requestId();
  const messages = Array.isArray(body.history) ? body.history.slice(-10) : [];
  const safeHistory = messages
    .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
    .map((item) => ({ role: item.role, content: item.content.slice(0, 6000) }));

  try {
    const data = await openAiRequest("chat/completions", {
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are SASKA AI, a concise, helpful assistant for creative, coding, productivity, and business tasks. Do not claim to have performed external actions."
        },
        ...safeHistory,
        { role: "user", content: body.message.trim() }
      ],
      temperature: 0.7,
      max_tokens: 900
    });

    const result = data?.choices?.[0]?.message?.content?.trim();
    if (!result) throw new Error("The AI returned an empty response.");

    const persisted = await saveGeneration({ type: "chat", prompt: body.message.trim(), result, requestId: id });
    return json(res, 200, { ok: true, requestId: id, result, ...persisted });
  } catch (error) {
    console.error(`[${id}] chat error`, error);
    const status = error.status === 401 ? 502 : 500;
    return json(res, status, { ok: false, requestId: id, error: "AI chat request failed.", detail: error.message });
  }
};
