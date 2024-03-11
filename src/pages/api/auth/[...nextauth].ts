import NextAuth, { AuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import prismaClient from '@viniciusgdr/db/prismaClient'
import { Session } from '@viniciusgdr/models/session'

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/account/login',
    newUser: '/account/register'
  },
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req): Promise<any> => {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if (!emailRegex.test(email)) {
          throw new Error("Formato de email inválido!")
        }
        const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS as string)
        const user = await prismaClient.user.findUnique({
          where: {
            email,
            password: hashedPassword
          }
        });
        if (!user) {
          throw new Error("E-mail não encontrado ou senha inválida!")
        }
        if (!user.approved) {
          throw new Error("O usuário ainda não foi aprovado pelo administrador!")
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    signIn: async ({ user, account, credentials }) => {
      const { email } = user;
      const userExists = await prismaClient.user.findUnique({
        where: {
          email: email as string
        }
      });
      if (!userExists) {
        return false
      }
      return true;
    },
    session: async ({ session, user }) => {
      if (!session.user) {
        return session
      }
      const { user: { email } } = session as Session;
      const userExists = await prismaClient.user.findUnique({
        where: {
          email: email as string
        }
      });
      if (userExists) {
        return {
          ...session,
          user: {
            ...session.user,
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
            image: null
          }
        }
      }
      return session;
    }
  }
}

export default NextAuth(authOptions)