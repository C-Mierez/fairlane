interface Props {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            <section className="col-span-1 px-4 py-8 lg:px-8">{children}</section>
            <section
                className="px-4 py-8 lg:px-8"
                style={{
                    backgroundImage: "url('/mosaic.png')",
                    backgroundSize: "cover",
                    backgroundPositionY: "-2px",
                    backgroundPositionX: "50%",
                }}
            ></section>
        </div>
    );
}
