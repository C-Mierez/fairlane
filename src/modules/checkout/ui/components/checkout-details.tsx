"use client";

import { XCircleIcon } from "lucide-react";

import { Button } from "@components/ui/button";
import { formatAsCurrency } from "@lib/utils";

interface Props {
    totalPrice: number;
    onPurchase: () => void;
    isLoading?: boolean;
    didCancel?: boolean;
}

export default function CheckoutDetails({ totalPrice, onPurchase, isLoading, didCancel }: Props) {
    return (
        <div className="bg-background neo-container h-fit w-full overflow-hidden">
            <div className="border-b-neo flex items-center justify-between gap-4 p-4 text-lg font-bold">
                <span>Total</span>
                <span>{formatAsCurrency(totalPrice?.toString())}</span>
            </div>
            <div className="p-4">
                <Button
                    size={"expanded"}
                    variant={"inverted"}
                    hover={"ghost_inverted"}
                    className="h-12"
                    onClick={onPurchase}
                    disabled={isLoading}
                >
                    Checkout
                </Button>
            </div>
            {didCancel && (
                <div className="border-t-neo text-destructive flex items-center justify-between gap-4 p-4 text-sm">
                    <XCircleIcon className="h-5 w-5 flex-shrink-0" />
                    <span>Your purchase was cancelled. If this was a mistake, please try again.</span>
                </div>
            )}
        </div>
    );
}
