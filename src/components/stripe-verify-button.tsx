import Link from "next/link";
import { Button } from "./ui/button";

export default function StripeVerifyButton() {
    return (
        <Link href="/verify-stripe">
            <Button variant={"inverted"}>Verify account</Button>
        </Link>
    );
}
