import { DefaultSession } from "next-auth";

// Extending JWT type (from next-auth/jwt)
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
  }
}

// Extending Session type (from next-auth)
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    idToken?: string;
  }
}
