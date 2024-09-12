import { authOptions } from "@/app/lib/auth";
import prisma from "@/index";
import { getServerSession } from "next-auth";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { OnRampTransactions } from "@/components/OnRampTransaction";
import { getSession } from "next-auth/react";

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : null;
  if (!userId) {
    return [];
  }
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      startTime: "desc",
    },
    take: 5,
  });
  return txns.map((t) => ({
    key: t.id,
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : null;
  if (!userId) {
    return [];
  }
  const txns = await prisma.p2PTransfer.findMany({
    where: {
      fromUserId: userId,
    },
    include: {
      toUser: true,
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 5,
  });
  return txns.map((t) => ({
    key: t.id,
    time: t.timestamp,
    amount: t.amount,
    to: Number(t.toUser.number),
  }));
}

export default async function DashboardPage() {
  const P2PTxns = await getP2PTransactions();
  const Txns = await getOnRampTransactions();
  return (
    <div className="mr-16 w-screen">
      <OnRampTransactions transactions={Txns} />
      <P2PTransactions transactions={P2PTxns} />
    </div>
  );
}
