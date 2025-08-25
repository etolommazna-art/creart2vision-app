import type { NextRequest } from "next/server";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth provisoire "admin" via variables d'env :
 * - ADMIN_EMAIL / ADMIN_PASSWORD
 * - Session en JWT (pas de DB pour l’instant)
 * - Suffisant pour /admin. On branchera PrismaAdapter ensuite si besoin.
 */
const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Connexion admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL || "";
        const adminPassword = process.env.ADMIN_PASSWORD || "";

        const email = (credentials?.email || "").toLowerCase().trim();
        const password = credentials?.password || "";

        if (email === adminEmail.toLowerCase() && password === adminPassword) {
          return { id: "admin-0001", name: "Admin", email: adminEmail };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "ADMIN";
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role ?? "ADMIN";
      return session;
    },
  },
};

// On instancie NextAuth et on exporte des handlers GET/POST explicites
const authHandlers = NextAuth(authConfig);

// Types explicites pour lever toute ambiguïté côté Next
export const GET: (req: NextRequest) => Promise<Response> = authHandlers.GET;
export const POST: (req: NextRequest) => Promise<Response> = authHandlers.POST;

// Ne RIEN exporter d'autre (pas de `config`, pas d'autres const)
