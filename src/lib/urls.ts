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

export function buildSubdomainUrl(username: string) {
    return `${username.toLowerCase()}.shop.com`;
}

export function buildTenantUrl(tenantSlug: string) {
    return `/tenants/${tenantSlug}`;
}

export function buildProductUrl(tenantSlug: string, productId: string) {
    return `/tenants/${tenantSlug}/products/${productId}`;
}

export function buildCheckoutUrl(tenantSlug: string) {
    return `/tenants/${tenantSlug}/checkout`;
}
