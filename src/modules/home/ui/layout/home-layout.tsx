import { SidebarProvider } from "@components/ui/sidebar";

import HomeNavbar from "../components/navbar/home-navbar";
import SearchFilters from "../components/search/search-filters";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Category } from "@/payload-types";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    const payload = await getPayload({
        config: configPromise,
    });

    const data = await payload.find({
        collection: "categories",
        where: {
            childOf: {
                exists: false,
            },
        },
        depth: 1,
        pagination: false,
    });

    const formattedData = data.docs.map((doc) => {
        return {
            ...doc,
            children: (doc.children?.docs ?? []).map((child) => {
                return {
                    ...(child as Category), // Depth is 1
                };
            }),
        };
    });

    return (
        <SidebarProvider>
            <HomeNavbar />
            <SearchFilters data={{ ...data, docs: formattedData as any }} />
            {children}
        </SidebarProvider>
    );
}
