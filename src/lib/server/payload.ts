import "server-only";

import { getPayload as gp } from "payload";

import configPromise from "@payload-config";

export async function getPayload() {
    return await gp({
        config: configPromise,
    });
}
