import prisma from "../../index";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    message: "Bank API working",
  });
};

export const POST = async (req: Request) => {
  const { token, userId, amount } = await req.json();

  try {
    const transaction = await prisma.onRampTransaction.findFirst({
      where: {
        token,
        status: "Processing",
      },
    });

    if (transaction) {
      await prisma.$transaction([
        prisma.onRampTransaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "Success",
          },
        }),
        prisma.balance.updateMany({
          where: {
            userId: Number(userId),
          },
          data: {
            amount: {
              increment: Number(amount),
            },
            locked: {
              decrement: Number(amount),
            },
          },
        }),
      ]);

      return NextResponse.json(
        {
          message: "Captured",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "Transaction already completed",
        },
        {
          status: 400,
        }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Error while processing webhook",
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req: Request) => {
  const { token, userId, amount } = await req.json();

  try {
    const transaction = await prisma.onRampTransaction.findFirst({
      where: {
        token,
        status: "Processing",
      },
    });

    if (transaction) {
      await prisma.$transaction([
        prisma.balance.updateMany({
          where: {
            userId: Number(userId),
          },
          data: {
            locked: {
              decrement: Number(amount),
            },
          },
        }),
        prisma.onRampTransaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "Failure",
          },
        }),
      ]);

      return NextResponse.json(
        {
          message: "Transaction Cancelled",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "Transaction doesn't exist",
        },
        {
          status: 400,
        }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Error while processing webhook",
      },
      {
        status: 500,
      }
    );
  }
};
