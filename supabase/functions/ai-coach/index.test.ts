import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { assertExists } from "https://deno.land/std@0.224.0/assert/assert_exists.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/ai-coach`;

Deno.test("ai-coach: OPTIONS returns CORS headers", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "OPTIONS",
    headers: { "apikey": SUPABASE_ANON_KEY },
  });
  await response.text();
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("access-control-allow-origin"), "*");
});

Deno.test("ai-coach: rejects empty messages", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ messages: [] }),
  });
  const data = await response.json();
  assertEquals(response.status, 400);
  assertExists(data.error);
});

Deno.test("ai-coach: rejects oversized messages array", async () => {
  const bigMessages = Array.from({ length: 51 }, (_, i) => ({
    role: "user",
    content: `message ${i}`,
  }));
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ messages: bigMessages }),
  });
  const data = await response.json();
  assertEquals(response.status, 400);
  assertExists(data.error);
});

Deno.test("ai-coach: returns a reply for valid message", async () => {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Hello coach" }],
    }),
  });
  const data = await response.json();
  assertEquals(response.status, 200);
  assertExists(data.reply);
  assertEquals(typeof data.reply, "string");
});
