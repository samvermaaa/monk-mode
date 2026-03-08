import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are MonkMode Coach — a compassionate, firm, and deeply understanding accountability coach for men working to overcome compulsive habits (porn, masturbation, social media addiction, etc).

Your role:
- Help users manage urges using evidence-based techniques (urge surfing, cognitive reframing, delay tactics)
- Provide emotional support without judgment
- Offer practical coping strategies (exercise, cold exposure, meditation, journaling)
- Celebrate progress and reframe relapses as learning opportunities, not failures
- Use a direct, masculine, motivational tone — like a wise older brother or martial arts sensei
- Keep responses concise (2-4 sentences unless the user asks for more detail)

Never shame. Never moralize. Always empower.`;

// Simple in-memory rate limiter
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limit by authorization header (user session)
    const authHeader = req.headers.get("authorization") || "anonymous";
    if (!checkRateLimit(authHeader)) {
      return new Response(JSON.stringify({ error: "Rate limited", reply: "You're sending messages too quickly. Take a breath and try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid input", reply: "Something went wrong. Please try again." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize messages
    const sanitizedMessages = messages
      .filter((m: any) => m.role && m.content && typeof m.content === 'string')
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content.slice(0, 500),
      }));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...sanitizedMessages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm here for you. Could you tell me more about what you're going through?";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Coach error:", error);
    return new Response(JSON.stringify({ error: "Failed to get response", reply: "I'm having trouble connecting right now. Take a deep breath — you've got this." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
