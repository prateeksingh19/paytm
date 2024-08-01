import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { authenticator } from "otplib";

export const GET = async () => {
  return NextResponse.json({
    message: "Send OTP api working",
  });
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const otpStore: Record<string, string> = {};

export const POST = async function handler(req: Request) {
  try {
    const { email } = await req.json();
    console.log("Received email:", email);

    const secret = authenticator.generateSecret();
    console.log("Generated OTP Secret:", secret);

    const otp = authenticator.generate(secret);
    console.log("Generated OTP:", otp);

    if (!otp) {
      throw new Error("Failed to generate OTP");
    }

    otpStore[email] = otp;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for Verification",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      {
        message: "OTP sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      {
        message: "Failed to send OTP",
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
};
