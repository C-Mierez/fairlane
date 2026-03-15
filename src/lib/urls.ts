import { env } from "@/env";
import { ALL_SLUG } from "@modules/home/ui/components/search/constants";

export function buildSubcategoryUrl(parentSlug: string, categorySlug: string) {
    if (categorySlug === ALL_SLUG) {
        return `/${parentSlug}`;
    } else {
        return `/${parentSlug}/${categorySlug}`;
    }
}

export function buildCategoryUrl(categorySlug: string) {
    if (categorySlug === ALL_SLUG) {
        return "/";
    } else {
        return `/${categorySlug}`;
    }
}

function buildProtocol() {
    return process.env.NODE_ENV === "development" ? "http" : "https";
}

function buildRootOrigin() {
    return `${buildProtocol()}://${env.NEXT_PUBLIC_ROOT_DOMAIN}`;
}

function buildTenantOrigin(tenantSlug: string) {
    const domain = env.NEXT_PUBLIC_ROOT_DOMAIN;

    return `${buildProtocol()}://${tenantSlug.toLowerCase()}.${domain}`;
}

export function buildRootUrl(path: string) {
    return new URL(path, buildRootOrigin()).toString();
}

export function buildSubdomainUrl(username: string) {
    return buildTenantOrigin(username);
}

export function buildTenantUrl(tenantSlug: string) {
    return buildTenantOrigin(tenantSlug);
}

export function buildProductUrl(tenantSlug: string, productId: string) {
    return new URL(`/products/${productId}`, buildTenantOrigin(tenantSlug)).toString();
}

export function buildCheckoutUrl(tenantSlug: string, params?: { success?: string; cancel?: string }) {
    const url = new URL("/checkout", buildTenantOrigin(tenantSlug));

    if (params?.success) {
        url.searchParams.set("success", params.success);
    }

    if (params?.cancel) {
        url.searchParams.set("cancel", params.cancel);
    }

    return url.toString();
}

export function buildLibraryUrl(productId: string) {
    return `/library/${productId}`;
}
