import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { verifyPassword } from "./hash";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          userType: user.userType,
          accountStatus: user.accountStatus,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? "";
        token.email = user.email ?? "";
        token.userType = (user as { userType?: string }).userType ?? "";
        token.accountStatus =
          (user as { accountStatus?: string }).accountStatus ?? "";
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      // Sesiones previas se completan aquí.
      if (token.id && (!token.userType || !token.accountStatus)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { userType: true, accountStatus: true, isAdmin: true },
        });
        token.userType = token.userType || dbUser?.userType || "";
        token.accountStatus = token.accountStatus || dbUser?.accountStatus || "";
        if (token.isAdmin === undefined) {
          token.isAdmin = dbUser?.isAdmin ?? false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        userType: token.userType as string,
        accountStatus: token.accountStatus as string,
        isAdmin: Boolean(token.isAdmin),
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
