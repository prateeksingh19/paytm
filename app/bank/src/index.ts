import express from "express";
import prisma from "../../../index";
const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  // TODO: Add zod validation here?
  // TODO: HDFC bank should ideally send us a secret so we know this is sent by them
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  try {
    const transaction = await prisma.onRampTransaction.findFirst({
      where: {
        token: paymentInformation.token,
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
            userId: Number(paymentInformation.userId),
          },
          data: {
            amount: {
              increment: Number(paymentInformation.amount),
            },
          },
        }),
      ]);

      res.json({
        message: "Captured",
      });
    } else {
      res.status(400).json({
        message: "Transaction already completed",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
