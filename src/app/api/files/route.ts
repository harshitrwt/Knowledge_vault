import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/user";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  
    const clerkUser = { id: userId, email: "temp@example.com" }; 
    let user = await syncUser(clerkUser);

    const files = await prisma.file.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(files);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = sessionClaims?.email as string;

  
    const user = await syncUser({ id: userId, email });

    const body = await req.json();
    const { name, size, url } = body;

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
    console.error(err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    await prisma.file.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}

