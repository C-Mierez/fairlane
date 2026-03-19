import { env } from "@/env";
import BrandLogo from "@components/brand-logo";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="min-h-screen">{children}</div>
            <section className="h-header bg-background border-t-neo sticky top-0 right-0 left-0 z-50 flex items-center justify-between gap-2 px-4 md:px-8">
                <div className="col-span-3 flex size-full items-center pl-4 md:pl-8">
                    <BrandLogo href={env.NEXT_PUBLIC_WEBSITE_URL} />
                </div>
            </section>
        </div>
    );
}
