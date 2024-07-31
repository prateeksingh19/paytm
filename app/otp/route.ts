import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    message: "otp api working",
  });
};

// pages/api/send-otp.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "adarsh.seth02291@gmail.com",
        pass: "irzejgnedwucjoeq",
    },
});

const otpStore: Record<string, string> = {};

export const POST = async function handler(req: Request) {
    // if (req.method !== 'POST') {
    //     return res.status(405).send({ message: 'Only POST requests are allowed' });
    // }

    const { email } = await req.json();

    // if (!email) {
    //     return res.status(400).send({ message: 'Email is required' });
    // }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP with the email (in-memory storage example)
    otpStore[email] = otp;

    const mailOptions = {
        from: "adarsh.kumar02291@gmail.com",
        to: email,
        subject: 'OTP for Verification',
        text: `Your OTP is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json(
            {
              message: "otp sent succesfully",
            },
            {
              status: 200,
            }
          );
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json(
            {
              message: "Failed",
            },
            {
              status: 400,
            }
          );
    }
}
