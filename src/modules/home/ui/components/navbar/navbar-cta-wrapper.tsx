import { trpcCaller } from "@/trpc/server";
import SuspenseWithError from "@components/utils/suspended";

import { authedCtaItems, ctaItems } from "./content";
import { NavbarCTA } from "./navbar-cta";

interface Props {
    isMenu?: boolean;
}

export default function NavbarCTAWrapper(props: Props) {
    return (
        <SuspenseWithError fallback={<NavbarCTASkeleton />}>
            <NavbarCTAWrapperSuspense {...props} />
        </SuspenseWithError>
    );
}

async function NavbarCTAWrapperSuspense(props: Props) {
    const session = await trpcCaller.auth.session();

    const isLoggedIn = session && session.user;

    return <>{isLoggedIn ? <NavbarCTAAuthed {...props} /> : <NavbarCTAUnAuthed />}</>;
}

function NavbarCTAAuthed({ isMenu = false }: Props) {
    return (
        <>
            {authedCtaItems.length === 1 && <li aria-hidden className={isMenu ? "border-b-neo" : "border-r-neo"}></li>}
            {authedCtaItems.map((item) => (
                <li key={item.name}>
                    <NavbarCTA item={item} isAlt={true} />
                </li>
            ))}
        </>
    );
}

function NavbarCTAUnAuthed() {
    return (
        <>
            {ctaItems.map((item, index) => (
                <li key={item.name}>
                    <NavbarCTA item={item} isAlt={index === 1} />
                </li>
            ))}
        </>
    );
}

function NavbarCTASkeleton() {
    return (
        <>
            {Array(2).map((_, i) => {
                <li key={i}></li>;
            })}
        </>
    );
}
