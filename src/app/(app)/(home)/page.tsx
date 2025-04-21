"use client";

import { useTRPC } from "@/trpc/client";
import PrettyJSON from "@components/dev/pretty-json";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
    const trpc = useTRPC();

    const { data } = useQuery(trpc.auth.session.queryOptions());

    return (
        <div>
            <PrettyJSON data={data} />
            <div className="min-h-screen">Home Page 1</div>
            <div className="min-h-screen">Home Page 2</div>
        </div>
    );
}
