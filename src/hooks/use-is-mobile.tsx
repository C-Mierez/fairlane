import { useEffect, useState } from "react";

const BREAKPOINTS = {
    mobile: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
};

export function useIsMobile(breakpoint?: keyof typeof BREAKPOINTS) {
    const MOBILE_BREAKPOINT = breakpoint ? BREAKPOINTS[breakpoint] : BREAKPOINTS.laptop; // Default of 1024px for laptop

    const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, [MOBILE_BREAKPOINT]);

    return !!isMobile;
}
