import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import "./typo.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = localFont({
  src: [
    {
      path: '../public/fonts/poppins-regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/poppins-regular-webfont.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "ShobPai E-Commerce - Farm Fresh Organic Store",
  description: "Fresh organic fruits, vegetables, dairy & groceries delivered to your door.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
