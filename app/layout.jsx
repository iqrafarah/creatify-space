import "./globals.css";
import NavBar from "@/components/navBar";
import { Inter } from 'next/font/google';

export const metadata = {
  title: "Creatify",
  description: "Easily build your professional portfolio in seconds",
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}