import { redirect } from "next/navigation";

import { trpcCaller } from "@/trpc/server";
import SignInView from "@modules/auth/ui/views/sign-in-view";

export default async function SignIn() {
    const session = await trpcCaller.auth.session();

    if (session.user) {
        // Redirect to home if user is already signed in
        redirect("/");
    }

    return <SignInView />;
}
