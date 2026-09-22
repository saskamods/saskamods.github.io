const { json, readJsonBody, validateText } = require("./_lib/http");
const { openAiRequest, requestId } = require("./_lib/openai");
const { saveGeneration } = require("./_lib/storage");

module.exports = async function generate(req, res) {
  if (req.method === "OPTIONS") return json(res, 204, {});
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });

  const body = readJsonBody(req);
  const promptError = validateText(body.prompt, "prompt", 2000);
  if (promptError) return json(res, 400, { error: promptError });

  const id = requestId();
  try {
    const data = await openAiRequest("images/generations", {
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt: body.prompt.trim(),
      size: ["1024x1024", "1536x1024", "1024x1536"].includes(body.size) ? body.size : "1024x1024",
      quality: body.quality === "high" ? "high" : "auto",
      n: 1
    });

    const image = data?.data?.[0];
    if (!image) throw new Error("The image model returned no image.");

    const result = {
      revisedPrompt: image.revised_prompt || null,
      imageBase64: image.b64_json || null,
      imageUrl: image.url || null
    };
    const persisted = await saveGeneration({ type: "image", prompt: body.prompt.trim(), result, requestId: id });
    return json(res, 200, { ok: true, requestId: id, ...result, ...persisted });
  } catch (error) {
    console.error(`[${id}] image error`, error);
    const status = error.status === 401 ? 502 : 500;
    return json(res, status, { ok: false, requestId: id, error: "AI image request failed.", detail: error.message });
  }
};
