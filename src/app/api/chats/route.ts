import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/user";

// GET /api/chats - list user's saved chats
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = { id: userId, email: "temp@example.com" };
    const user = await syncUser(clerkUser);

    const chats = await prisma.savedChat.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, fileName: true, createdAt: true },
    });

    return NextResponse.json(chats);
  } catch (err) {
    console.error("GET /api/chats error:", err);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

// POST /api/chats - save a chat
export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email: string = typeof sessionClaims?.email === "string" ? sessionClaims.email : "temp@example.com";
    const user = await syncUser({ id: userId, email });

    const body = await req.json();
    const { fileName, messages, context } = body;

    if (!fileName || !Array.isArray(messages) || !context) {
      return NextResponse.json({ error: "Missing fileName, messages, or context" }, { status: 400 });
    }

    const chat = await prisma.savedChat.create({
      data: {
        fileName,
        messages,
        context: String(context),
        userId: user.id,
      },
    });

    return NextResponse.json({ id: chat.id, fileName: chat.fileName });
  } catch (err) {
    console.error("POST /api/chats error:", err);
    return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
  }
}
