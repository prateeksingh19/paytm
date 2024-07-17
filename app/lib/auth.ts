import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import prisma from "@/db";
import { Account, User, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomUser extends User {
  id: string;
  number: bigint;
  password: string;
}

export const authOptions: NextAuthOptions = {
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
      async authorize(credentials) {
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
            } as CustomUser;
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
          } as CustomUser;
        } catch (e) {
          console.error(e);
          throw new Error("User creation failed");
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user, account }) {
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
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as CustomUser).id;
      }
      return token;
    },
  },
};
