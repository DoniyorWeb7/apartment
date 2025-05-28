import { authConfig } from '@/app/auth.config';
import NextAuth from 'next-auth';
export const runtime = 'nodejs';
console.log('Running ...');
const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
