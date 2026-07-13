import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma" 
import authConfig from "./auth.config"

const CITIES = ["Tokyo", "Denver", "Helsinki", "Nairobi", "Berlin", "Rio", "Moscow", "Oslo", "Bogota", "Palermo"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (user: any) => {
      const codename = CITIES[Math.floor(Math.random() * CITIES.length)];
      return prisma.user.create({
        data: {
          ...user,
          codename,
          roles: {
            create: [{
              role: { connectOrCreate: { where: { name: "USER" }, create: { name: "USER", description: "Standard user access" } } }
            }]
          }
        },
      }) as any;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes — confirm this is the intended session length (see note below)
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login', // Tells NextAuth to route users here for login
  },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt(params: any) {
      const { token, user, account } = params;
      let finalUser = user;

      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
          codename: user.codename,
        };
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.userId;
        session.user.codename = token.codename;
      }
      return {
        ...session,
        // GitHub OAuth App tokens don't expire, so this is just the
        // original access token — safe for server components to use
        // to call the GitHub API on the user's behalf. Read server-side only.
        accessToken: token.accessToken,
      };
    },
  },
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { roles: { include: { role: true } } }
        });
        const roles = dbUser?.roles.map((r: any) => r.role.name) || [];
        
        finalUser = { ...user, roles };
      }

      if (authConfig.callbacks?.jwt) {
        return authConfig.callbacks.jwt({ ...params, user: finalUser });
      }

      return token;
    }
  }
})