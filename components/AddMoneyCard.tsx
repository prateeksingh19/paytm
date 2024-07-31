"use client";
import { useState } from "react";

import createOnRampTransaction from "../app/lib/actions/createOnRampTxns";
import { Button } from "./button";
import { Card } from "./card";
import { Select } from "./select";
import { TextInput } from "./textinput";
import { useRouter } from "next/navigation";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const AddMoney = () => {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name);
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleSubmit = async () => {
    const numericAmount = parseInt(amount) || 0;
    await createOnRampTransaction(numericAmount * 100, provider || "");
    router.push(redirectUrl || "");
  };

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          value={amount}
          onChange={(value: string) => handleAmountChange(value)}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={(value) => {
            const selectedBank = SUPPORTED_BANKS.find((x) => x.name === value);
            setProvider(selectedBank?.name || "");
            setRedirectUrl(selectedBank?.redirectUrl || "");
          }}
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button onClick={handleSubmit}>Add Money</Button>
        </div>
      </div>
    </Card>
  );
};
