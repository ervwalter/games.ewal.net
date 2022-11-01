import { Inter } from "@next/font/google";
import clsx from "clsx";
import ClientLayout from "./client-layout";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx(inter.className, "h-full")}>
      <head>
        <title>Board Games</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />

        <meta name="description" content="I like board games" />
        <link rel="shortcut icon" href="/favicon.png" />
      </head>
      <body className="h-full">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
