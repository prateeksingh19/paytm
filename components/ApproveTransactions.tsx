"use client";
import axios from "axios";
import { Card } from "./card";
import TransactionStatus from "./transactionStatus";
import { useRouter } from "next/navigation";

export default function ApproveTransactions({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: string;
    provider: string;
    token: string;
    userId: number;
  }[];
}) {
  const router = useRouter();
  if (!transactions.length) {
    return (
      <Card title="Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  async function approveTxns(userId: number, amount: number, token: string) {
    try {
      const res = await axios.post("/bank", {
        userId,
        token,
        amount,
      });
      if (res.status === 200) {
        alert(
          `Transaction with Token: ${token} of Amount: ${
            amount / 100
          } completed successfully`
        );
        router.refresh();
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 400) {
          alert("Transaction already completed");
        } else {
          alert("Error while processing webhook");
        }
      }
    }
  }

  async function cancelTxns(token: string, amount: number) {
    try {
      const res = await axios.delete("/bank", {
        data: { token },
      });
      if (res && res.status === 200) {
        alert(
          `Transaction with Token: ${token} of Amount: ${
            amount / 100
          } completed successfully`
        );
        router.refresh();
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("Transaction doesnt exist");
        } else {
          alert("Error while processing webhook");
        }
      }
    }
  }
  return (
    <Card title="Transactions">
      <div className="pt-2">
        {transactions.map((t, index) => (
          <div key={index} className="flex justify-between pt-2">
            <div className="flex">
              <div className="">
                <div className="text-sm">Money Deposited</div>
                <div className="text-slate-600 text-xs">
                  {t.time.toDateString()}
                </div>
              </div>
              <div className="">
                <TransactionStatus status={t.status} />
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col justify-center">
                + Rs {t.amount / 100}
              </div>
              <div className="m-2">
                <button
                  onClick={() => {
                    approveTxns(t.userId, t.amount, t.token);
                  }}
                >
                  Approve
                </button>
              </div>
              <div className="m-2">
                <button
                  onClick={() => {
                    cancelTxns(t.token, t.amount);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
