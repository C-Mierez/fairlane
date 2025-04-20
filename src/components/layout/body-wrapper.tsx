import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";

const mpRegular = localFont({
    src: "../../styles/fonts/MP-Regular.woff2",
    variable: "--font-mp-regular",
});

const mpMedium = localFont({
    src: "../../styles/fonts/MP-Medium.woff2",
    variable: "--font-mp-medium",
});

const mpBold = localFont({
    src: "../../styles/fonts/MP-Bold.woff2",
    variable: "--font-mp-bold",
});

const mpBlack = localFont({
    src: "../../styles/fonts/MP-Black.woff2",
    variable: "--font-mp-black",
});

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
    return (
        <body
            className={` ${dmSans.variable} ${mpRegular.variable} ${mpMedium.variable} ${mpBold.variable} ${mpBlack.variable} antialiased`}
        >
            {children}
        </body>
    );
}
