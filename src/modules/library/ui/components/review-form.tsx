"use client";

import { useMemo, useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import type { ReviewsGetOneOutput } from "@/trpc/types";
import StarPicker from "@components/star-picker";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { invalidateReviewCreatedOrUpdated } from "@lib/invalidations";
import { ReviewSchema, type ReviewSchemaType } from "@modules/library/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
    productId: string;
    initialReview: ReviewsGetOneOutput;
}

export default function ReviewForm({ productId, initialReview }: Props) {
    const [isUpdating, setIsUpdating] = useState(!initialReview);

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createOrUpdateReview = useMutation(
        trpc.reviews.createOrUpdate.mutationOptions({
            onSuccess: () => {
                invalidateReviewCreatedOrUpdated(queryClient, trpc, { productId });
                setIsUpdating(false);
            },
            onError: (error) => {
                toast.error(error.message || "An error occurred while submitting your review. Please try again.");
            },
        }),
    );

    const form = useForm<ReviewSchemaType>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: {
            rating: initialReview?.rating ?? 0,
            description: initialReview?.description ?? "",
        },
    });

    const isDisabled = useMemo(
        () => createOrUpdateReview.isPending || !isUpdating,
        [createOrUpdateReview.isPending, isUpdating],
    );

    const onSubmit = (data: ReviewSchemaType) => {
        if (!isDisabled) {
            createOrUpdateReview.mutate({
                productId: productId,
                rating: data.rating,
                description: data.description,
            });
        }
    };

    return (
        <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <p className="font-medium">
                    {!!initialReview ? "Your review:" : "Have some thoughts? Leave a review!"}
                </p>

                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <StarPicker value={field.value} onChange={field.onChange} disabled={isDisabled} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Leave a comment for your review..."
                                    disabled={isDisabled}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {isUpdating && (
                    <Button
                        variant={"inverted"}
                        border="transparent"
                        hover="ghost_inverted"
                        disabled={isDisabled}
                        type="submit"
                    >
                        {initialReview ? "Update review" : "Submit review"}
                    </Button>
                )}

                {!isUpdating && (
                    <Button
                        onClick={() => {
                            setIsUpdating((val) => !val);
                        }}
                        type="button"
                    >
                        Edit review
                    </Button>
                )}
            </form>
        </Form>
    );
}
