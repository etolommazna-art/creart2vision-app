import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth provisoire "admin" via variables d'env :
 * - ADMIN_EMAIL / ADMIN_PASSWORD
 * - Session en JWT (pas de DB pour l’instant)
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
        const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD ?? "";

        // credentials.* est unknown → on cast en string
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");

        if (email === adminEmail && password === adminPassword) {
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

// Pattern recommandé v5 : extraire handlers puis exporter GET/POST
export const { handlers: { GET, POST } } = NextAuth(authConfig);

// Ne RIEN exporter d'autre (pas de `config`, etc.)
