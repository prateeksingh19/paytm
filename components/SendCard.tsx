"use client";
import { useState } from "react";
import createP2PTransactions from "../app/lib/actions/createP2PTxns";
import { Button } from "./button";
import { Card } from "./card";
import { TextInput } from "./textinput";
import { useRouter } from "next/navigation";

export function SendCard() {
  const router = useRouter();
  const [number, setNumber] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  const handleNumberChange = (value: string) => {
    const numericValue = parseInt(value);
    setNumber(isNaN(numericValue) ? 0 : numericValue);
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseInt(value);
    setAmount(isNaN(numericValue) ? 0 : numericValue);
  };

  return (
    <div className="h-[90vh]">
      <Card title="Send">
        <div className="min-w-72 pt-2">
          <TextInput
            label="Number"
            placeholder=""
            onChange={handleNumberChange}
          />
          <TextInput
            label="Amount"
            placeholder=""
            onChange={handleAmountChange}
          />
          <div className="pt-4 flex justify-center">
            <Button
              onClick={async () => {
                await createP2PTransactions(amount * 100, number);
                router.refresh();
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
