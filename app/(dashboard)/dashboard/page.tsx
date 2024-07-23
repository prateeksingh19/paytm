import { authOptions } from "@/app/lib/auth";
import { Card } from "@/components/card";
import prisma from "@/index";
import { getServerSession } from "next-auth";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { OnRampTransactions } from "@/components/OnRampTransaction";

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
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
  const txns = await prisma.p2PTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
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
