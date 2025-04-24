import type { Product, User } from "@/payload-types";
import { formatAsCurrency } from "@lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductForCard = Pick<Product, "id" | "name" | "price"> & {
    imageUrl?: string | null;
    authorUsername: User["username"];
    authorImageUrl?: string | null;
    reviewCount: number;
    reviewRating: number;
};

export default function ProductCard({
    id,
    name,
    price,
    imageUrl,
    authorUsername,
    authorImageUrl,
    reviewCount,
    reviewRating,
}: ProductForCard) {
    return (
        <li className="neo-container neo-hover bg-background isolate overflow-hidden">
            <Link href={"/"} className="flex flex-col">
                <div className="relative aspect-square">
                    <Image fill src={"/mosaic.png"} alt={name} className="object-cover" />
                </div>
                <div className="border-t-neo flex flex-1 flex-col gap-3 p-4">
                    <h2 className="font-brand-medium line-clamp-1 text-xl font-medium">{name}</h2>
                    {!!"/mosaic.png" && (
                        <div className="flex items-center gap-2">
                            <div className="relative size-4">
                                <Image src={"/mosaic.png"} alt={authorUsername} fill className="rounded-base" />
                            </div>
                            <span className="text-muted-foreground line-clamp-1 text-sm underline">
                                {authorUsername}
                            </span>
                        </div>
                    )}
                    {!!reviewCount && (
                        <div className="text-foreground flex items-center gap-2 text-sm">
                            <StarIcon className="fill-foreground size-4" />
                            <p>
                                {reviewRating} <span className="text-muted-foreground">({reviewCount})</span>
                            </p>
                        </div>
                    )}
                </div>
                <div className="border-t-neo p-4">
                    <div className="bg-foreground text-background relative size-fit p-2">
                        <p className="text-sm font-medium">{formatAsCurrency(price.toString())}</p>
                    </div>
                </div>
            </Link>
        </li>
    );
}
