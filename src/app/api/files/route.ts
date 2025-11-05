// src/app/api/files/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/user";

// GET /api/files
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Temporary fallback email if needed
    const clerkUser = { id: userId, email: "temp@example.com" };
    const user = await syncUser(clerkUser);

    const files = await prisma.file.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(files);
  } catch (err) {
    console.error("GET /api/files error:", err);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

// POST /api/files
export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email: string = typeof sessionClaims?.email === "string" ? sessionClaims.email : "temp@example.com";
    const user = await syncUser({ id: userId, email });

    const body = await req.json();
    const { name, size, url } = body;

    if (!name || !size || !url) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    const newFile = await prisma.file.create({
      data: {
        name,
        size: Number(size),
        url,
        userId: user.id,
      },
    });

    return NextResponse.json(newFile);
  } catch (err) {
    console.error("POST /api/files error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

// DELETE /api/files
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
    }

    await prisma.file.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/files error:", err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
