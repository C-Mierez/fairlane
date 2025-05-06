"use client";

import { useTRPC } from "@/trpc/client";
import SuspenseWithError from "@components/utils/suspended";
import { buildTenantUrl } from "@lib/urls";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

interface Props {
    tenantSlug: string;
}

export default function TenantNavbar(props: Props) {
    return (
        <SuspenseWithError fallback={<TenantNavbarSkeleton />}>
            <TenantNavbarSuspense {...props} />
        </SuspenseWithError>
    );
}

function TenantNavbarSuspense({ tenantSlug }: Props) {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.tenants.getBySlug.queryOptions({
            slug: tenantSlug,
        }),
    );

    return (
        <section className="h-header bg-background border-b-neo sticky top-0 right-0 left-0 z-50 flex items-center gap-2 px-4 md:px-8">
            {!!data.image && !!data.image.url && (
                <Link
                    href={buildTenantUrl(data.slug)}
                    className="rounded-base relative aspect-square size-8 overflow-hidden"
                >
                    <Image src={data.image.url} alt={data.name} fill />
                </Link>
            )}
            <div className="font-brand-medium text-2xl font-medium">{data.name}</div>
        </section>
    );
}

export function TenantNavbarSkeleton() {
    return (
        <section className="h-header bg-background border-b-neo sticky top-0 right-0 left-0 z-50 flex items-center px-4 md:px-8"></section>
    );
}
