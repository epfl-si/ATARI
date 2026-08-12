import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image?: string;
      userId: string;
      username: string;
      oid: string;
      tid: string;
      groups: string[];
      accreds: string[];
    } & DefaultSession["user"];
    expires: string;
  }

  interface UserInfo {
    sub: string;
    accreds: string[];
    cfs: string[];
    groups: string[];
    name: string;
    rights: string[];
    roles: string[];
    uniqueid: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token: string;
    expires_at: number;
    oid: string;
    tid: string;
    name: string;
    email: string;
    uniqueId: string;
    username: string;
    groups: string[];
    accreds: string[];
    error?: string;
  }
}
