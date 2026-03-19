"use client";

import { useEffect, useState } from "react";

import { CheckCircle, CircleAlertIcon, CircleHelpIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

import { getQueryClient, getTRPCClient, useTRPC } from "@/trpc/client";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { invalidateOnSignIn } from "@lib/invalidations";
import { buildSubdomainUrl } from "@lib/urls";
import { RegisterSchema, type RegisterSchemaType } from "@modules/auth/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTRPCQueryUtils } from "@trpc/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterSchemaWithUniqueUsername = RegisterSchema.extend({
    username: RegisterSchema.shape.username.refine(
        async (value) => {
            const client = createTRPCQueryUtils({ queryClient: getQueryClient(), client: getTRPCClient() });

            try {
                return await client.auth.checkUsername.fetch({ username: value });
            } catch {
                return false;
            }
        },
        { message: "Username already in use" },
    ),
});

export default function SignUpForm() {
    const router = useRouter();

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const signUp = useMutation(
        trpc.auth.register.mutationOptions({
            onError(err) {
                toast.error(err.message);
            },
            async onSuccess() {
                toast.success("Account created");
                await invalidateOnSignIn(queryClient, trpc);
                router.push("/");
                router.refresh();
            },
        }),
    );

    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchemaWithUniqueUsername),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
        mode: "onChange",
    });

    const { control, unregister, formState, setValue, clearErrors, trigger } = form;
    const { validatingFields, errors } = formState;

    const username = form.watch("username");

    function handleSubmit(data: RegisterSchemaType) {
        signUp.mutate(data);
    }

    // Debounce the username
    const [usernameValue, setUsernameValue] = useState("");
    const [isTypingUsername, setIsTypingUsername] = useState(false);
    const debouncedSetUsername = useDebounceCallback(setUsernameValue, 1000);

    // Capture all inputs to prevent validation on the username field
    function handleChange(e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof RegisterSchemaType) {
        const { value } = e.target;

        switch (fieldName) {
            case "username":
                // Set the visible value but prevent validation
                setValue(fieldName, value, { shouldDirty: true, shouldValidate: false });
                setIsTypingUsername(true);
                debouncedSetUsername(value);
                break;
            default:
                // Unregister the username field while another one is being edited
                unregister("username", { keepDirty: true, keepError: true });
                setValue(fieldName, value, { shouldDirty: true, shouldValidate: true });
                break;
        }
    }

    // When the debounced username changes, trigger validation
    useEffect(() => {
        if (usernameValue) {
            trigger("username");
        } else {
            clearErrors("username");
        }
        setIsTypingUsername(false);
    }, [usernameValue, trigger, clearErrors]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                <FormField
                    name="username"
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        handleChange(e, field.name);
                                    }}
                                />
                            </FormControl>

                            {(isTypingUsername || validatingFields.username) && !!username ? (
                                <FormDescription className="text-muted-foreground line-clamp-1 flex shrink-0 items-center gap-[0.5ch]">
                                    <Loader2Icon className="size-3 animate-spin" />
                                    Checking availability of
                                    <span className="text-foreground font-bold">{buildSubdomainUrl(username)}</span>
                                </FormDescription>
                            ) : !errors.username ? (
                                <FormDescription className="text-muted-foreground line-clamp-1 flex shrink-0 items-center gap-[0.5ch]">
                                    {!!username ? (
                                        <>
                                            <CheckCircle className="text-primary size-3" />
                                            <span>Your store will be available at</span>
                                            <span className="text-foreground font-bold">
                                                {buildSubdomainUrl(username)}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <CircleHelpIcon className="text-accent size-3" />
                                            <span>Your username will determine your store url</span>
                                        </>
                                    )}
                                </FormDescription>
                            ) : (
                                <div className="flex items-center gap-[0.5ch] text-xs">
                                    <CircleAlertIcon className="text-destructive size-3" />
                                    <FormMessage />
                                </div>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        handleChange(e, field.name);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    onChange={(e) => {
                                        handleChange(e, field.name);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" variant={"inverted"} disabled={signUp.isPending}>
                    Submit
                </Button>
            </form>
        </Form>
    );
}
