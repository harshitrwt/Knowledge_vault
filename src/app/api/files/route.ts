import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const files = await prisma.file.findMany({
      where: { userId: "test-user" },
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
    const body = await req.json();
    const { name, size, url } = body;

    const newFile = await prisma.file.create({
      data: {
        name,
        size: Number(size),
        url,
        userId: "test-user",
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
    const body = await req.json();
    const { id } = body;

    await prisma.file.delete({
      where: { id },
    });

    return NextResponse.json({ message: "File deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
