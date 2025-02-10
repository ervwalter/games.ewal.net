import { Inter } from "next/font/google";
import localFont from "next/font/local";
import clsx from "clsx";
import { ImGithub } from "react-icons/im";
import { Analytics } from "@vercel/analytics/react";
import "./global.css";
import Sidebar from "./sidebar";
import { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const glyphicons = localFont({ 
  src: [
    {
      path: "../fonts/icons.woff",
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-icons",
  preload: true,
  display: "block",
  fallback: ["sans-serif"]
});

export const metadata: Metadata = {
  title: {
    template: '%s | Board Games',
    default: 'Board Games'
  },
  description: "I like board games",
  icons: {
    icon: '/favicon.png'
  }
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={clsx(inter.variable, glyphicons.variable, "h-full")}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className="h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col md:pl-52 lg:pl-64">
          <div className="flex-1">
            <div className="max-w-6xl min-h-screen bg-gray-50 px-4 pt-6 pb-4 md:border-gray-200 md:border-r md:px-6 flex flex-col">
              <main className="flex-1">{children}</main>
              <footer className="pt-8 md:pt-6">
                <div className="flex items-center">
                  <div className="flex justify-center pr-4">
                    <a
                      href="https://github.com/ervwalter"
                      className="text-gray-400 hover:text-gray-500"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span className="sr-only">GitHub</span>
                      <ImGithub className="h-6 w-6" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="mt-0">
                    <p className="text-center text-base text-gray-400">&copy; {new Date().getFullYear()} Erv Walter</p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
