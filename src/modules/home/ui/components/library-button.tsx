"use client";

import { BookOpenTextIcon } from "lucide-react";
import Link from "next/link";

import { useTRPC } from "@/trpc/client";
import { Button } from "@components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function LibraryButton() {
    const trpc = useTRPC();
    const session = useQuery(trpc.auth.session.queryOptions());

    const isLoggedIn = session.data && session.data.user;

    if (!isLoggedIn) return null;

    return (
        <Button asChild>
            {/* // TODO Proper href */}
            <Link href={"/library"}>
                <BookOpenTextIcon />
                <span className="hidden md:block">Library</span>
            </Link>
        </Button>
    );
}
