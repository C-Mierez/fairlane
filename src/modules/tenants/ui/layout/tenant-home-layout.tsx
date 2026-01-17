import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import TenantNavbar from "../components/navbar/tenant-navbar";

interface Props {
    params: Promise<{
        tenant: string;
    }>;
    children: React.ReactNode;
}

export default async function TenantHomeLayout(props: Props) {
    const { tenant } = await props.params;

    // Prefect current tenant data
    void prefetch(
        trpc.tenants.getBySlug.queryOptions({
            slug: tenant,
        }),
    );

    return (
        <div className="flex flex-col">
            <HydrateClient>
                <TenantNavbar tenantSlug={tenant} />
            </HydrateClient>
            <div className="min-h-screen">{props.children}</div>
        </div>
    );
}
