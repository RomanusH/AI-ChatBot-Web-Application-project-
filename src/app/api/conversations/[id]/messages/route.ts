import { prisma } from "@/lib/prisma";
import { json, apiError, parseJsonBody } from "@/lib/api";
import { MessageRole } from "@prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const conversationId = (await params).id;
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
    return json(messages);
  } catch (e) {
    console.error("GET /api/conversations/[id]/messages", e);
    return apiError("Failed to list messages", 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const conversationId = (await params).id;
  const body = parseJsonBody<{ role: string; content: string }>(await request.text());
  if (!body?.content || typeof body.content !== "string")
    return apiError("Missing or invalid content", 400);
  const role = (body.role === "user" || body.role === "assistant" || body.role === "system")
    ? (body.role as MessageRole)
    : "user";
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) return apiError("Conversation not found", 404);
    const message = await prisma.message.create({
      data: { conversationId, role, content: body.content.trim() },
    });
    return json(message, 201);
  } catch (e) {
    console.error("POST /api/conversations/[id]/messages", e);
    return apiError("Failed to create message", 500);
  }
}
