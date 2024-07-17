"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@/index";

export default async function createP2PTransactions(
  amount: number,
  number: number
) {
  const session = await getServerSession(authOptions);
  const from = Number(session?.user?.id);
  if (!from) {
    return {
      message: "Error while sending",
    };
  }
  const toUser = await prisma.user.findFirst({
    where: {
      number,
    },
  });
  if (!toUser) {
    return {
      message: "User not found",
    };
  }
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(
      from
    )} FOR UPDATE`;

    const fromBalance = await tx.balance.findUnique({
      where: {
        userId: from,
      },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }
    await tx.balance.update({
      where: { userId: from },
      data: { amount: { decrement: amount } },
    });
    await tx.balance.update({
      where: { userId: toUser.id },
      data: { amount: { increment: amount } },
    });
    await tx.p2PTransfer.create({
      data: {
        amount,
        timestamp: new Date(),
        fromUserId: from,
        toUserId: toUser.id,
      },
    });
  });
}
