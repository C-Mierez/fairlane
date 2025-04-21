import { redirect } from "next/navigation";

import { trpcCaller } from "@/trpc/server";
import SignUpView from "@modules/auth/ui/views/sign-up-view";

export default async function SignUp() {
    const session = await trpcCaller.auth.session();

    if (session.user) {
        // Redirect to home if user is already signed in
        redirect("/");
    }
    return <SignUpView />;
}
