"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

export default function VerifyStripePage() {
    const trpc = useTRPC();

    const { mutate } = useMutation(
        trpc.checkout.verify.mutationOptions({
            onSuccess: (data) => {
                window.location.href = data.url;
            },
            onError: (err) => {
                console.error("Error verifying Stripe account:", err);
                window.location.href = "/";
            },
        }),
    );

    useEffect(() => {
        mutate();
    }, [mutate]);

    return (
        <div className="grid min-h-screen w-full place-items-center">
            <Loader2Icon className="animate-spin" size={48} />
        </div>
    );
}
