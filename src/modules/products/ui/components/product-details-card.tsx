"use client";

import { Fragment, useMemo } from "react";

import { CheckCheckIcon, LinkIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import PriceLabel from "@components/price-label";
import StarRating from "@components/star-rating";
import { Button } from "@components/ui/button";
import { Progress } from "@components/ui/progress";
import SuspenseWithError from "@components/utils/suspended";
import { DEFAULT_IMAGE_URL } from "@lib/constants";
import { buildTenantUrl } from "@lib/urls";
import { useSuspenseQuery } from "@tanstack/react-query";

import useTimeoutState from "../hooks/timeout-state";

const CartButton = dynamic(() => import("@modules/products/ui/components/cart-button"), {
    ssr: false,
    loading: () => (
        <Button size={"expanded"} disabled>
            Add to Cart
        </Button>
    ),
});

interface Props {
    productId: string;
}

export default function ProductDetailsCard(props: Props) {
    return (
        <SuspenseWithError>
            <ProductDetailsCardSuspense {...props} />
        </SuspenseWithError>
    );
}

function ProductDetailsCardSuspense({ productId }: Props) {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.products.getOneById.queryOptions({ id: productId }));

    const [isCopied, setIsCopied] = useTimeoutState(false, 2000);

    const policyInfo = useMemo(() => {
        switch (data.policy) {
            case "exchange":
                return `Exchange policy: ${data.policyDuration} days`;
            case "refund":
                return `Refund policy: ${data.policyDuration} days`;
            case "no-exchange":
                return `No exchange available`;
            case "no-refund":
                return `No refund available`;
            default:
                return `No policy information available`;
        }
    }, [data]);

    return (
        <div className="border-neo w-full max-w-7xl">
            <div className="border-b-neo relative aspect-[10/3] w-full">
                <Image src={data.image?.url || "/mosaic.png"} alt={data.name} fill className="object-cover" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:border-r-neo col-span-2 border-r-0">
                    <h1 className="font-brand-medium border-b-neo p-4 text-3xl font-medium text-balance lg:text-4xl">
                        {data.name}
                    </h1>

                    <div className="border-b-neo flex items-stretch text-sm">
                        <div className="border-r-neo grid place-items-center p-4">
                            <PriceLabel price={data.price} />
                        </div>
                        <div className="border-r-neo grid place-items-center p-4">
                            <Link href={buildTenantUrl(data.tenant.slug)} className="z-15 flex items-center gap-2">
                                <div className="relative size-4">
                                    <Image
                                        src={data.tenant.image?.url || DEFAULT_IMAGE_URL}
                                        alt={data.tenant.name}
                                        fill
                                        className="rounded-base"
                                    />
                                </div>
                                <span className="text-muted-foreground line-clamp-1 text-sm underline">
                                    {data.tenant.slug}
                                </span>
                            </Link>
                        </div>
                        <div className="flex flex-1 items-center justify-start p-4">
                            <div className="text-foreground flex items-center gap-2 text-sm">
                                <StarRating rating={data.reviewRating} />
                                <p>
                                    {data.reviewRating}{" "}
                                    <span className="text-muted-foreground">({data.reviewCount})</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-muted-foreground p-4 text-sm">{data.description}</p>
                </div>

                <div>
                    <div className="border-b-neo flex flex-col gap-2 p-4">
                        <div className="flex items-stretch gap-2">
                            <CartButton
                                tenantSlug={data.tenant.slug}
                                productId={data.id}
                                isAlreadyPurchased={data.isPurchased}
                                isExpanded
                            />
                            <Button
                                size={"icon"}
                                className="h-10"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Product copied to clipboard");

                                    setIsCopied(true);
                                }}
                                disabled={isCopied}
                            >
                                {isCopied ? <CheckCheckIcon /> : <LinkIcon />}
                            </Button>
                        </div>

                        <p className="text-muted-foreground text-center text-xs text-balance">{policyInfo}</p>
                    </div>

                    <div className="flex flex-col gap-4 p-4">
                        <div className="flex justify-between gap-4">
                            <h2 className="font-brand-medium text-xl font-medium">Product Ratings</h2>
                            <span className="flex flex-col items-center gap-2 text-xs lg:flex-row">
                                <StarRating rating={data.reviewRating} />{" "}
                                <span>
                                    {data.reviewRating}{" "}
                                    <span className="text-muted-foreground">({data.reviewCount})</span>
                                </span>
                            </span>
                        </div>

                        <div className="grid grid-cols-[auto_1fr_auto] gap-2 text-sm font-medium">
                            {[5, 4, 3, 2, 1].map((stars) => (
                                <Fragment key={stars}>
                                    <label>
                                        {stars} {stars === 1 ? "star" : "stars"}
                                    </label>
                                    <Progress value={data.ratingAggregation[stars] || 0} className="h-[1lh]" />
                                    <div>{data.ratingAggregation[stars] || 0}%</div>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
