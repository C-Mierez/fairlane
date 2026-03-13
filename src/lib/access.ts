import type { User } from "@/payload-types";
import type { ClientUser } from "payload";

export function isSuperAdmin(user: User | ClientUser | null) {
    return Boolean(user?.roles?.includes("super-admin"));
}
