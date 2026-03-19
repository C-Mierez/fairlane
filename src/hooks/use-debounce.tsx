import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number, callback: (debouncedValue: T) => void): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
            callback(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay, callback]);

    return debouncedValue;
}
