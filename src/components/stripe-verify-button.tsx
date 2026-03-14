import Link from "next/link";
import { Button } from "./ui/button";

export default function StripeVerifyButton() {
    return (
        <Link href="/verify-stripe">
            <Button
                variant={"inverted"}
                className="mb-5 cursor-pointer rounded-lg border-0 bg-neutral-50 text-lg text-neutral-900"
            >
                Verify account
            </Button>
        </Link>
    );
}
