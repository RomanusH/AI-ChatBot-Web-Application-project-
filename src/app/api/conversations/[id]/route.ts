import { prisma } from "@/lib/prisma";
import { json, apiError } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!conversation) return apiError("Conversation not found", 404);
    return json(conversation);
  } catch (e) {
    console.error("GET /api/conversations/[id]", e);
    return apiError("Failed to get conversation", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  let body: { title?: string };
  try {
    body = (await request.json()) as { title?: string };
  } catch {
    return apiError("Invalid JSON body", 400);
  }
  const title = typeof body.title === "string" ? body.title.trim() : undefined;
  if (title === undefined) return apiError("Missing or invalid title", 400);
  try {
    const conversation = await prisma.conversation.update({
      where: { id },
      data: { title },
    });
    return json(conversation);
  } catch (e) {
    if ((e as { code?: string })?.code === "P2025")
      return apiError("Conversation not found", 404);
    console.error("PATCH /api/conversations/[id]", e);
    return apiError("Failed to update conversation", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    await prisma.conversation.delete({ where: { id } });
    return json({ ok: true });
  } catch (e) {
    if ((e as { code?: string })?.code === "P2025")
      return apiError("Conversation not found", 404);
    console.error("DELETE /api/conversations/[id]", e);
    return apiError("Failed to delete conversation", 500);
  }
}
