import { apiError } from "@/lib/api";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-3.5-turbo";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return apiError(
      "OPENROUTER_API_KEY is not set. Add it in Vercel environment variables.",
      503
    );
  }

  let body: { messages?: Array<{ role: string; content: string }>; model?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return apiError("messages array is required and must not be empty", 400);
  }

  const model = typeof body.model === "string" && body.model.trim()
    ? body.model.trim()
    : DEFAULT_MODEL;

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000",
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
      signal: request.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenRouter error", res.status, text);
      return apiError(
        `OpenRouter request failed: ${res.status}`,
        res.status >= 500 ? 502 : 400
      );
    }

    const reader = res.body?.getReader();
    if (!reader) {
      return apiError("No response body from OpenRouter", 502);
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      return new Response(null, { status: 499 });
    }
    console.error("POST /api/chat", e);
    return apiError("Chat request failed", 500);
  }
}
