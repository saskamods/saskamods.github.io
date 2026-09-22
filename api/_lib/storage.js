const { createClient } = require("@supabase/supabase-js");

let client;

function getSupabase() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

async function saveGeneration({ type, prompt, result, requestId }) {
  const supabase = getSupabase();
  if (!supabase) return { persisted: false };

  const { error } = await supabase.from("ai_generations").insert({
    type,
    prompt,
    result,
    request_id: requestId
  });

  if (error) throw error;
  return { persisted: true };
}

module.exports = { getSupabase, saveGeneration };
