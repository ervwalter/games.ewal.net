import { Inter } from "@next/font/google";
import localFont from "@next/font/local";
import clsx from "clsx";
import "./global.css";
import Sidebar from "./sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const glyphicons = localFont({ variable: "--font-glyphicons", src: "../fonts/glyphicons-halflings-regular.woff2" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={clsx(inter.variable, glyphicons.variable, "h-full md:overflow-y-scroll")}>
      <head>
        <title>Board Games</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000" />

        <meta name="description" content="I like board games" />
        <link rel="shortcut icon" href="/favicon.png" />
      </head>
      <body className="h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col md:pl-52 lg:pl-64">
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-5xl px-4 sm:px-6 md:px-8">
                <div>{children}</div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
