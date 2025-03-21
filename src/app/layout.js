import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/ui/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Proton CRM",
  description: "AI-powered content curation and delivery system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <MainNav />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
