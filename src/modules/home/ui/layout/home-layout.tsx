import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SidebarProvider } from "@components/ui/sidebar";

import HomeNavbar from "../components/navbar/home-navbar";
import SearchFilters from "../components/search/search-filters";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    prefetch(trpc.categories.getAll.queryOptions());

    return (
        <HydrateClient>
            <SidebarProvider>
                <HomeNavbar />
                <SearchFilters />
                {children}
            </SidebarProvider>
        </HydrateClient>
    );
}
