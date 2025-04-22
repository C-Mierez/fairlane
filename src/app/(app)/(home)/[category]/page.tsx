interface Props {
    params: Promise<{
        category: string;
    }>;
}

export default async function CategoryPage(props: Props) {
    const { category: categorySlug } = await props.params;

    return (
        <div>
            <div>{categorySlug}</div>
        </div>
    );
}
