import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}
