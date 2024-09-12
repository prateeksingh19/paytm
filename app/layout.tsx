import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppbarClient } from "../components/AppbarClient";
import { Providers } from "./providers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple wallet app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <html lang="en">
      <Providers>
        <AppbarClient />
        <body>{children}</body>
      </Providers>
    </html>
  );
}
