import { NextResponse, type NextRequest } from "next/server";
import { env } from "./env";

export const config = {
    /**
     * Match all paths except for:
     * /api routes
     * /_next
     * /_static
     * all root files inside /public (e.g. /favicon.ico, /robots.txt, etc.)
     */

    matcher: "/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)",
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;

    const hostname = req.headers.get("host") || "";

    const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN || "";

    if (hostname.endsWith(`.${rootDomain}`)) {
        const tenantSlug = hostname.replace(`.${rootDomain}`, "");

        return NextResponse.rewrite(new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url));
    }

    return NextResponse.next();
}
