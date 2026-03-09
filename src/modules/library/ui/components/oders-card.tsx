import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Product, Tenant } from "@/payload-types";
import { DEFAULT_IMAGE_URL } from "@lib/constants";
import { buildLibraryUrl, buildTenantUrl } from "@lib/urls";

type OrdersForCard = Pick<Product, "id" | "name"> & {
    imageUrl?: string | null;
    tenantSlug: Tenant["slug"];
    tenantImageUrl?: string | null;
    reviewCount: number;
    reviewRating: number;
};

export default function OrdersCard({
    id,
    name,
    imageUrl,
    tenantSlug,
    tenantImageUrl,
    reviewCount,
    reviewRating,
}: OrdersForCard) {
    return (
        <li className="neo-container neo-hover bg-background relative isolate overflow-hidden">
            <div className="flex flex-col">
                <Link href={buildLibraryUrl(id)} className="absolute inset-0 z-10" />
                <div className="relative aspect-square">
                    <Image fill src={imageUrl || DEFAULT_IMAGE_URL} alt={name} className="object-cover" />
                </div>
                <div className="border-t-neo flex flex-1 flex-col gap-3 p-4">
                    <h2 className="font-brand-medium line-clamp-1 text-xl font-medium">{name}</h2>

                    <Link href={buildTenantUrl(tenantSlug)} className="z-15 flex items-center gap-2">
                        <div className="relative size-4">
                            <Image
                                src={tenantImageUrl || DEFAULT_IMAGE_URL}
                                alt={tenantSlug}
                                fill
                                className="rounded-base"
                            />
                        </div>
                        <span className="text-muted-foreground line-clamp-1 text-sm underline">{tenantSlug}</span>
                    </Link>

                    {!!reviewCount && (
                        <div className="text-foreground flex items-center gap-2 text-sm">
                            <StarIcon className="fill-foreground size-4" />
                            <p>
                                {reviewRating} <span className="text-muted-foreground">({reviewCount})</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
}
