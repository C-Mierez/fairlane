interface Props {
    params: Promise<{
        category: string;
        subcategory: string;
    }>;
}

export default async function CategoryPage({ params }: Props) {
    const { category: categorySlug, subcategory: subcategorySlug } = await params;

    return (
        <div>
            <div>{categorySlug}</div>
            <div>{subcategorySlug}</div>
        </div>
    );
}
