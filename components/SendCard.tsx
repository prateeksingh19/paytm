"use client";
import { useState } from "react";
import createP2PTransactions from "../app/lib/actions/createP2PTxns";
import { Button } from "./button";
import { Card } from "./card";
import { TextInput } from "./textinput";

export function SendCard() {
  const [number, setNumber] = useState(0);
  const [amount, setAmount] = useState(0);
  return (
    <div className="h-[90vh]">
      <Card title="Send">
        <div className="min-w-72 pt-2">
          <TextInput
            label="Number"
            placeholder=""
            onChange={(value) => {
              setNumber(value);
            }}
          />
          <TextInput
            label="Amount"
            placeholder=""
            onChange={(value) => {
              setAmount(value);
            }}
          />
          <div className="pt-4 flex justify-center">
            <Button
              onClick={async () => {
                await createP2PTransactions(amount * 100, number);
                alert("Hi");
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
