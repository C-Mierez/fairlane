import "@/styles/globals.css";

import type { Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/client";
import BodyWrapper from "@components/layout/body-wrapper";
import { Toaster } from "@components/ui/sonner";

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
            <BodyWrapper>
                <TRPCReactProvider>{children}</TRPCReactProvider>
                <Toaster />
            </BodyWrapper>
        </html>
    );
}
