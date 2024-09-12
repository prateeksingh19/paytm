import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import prisma from "@/index";

async function getBalance() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : null;
  if (!userId) {
    return { amount: 0, locked: 0 };
  }
  const balance = await prisma.balance.findFirst({
    where: {
      userId: userId,
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

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
  });
  return txns.map((t) => ({
    key: t.id,
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

export default async function TransferPage() {
  const balance = await getBalance();
  const transactions = await getOnRampTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoney />
        </div>
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4">
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
