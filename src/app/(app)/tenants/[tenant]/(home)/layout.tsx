import TenantHomeLayout from "@modules/tenants/ui/layout/tenant-home-layout";

interface Props {
    params: Promise<{
        tenant: string;
    }>;
    children: React.ReactNode;
}

export default function Layout(props: Props) {
    return <TenantHomeLayout {...props}>{props.children}</TenantHomeLayout>;
}
