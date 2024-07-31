"use client";
import { useState } from "react";

import createOnRampTransaction from "../app/lib/actions/createOnRampTxns";
import { Button } from "./button";
import { Card } from "./card";
import { Select } from "./select";
import { TextInput } from "./textinput";

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
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name);
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(value: number) => {
            setAmount(value);
          }}
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
          <Button
            onClick={async () => {
              await createOnRampTransaction(amount * 100, provider || "");
              window.location.href = "/email-verfication";
            }}
          >
            Add Money
          </Button>
        </div>
      </div>
    </Card>
  );
};
