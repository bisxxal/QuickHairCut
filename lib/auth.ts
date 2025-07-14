import NextAuth, { AuthOptions  } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Add role if you are using it
    };
  }
  interface User {
    role?: string;  // Add this
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user,trigger, session }) {
       if (user) {
      token.role = user.role;  
    }
    if (trigger === "update" && session?.role) {
      console.log('triggering')
      token.role = session.role;
    }
      return token;
    },

    async session({ session, token, user }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub
        // session.user.role = "user"
        session.user.role = token.role as string;
      }
      return session
    },
  },
 
};

export default NextAuth(authOptions);
