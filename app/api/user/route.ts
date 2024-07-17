// In app/api/user/route.ts
import prisma from "@/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  await prisma.user.create({
    data: {
      email: "asd11",
      name: "adsads",
      password: "123",
      number: 12311,
    },
  });
  return NextResponse.json({
    message: "hi there",
  });
};
