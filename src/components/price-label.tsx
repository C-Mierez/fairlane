import { formatAsCurrency } from "@lib/utils";

interface PriceLabelProps {
    price: number;
    className?: string;
}

export default function PriceLabel({ price }: PriceLabelProps) {
    return (
        <div className="bg-foreground text-background relative size-fit p-2">
            <p className="text-sm font-medium">{formatAsCurrency(price.toString())}</p>
        </div>
    );
}
