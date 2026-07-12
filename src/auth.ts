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
        },
      }) as any;
    },
  },
  ...authConfig,
})