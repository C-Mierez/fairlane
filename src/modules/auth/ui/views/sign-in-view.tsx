import Link from "next/link";

import BrandLogo from "@components/brand-logo";
import { Button } from "@components/ui/button";

import SignInForm from "../components/sign-in/sign-in-form";

export default function SignInView() {
    return (
        <div className="flex flex-col gap-8">
            <header className="flex items-center justify-between">
                <BrandLogo prefetch href={"/"} variant={"md"} />
                <Button size={"sm"} variant={"link"} border={"transparent"} rise={"neo"} hover={"ghost"} asChild>
                    <Link href={"/sign-up"}>Sign Up</Link>
                </Button>
            </header>

            <div className="flex flex-col gap-4">
                <h1 className="font-brand-medium text-4xl font-medium">Log into your account</h1>
                <SignInForm />
            </div>
        </div>
    );
}
