import Link from "next/link";

import BrandLogo from "@components/brand-logo";
import { Button } from "@components/ui/button";

import SignUpForm from "../components/sign-up/sign-up-form";

export default function SignUpView() {
    return (
        <div className="flex flex-col gap-8">
            <header className="flex items-center justify-between">
                <BrandLogo prefetch href={"/"} variant={"md"} />
                <Button size={"sm"} variant={"link"} border={"transparent"} rise={"neo"} hover={"ghost"} asChild>
                    <Link href={"/sign-in"}>Sign In</Link>
                </Button>
            </header>

            <div className="flex flex-col gap-4">
                <h1 className="font-brand-medium text-4xl font-medium">Create an account</h1>
                <SignUpForm />
            </div>
        </div>
    );
}
