import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { detect } from "gender-detection";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },

  callbacks: {
    async signIn({ user, profile }) {
      if (!profile?.email?.endsWith("@vitstudent.ac.in")) return false;

      const nameParts = user.name?.trim().split(/\s+/) ?? [];
      const regno = nameParts.length > 0 ? nameParts.pop()! : "UNKNOWN_REGNO";
      const fullname = nameParts.join(" ") || "Unknown User";
      const firstName = nameParts[0] ?? "Unknown";
      const gender = detect(firstName) || "unknown";

      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        await db.user.create({
          data: {
            email: user.email!,
            fullname,
            regno,
            gender,
          },
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email && (!token.fullname || !token.regno || !token.gender)) {
        const dbUser = await db.user.findUnique({
          where: { email: user.email },
          select: { fullname: true, regno: true, gender: true },
        });

        if (dbUser) {
          token.fullname = dbUser.fullname;
          token.regno = dbUser.regno;
          token.gender = dbUser.gender;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          email: token.email ?? session.user.email,
          fullname: token.fullname ?? undefined,
          regno: token.regno ?? undefined,
          gender: token.gender ?? "unknown",
        };
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return `${baseUrl}/dashboard`;
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
