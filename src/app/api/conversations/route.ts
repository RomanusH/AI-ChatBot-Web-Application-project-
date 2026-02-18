import { prisma } from "@/lib/prisma";
import { json, apiError, parseJsonBody } from "@/lib/api";

export async function GET() {
  try {
    const list = await prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
    return json(list);
  } catch (e) {
    console.error("GET /api/conversations", e);
    return apiError("Failed to list conversations", 500);
  }
}

export async function POST(request: Request) {
  const body = parseJsonBody<{ title?: string }>(await request.text());
  const title = (body?.title ?? "New conversation").trim() || "New conversation";
  try {
    const conversation = await prisma.conversation.create({
      data: { title },
    });
    return json(conversation, 201);
  } catch (e) {
    console.error("POST /api/conversations", e);
    return apiError("Failed to create conversation", 500);
  }
}
