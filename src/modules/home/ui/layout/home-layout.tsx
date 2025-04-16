import HomeNavbar from "../components/navbar/home-navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HomeNavbar />
            {children}
        </>
    );
}
