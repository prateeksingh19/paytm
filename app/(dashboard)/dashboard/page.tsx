import { Card } from "@/components/card";

export default function DashboardPage() {
  return (
    <div>
      <div>Dashboard</div>
      <Card title={"OnRamp Transactions"} />
      <Card title={"P2P Transactions"} />
    </div>
  );
}
