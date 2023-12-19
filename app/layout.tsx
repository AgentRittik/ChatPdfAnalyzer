import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {ClerkProvider} from '@clerk/nextjs';
const inter = Inter({ subsets: ['latin'] })
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';
export const metadata: Metadata = {
  title: 'ChatPDF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider> 
       {/*recat query does lots of catching */}
        <html lang="en">
          <body className={inter.className}>
            <Providers><Toaster />{children}</Providers>
          </body>
        </html>
        
      
    </ClerkProvider>
  );
}
