import { RefObject } from "react";

const DEFAULT_WIDTH = 240; // 15rem === w-60

const DEFAULT_PADDING = 16; // 1rem === p-4

export type DropdownPosition = {
    top: number;
    left: number;
};

export default function useDropdown(
    ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>,
    opts?: {
        width?: number;
        padding?: number;
    },
) {
    const defaultWidth = opts?.width || DEFAULT_WIDTH;
    const defaultPadding = opts?.padding || DEFAULT_PADDING;

    function getDropdownPosition(): DropdownPosition {
        if (!ref.current) return { top: 0, left: 0 };

        const rect = ref.current.getBoundingClientRect();
        const dropdownWidth = defaultWidth;

        // Calculate the initial position of the dropdown
        let left = rect.left + window.scrollX;
        const top = rect.bottom + window.scrollY;

        // Check if the dropdown goes off the right side of the screen
        if (left + dropdownWidth > window.innerWidth) {
            // If it does, adjust the left position to fit within the screen
            left = rect.right - dropdownWidth + window.scrollX;

            // Check if the adjusted left position goes off the left side of the screen
            if (left < 0) {
                // If it does, align to the right side of the screen + padding
                left = window.innerWidth - dropdownWidth + defaultPadding;
            }
        }

        // Check if the dropdown goes off the left side of the screen
        if (left < 0) {
            // If it does, set the left position to 0 + padding
            left = defaultPadding;
        }

        return { top, left };
    }

    return {
        getDropdownPosition,
    };
}
