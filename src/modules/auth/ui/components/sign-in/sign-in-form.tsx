"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { invalidateOnSignIn } from "@lib/invalidations";
import { LoginSchema, type LoginSchemaType } from "@modules/auth/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function SignInForm() {
    const router = useRouter();

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const login = useMutation(
        trpc.auth.login.mutationOptions({
            onError(err) {
                toast.error(err.message);
            },
            async onSuccess() {
                toast.success("Successfully logged in");
                await invalidateOnSignIn(queryClient, trpc);
                router.push("/");
            },
        }),
    );

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "all",
    });

    function handleSubmit(data: LoginSchemaType) {
        login.mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                <FormField
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" variant={"inverted"} disabled={login.isPending}>
                    Submit
                </Button>
            </form>
        </Form>
    );
}
