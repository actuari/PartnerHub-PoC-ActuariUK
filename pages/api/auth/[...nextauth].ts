import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { mockEmployer, mockUser } from "../../../prisma/mock";
import { adminAuth } from "../../../lib/firebaseAdmin";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      id: "firebase",
      name: "Firebase",
      credentials: {
        idToken: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;
        try {
          const decoded = await adminAuth.verifyIdToken(credentials.idToken);
          return {
            id: decoded.uid,
            email: decoded.email || null,
            name: decoded.name || decoded.email?.split("@")[0] || "User",
          };
        } catch {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "employer",
      name: "Mock Employer",
      credentials: {},
      async authorize() {
        return mockEmployer;
      },
    }),
    CredentialsProvider({
      id: "user",
      name: "Mock User",
      credentials: {},
      async authorize() {
        return mockUser;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* invalid url, fall through */
      }
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
};

export default NextAuth(authOptions);
