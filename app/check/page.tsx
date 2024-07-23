import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "@/index";
import ApproveTransactions from "@/components/ApproveTransactions";

async function getTransactions() {
  const session = await getServerSession(authOptions);
  const userId = session.user?.id;
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(userId),
      status: "Processing",
    },
  });
  return txns.map((t) => ({
    key: t.id,
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
    token: t.token,
    userId: Number(userId),
  }));
}
export default async function Check() {
  const session = await getServerSession(authOptions);
  const userId = session.user?.id;
  if (!session?.user || !userId) {
    return {
      message: "Unauthenticated request",
    };
  }
  const transactions = await getTransactions();

  return (
    <div>
      <div className="pt-4">
        <ApproveTransactions transactions={transactions} />
      </div>
    </div>
  );
}
