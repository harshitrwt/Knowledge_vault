import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/user";

// GET /api/chats/[id] - get full chat (messages + context)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await syncUser({ id: userId, email: "temp@example.com" });
    const { id } = await params;

    const chat = await prisma.savedChat.findFirst({
      where: { id, userId: user.id },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: chat.id,
      fileName: chat.fileName,
      messages: chat.messages as { role: string; content: string }[],
      context: chat.context,
    });
  } catch (err) {
    console.error("GET /api/chats/[id] error:", err);
    return NextResponse.json({ error: "Failed to load chat" }, { status: 500 });
  }
}

// DELETE /api/chats/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await syncUser({ id: userId, email: "temp@example.com" });
    const { id } = await params;

    await prisma.savedChat.deleteMany({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/chats/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}
