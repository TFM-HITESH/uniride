import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { detect } from "gender-detection"; // Import gender detection package

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
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
      console.log("Attempting sign in for:", profile?.email);

      if (!profile?.email?.endsWith("@vitstudent.ac.in")) {
        console.log("Rejected - Not a VIT email");
        return false;
      }

      try {
        // Extract name & registration number
        const nameParts = user.name?.trim().split(/\s+/) ?? [];
        const regno = nameParts.length > 0 ? nameParts.pop()! : "UNKNOWN_REGNO";
        const fullname = nameParts.join(" ") || "Unknown User";

        // Detect gender based on first name
        const firstName = nameParts[0] ?? "Unknown";
        const gender = detect(firstName) || "unknown"; // Default to "unknown" if detection fails

        console.log(
          `Parsed Name: ${fullname} | RegNo: ${regno} | Gender: ${gender}`
        );

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          console.log("Creating new user");
          await prisma.user.create({
            data: {
              email: user.email!,
              fullname,
              regno,
              gender, // Store detected gender
            },
          });
        } else {
          console.log("User exists:", existingUser);
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.email) {
        if (!token.fullname || !token.regno || !token.gender) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { fullname: true, regno: true, gender: true },
          });

          if (dbUser) {
            token.fullname = dbUser.fullname;
            token.regno = dbUser.regno;
            token.gender = dbUser.gender;
          }
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
