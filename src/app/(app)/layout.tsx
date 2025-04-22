import "@/styles/globals.css";

import type { Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/client";
import AuthProvider from "@components/layout/auth-provider";
import BodyWrapper from "@components/layout/body-wrapper";
import { Toaster } from "@components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
    title: "Fairlane",
    description: "A simple place to sell your products",
};

// Entire app is dynamic with this.
// This is needed for the AuthProvider
// Should refine this to a more specific layout if a static page is added at some point
export const dynamic = "force-dynamic";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <BodyWrapper>
                <NuqsAdapter>
                    <TRPCReactProvider>
                        <AuthProvider>
                            {/* // */}
                            {children}
                            <Toaster />
                        </AuthProvider>
                    </TRPCReactProvider>
                </NuqsAdapter>
            </BodyWrapper>
        </html>
    );
}
