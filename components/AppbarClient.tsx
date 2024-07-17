"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Appbar } from "./appbar";

export function AppbarClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return null;
  }
  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut();
          router.push("/api/auth/signin");
        }}
        user={session?.user}
      />
    </div>
  );
}
