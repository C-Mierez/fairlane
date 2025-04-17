import { SidebarProvider } from "@components/ui/sidebar";

import HomeNavbar from "../components/navbar/home-navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <HomeNavbar />
            {children}
        </SidebarProvider>
    );
}
