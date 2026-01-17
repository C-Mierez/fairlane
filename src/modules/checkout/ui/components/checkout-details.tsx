import { Button } from "@components/ui/button";
import { formatAsCurrency } from "@lib/utils";

interface Props {
    totalPrice: number;
}

export default function CheckoutDetails({ totalPrice }: Props) {
    return (
        <div className="bg-background neo-container h-fit w-full overflow-hidden">
            <div className="border-b-neo flex items-center justify-between gap-4 p-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatAsCurrency(totalPrice?.toString())}</span>
            </div>
            <div className="p-4">
                <Button size={"expanded"} variant={"inverted"} hover={"ghost_inverted"} className="h-12">
                    Checkout
                </Button>
            </div>
        </div>
    );
}
