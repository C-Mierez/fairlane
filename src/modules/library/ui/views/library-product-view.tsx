"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReviewSidebar from "../components/review-sidebar";

interface Props {
    productId: string;
}

export default function LibraryProductView({ productId }: Props) {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.library.getOne.queryOptions({
            productId,
        }),
    );

    return (
        <div className="flex min-h-dvh flex-col">
            <section className="h-header bg-background border-b-neo sticky top-0 right-0 left-0 z-50 flex items-center justify-between gap-2 px-4 md:px-8">
                <nav>
                    <Link href={"/library"} className="flex items-center gap-2">
                        <ArrowLeftIcon className="size-4" />
                        Back to library
                    </Link>
                </nav>
            </section>
            <section>
                <header className="mx-auto max-w-7xl px-4 py-8">
                    <h1 className="text-4xl font-medium">{data.name}</h1>
                </header>
            </section>
            <section className="bg-background border-t-neo flex-1">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-8 md:grid-cols-8">
                    <div className="neo-container p-4 md:col-span-3">
                        <ReviewSidebar productId={productId} />
                    </div>
                    <div className="md:col-span-5">Test</div>
                </div>
            </section>
        </div>
    );
}
