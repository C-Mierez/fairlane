import { redirect } from "next/navigation";

import { trpcCaller } from "@/trpc/server";

export default async function UnAuthed({ children }: { children: React.ReactNode }) {
    const session = await trpcCaller.auth.session();

    if (session.user) {
        // Redirect to home if user is already signed in
        redirect("/");
    }

    return <>{children}</>;
}
