import { Inter } from "@next/font/google";
import localFont from "@next/font/local";
import clsx from "clsx";
import "./global.css";
import Sidebar from "./sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const glyphicons = localFont({ variable: "--font-icons", src: "../fonts/icons.woff" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={clsx(inter.variable, glyphicons.variable, "h-full")}>
      <head>
        <title>Board Games</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#ffffff" />

        <meta name="description" content="I like board games" />
        <link rel="shortcut icon" href="/favicon.png" />
      </head>
      <body className="h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col md:pl-52 lg:pl-64">
          <main className="flex-1">
            <div className="min-h-screen max-w-6xl border-gray-200 bg-gray-50 px-4 py-6 md:border-r md:px-6">
              <div>{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
