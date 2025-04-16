"use client";

import "sonner/dist/styles.css";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            style={{ fontFamily: "inherit", overflowWrap: "anywhere" }}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: "neo-container-expanded bg-background text-foreground font-heading text-sm flex items-center gap-2 p-4 w-[356px] [&:has(button)]:justify-between",
                    description: "font-base",
                    actionButton: "neo-container font-base text-sm h-8 px-2 shrink-0",
                    cancelButton: "neo-container font-base text-sm h-8 px-2 shrink-0",
                    loading:
                        "[&[data-sonner-toast]_[data-icon]]:flex [&[data-sonner-toast]_[data-icon]]:size-4 [&[data-sonner-toast]_[data-icon]]:relative [&[data-sonner-toast]_[data-icon]]:justify-start [&[data-sonner-toast]_[data-icon]]:items-center [&[data-sonner-toast]_[data-icon]]:flex-shrink-0",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
