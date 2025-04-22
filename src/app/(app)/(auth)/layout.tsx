import UnAuthed from "@components/auth/unauthed";
import AuthLayout from "@modules/auth/ui/components/layouts/auth-layout";

interface Props {
    children: React.ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <UnAuthed>
            <AuthLayout>{children}</AuthLayout>
        </UnAuthed>
    );
}
