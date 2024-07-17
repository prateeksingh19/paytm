"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@/index";

export default async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  const session = await getServerSession(authOptions);
  const userId = session.user?.id;
  const token = Math.random().toString(); // generate proper token
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  const res = await prisma.balance.findFirst({
    where: {
      userId: Number(userId),
    },
  });
  if (!res) {
    await prisma.balance.create({
      data: {
        amount: 0,
        locked: 0,
        userId: Number(userId),
      },
    });
  }
  await prisma.onRampTransaction.create({
    data: {
      provider,
      amount: amount,
      status: "Processing",
      startTime: new Date(),
      token: token,
      userId: Number(userId),
    },
  });
  return {
    message: "On ramp transaction added",
  };
}
