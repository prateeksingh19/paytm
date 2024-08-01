import { NextResponse } from "next/server";
import { otpStore } from "../sendotp/route";

export const GET = async () => {
  return NextResponse.json({
    message: "Verify OTP api working",
  });
};

export const POST = async function handler(req: Request) {
  const { email, otp } = await req.json();

  try {
    if (otpStore[email] === otp) {
      delete otpStore[email]; // Remove OTP after successful verification
      return NextResponse.json(
        {
          message: "OTP verifiedsuccesfully",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      {
        message: "Invalid OTP",
      },
      {
        status: 400,
      }
    );
  }
};
