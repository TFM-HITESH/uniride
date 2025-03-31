import "next-auth";

declare module "next-auth" {
  interface User {
    fullname?: string;
    regno?: string;
  }

  interface Session {
    user: {
      fullname?: string;
      regno?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    fullname?: string;
    regno?: string;
  }
}
