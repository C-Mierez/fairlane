import ProductDetailsCard from "../components/product-details-card";

interface Props {
    tenantSlug: string;
    productId: string;
}

export default function ProductView({ productId }: Props) {
    return (
        <section className="grid place-items-center p-4 md:p-8">
            <ProductDetailsCard productId={productId} />
        </section>
    );
}
