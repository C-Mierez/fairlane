import "@/styles/globals.css";

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";

import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@components/ui/sonner";

const mpRegular = localFont({
    src: "../../styles/fonts/MP-Regular.woff2",
    variable: "--font-mp-regular",
});

const mpMedium = localFont({
    src: "../../styles/fonts/MP-Medium.woff2",
    variable: "--font-mp-medium",
});

const mpBold = localFont({
    src: "../../styles/fonts/MP-Bold.woff2",
    variable: "--font-mp-bold",
});

const mpBlack = localFont({
    src: "../../styles/fonts/MP-Black.woff2",
    variable: "--font-mp-black",
});

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Fairlane",
    description: "A simple place to sell your products",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={` ${dmSans.variable} ${mpRegular.variable} ${mpMedium.variable} ${mpBold.variable} ${mpBlack.variable} antialiased`}
            >
                <TRPCReactProvider>{children}</TRPCReactProvider>
                <Toaster />
            </body>
        </html>
    );
}
