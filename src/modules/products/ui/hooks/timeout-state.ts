import { useRef, useState } from "react";

export default function useTimeoutState<T>(initialValue: T, timeout: number): [T, (value: T) => void] {
    const [state, setState] = useState(initialValue);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setTimeoutState = (value: T) => {
        setState(value);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setState(initialValue);
        }, timeout);
    };

    return [state, setTimeoutState];
}
