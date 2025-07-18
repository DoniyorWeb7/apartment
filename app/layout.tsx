import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import 'react-image-gallery/styles/css/image-gallery.css';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <main className="w-full">
            <div className="p-4 w-full">
              <Providers>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange>
                  {children}
                </ThemeProvider>
              </Providers>

              <Toaster />
            </div>
          </main>
        </body>
      </html>
    </>
  );
}
