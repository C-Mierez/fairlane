import { parseAsBoolean, useQueryStates } from "nuqs";

export default function useCheckoutStates() {
    return useQueryStates({
        success: parseAsBoolean.withDefault(false).withOptions({
            clearOnDefault: true,
        }),
        cancel: parseAsBoolean.withDefault(false).withOptions({
            clearOnDefault: true,
        }),
    });
}
