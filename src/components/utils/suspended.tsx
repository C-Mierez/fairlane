"use client";

import { Suspense } from "react";

import { Loader2Icon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    fallback?: React.ReactNode;
    error?: React.ReactNode;
    children: React.ReactNode;
}

export default function SuspenseWithError({ fallback, error, children }: Props) {
    if (!fallback)
        fallback = (
            <div className="flex w-full items-center justify-center">
                <Loader2Icon className="animate-spin" />
            </div>
        );

    if (!error) error = <div>Something went wrong</div>;

    return (
        <Suspense fallback={fallback}>
            <ErrorBoundary fallback={error}>{children}</ErrorBoundary>
        </Suspense>
    );
}
