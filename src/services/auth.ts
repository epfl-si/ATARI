import NextAuth, { type Session } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const decodeJWT = (token: string) => JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.ENTRA_ID,
      clientSecret: process.env.ENTRA_SECRET,
      issuer: process.env.ENTRA_ISSUER,
      authorization: {
        params: {
          scope: `openid email profile ${process.env.ENTRA_ID}/.default`,
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/api/auth/", error: "/error" },
  callbacks: {
    authorized: async ({ auth }) => !!auth,

    jwt: async ({ token, account }) => {
      try {
        if (account?.access_token && account?.id_token) {
          const [accessToken, idToken] = await Promise.all([
            decodeJWT(account.access_token),
            decodeJWT(account.id_token),
          ]);

          return {
            ...token,
            expires_at: account.expires_at as number,
            oid: idToken.oid,
            tid: accessToken.tid,
            email: idToken.email,
            picture: token.picture,
            uniqueId: idToken.uniqueid,
            username: idToken.gaspar,
            groups: idToken.groups || [],
            name: `${idToken.given_name} ${idToken.family_name}`,
          };
        }

        if (!token.access_token) return token;

        const { exp } = decodeJWT(token.access_token as string);
        if (Date.now() < exp * 1000) return token;

        return { ...token, error: "TokenExpired" };
      } catch (error) {
        console.error("Error processing tokens:", error);
        return { ...token, error: "TokenProcessingError" };
      }
    },

    session: async ({ session, token }): Promise<Session> => ({
      ...session,
      user: {
        email: token.email ?? session.user?.email,
        name: token.name,
        userId: token.uniqueId,
        username: token.username,
        oid: token.oid,
        tid: token.tid,
        groups: token.groups ?? [],
        accreds: token.accreds ?? [],
      },
    }),
  },
});

export async function getUser() {
  const session = await auth();
  if (!session?.user) throw new Error("User not authenticated");
  return session.user;
}

export async function getUserGroups(): Promise<string[]> {
  const user = await getUser();
  return user.groups ?? [];
}
