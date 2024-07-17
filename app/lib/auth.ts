import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/index";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        number: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        password: { label: "Password", type: "password" },
      },
      // TODO: User credentials type from next-aut
      async authorize(credentials: any) {
        // Do zod validation, OTP validation here
        if (!credentials?.number || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            number: BigInt(credentials.number),
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              email: existingUser.email || "",
              name: existingUser.name || "",
              number: existingUser.number,
              password: existingUser.password,
            };
          } else {
            throw new Error("Invalid password");
          }
        }

        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const user = await prisma.user.create({
            data: {
              number: BigInt(credentials.number),
              password: hashedPassword,
            },
          });

          return {
            id: user.id.toString(),
            email: user.email || "",
            name: user.name || "",
            number: user.number,
            password: user.password,
          };
        } catch (e) {
          console.error(e);
          throw new Error("User creation failed");
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    // TODO: can u fix the type here? Using any is bad
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user, account }: any) {
      if (!user) {
        return false;
      }

      if (account?.provider === "google") {
        await prisma.user.upsert({
          where: { email: user.email || "" },
          update: { name: user.name || "" },
          create: {
            email: user.email || "",
            name: user.name || "",
            password: "", // Handle cases where user signs in with Google
            number: BigInt(0), // Default value or handle appropriately
          },
        });
      }

      return true;
    },
  },
};
