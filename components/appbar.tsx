"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: any;
  onSignout: any;
}
export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="flex justify-between border-b px-4">
      <div
        className="text-lg flex flex-col justify-center hover:cursor-pointer"
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        PayTM
      </div>
      <div className="flex justify-center pt-2">
        {pathname == "/check" ? (
          <Button
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Go Back
          </Button>
        ) : (
          <Button
            onClick={() => {
              router.push("/check");
            }}
          >
            Check
          </Button>
        )}
        <Button onClick={user ? onSignout : onSignin}>
          {user ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
};
