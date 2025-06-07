import { prisma } from '@/prisma/prisma-client';
// import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { NextAuthOptions, Session, SessionStrategy } from 'next-auth';
import { JWT } from 'next-auth/jwt';
// import { User } from '@prisma/client';
const JWT_SECRET = process.env.NEXTAUTH_SECRET;
console.log(JWT_SECRET);

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log(credentials);
        if (!credentials) {
          // Например, возвращаем null, если credentials нет
          return null;
        }
        try {
          const user = await prisma.user.findFirst({
            where: { username: credentials.username as string },
          });

          if (!user) throw new Error('User not found');

          const isValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isValid) throw new Error('Invalid password');

          return {
            id: user.id.toString(),
            username: user.username,
            name: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' as SessionStrategy },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // secure ставим в false, т.к. у тебя http, не https
        secure: false,
      },
    },
  },
  pages: {
    signIn: '/login',
  },
  // secret: JWT_SECRET,
};
