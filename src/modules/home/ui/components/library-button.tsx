"use client";

import { BookOpenTextIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@components/ui/button";
import SuspenseWithError from "@components/utils/suspended";
import { useSession } from "@hooks/use-session";

export default function LibraryButton() {
    return (
        <SuspenseWithError fallback={<LibraryButtonSkeleton />}>
            <LibraryButtonSuspense />
        </SuspenseWithError>
    );
}

function LibraryButtonSuspense() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { session } = useSession();

    if (!session.user) return null;

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

function LibraryButtonSkeleton() {
    return <div>Loading</div>;
}
