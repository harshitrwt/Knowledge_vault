import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const payload = await req.json();
  const heads = headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
  try {
    const evt = wh.verify(JSON.stringify(payload), {
      "svix-id": (await heads).get("svix-id")!,
      "svix-timestamp": (await heads).get("svix-timestamp")!,
      "svix-signature": (await heads).get("svix-signature")!,
    }) as { type: string; data: any };

    if (evt.type === "user.created") {
      const { id, email_addresses } = evt.data;

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email: email_addresses[0].email_address,
        },
      });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error", err);
    return new Response("Error", { status: 400 });
  }
}
