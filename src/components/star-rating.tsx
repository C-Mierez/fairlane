import { StarIcon } from "lucide-react";

import { cn } from "@lib/utils";

interface Props {
    rating: number;
    className?: string;
    iconClassName?: string;
}

const MAX_RATING = 5;
const MIN_RATING = 0;

export default function StarRating({ rating, className, iconClassName }: Props) {
    const safeRating = Math.round(Math.max(MIN_RATING, Math.min(rating, MAX_RATING)));

    return (
        <div className={cn("text-foreground flex items-center gap-1", className)}>
            {Array.from({ length: MAX_RATING }).map((_, index) => {
                return (
                    <StarIcon
                        key={index}
                        className={cn("size-4", index < safeRating ? "fill-foreground" : "", iconClassName)}
                    />
                );
            })}
        </div>
    );
}
