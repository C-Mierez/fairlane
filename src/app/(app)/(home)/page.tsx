import { getPayload } from "payload";

import configPromise from "@payload-config";

export default async function Home() {
    const payload = await getPayload({
        config: configPromise,
    });

    const data = await payload.find({
        collection: "categories",
    });

    return (
        <div>
            <div>Top</div>
            <div>{JSON.stringify(data, null, 2)}</div>
            <div className="min-h-screen">Home Page</div>
            <div className="min-h-screen">Home Page</div>
        </div>
    );
}
