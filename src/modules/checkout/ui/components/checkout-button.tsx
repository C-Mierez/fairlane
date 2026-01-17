import { Button } from "@components/ui/button";
import { buildCheckoutUrl } from "@lib/urls";
import useCart from "@modules/checkout/hooks/use-cart";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    tenantSlug: string;
}

export default function CheckoutButton({ tenantSlug }: Props) {
    const cart = useCart(tenantSlug);

    return (
        <Button asChild>
            <Link href={buildCheckoutUrl(tenantSlug)}>
                <ShoppingCartIcon />
                <span className="font-bold">{cart.totalItems}</span>
            </Link>
        </Button>
    );
}
