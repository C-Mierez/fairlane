import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import OrderGrid from "./components/orders-list";

export default function LibraryView() {
    return (
        <div className="flex min-h-dvh flex-col">
            <section className="h-header bg-background border-b-neo sticky top-0 right-0 left-0 z-50 flex items-center justify-between gap-2 px-4 md:px-8">
                <nav>
                    <Link href={"/"} className="flex items-center gap-2">
                        <ArrowLeftIcon className="size-4" />
                        Continue shopping
                    </Link>
                </nav>
            </section>
            <section>
                <header className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8">
                    <h1 className="text-4xl font-medium">Your Library</h1>
                    <p className="text-muted-foreground">See your purchases and reviews</p>
                </header>
            </section>
            <section className="bg-background border-t-neo flex-1 px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    <OrderGrid />
                </div>
            </section>
        </div>
    );
}
