import { prisma } from "./prisma";

export async function syncUser(clerkUser: { id: string; email: string }) {
  //checking if exists
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  //else create them
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.email,
      },
    });
  }

  return user;
}
