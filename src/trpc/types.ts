import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./routers/_app";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type CheckoutGetProductsOutput = RouterOutput["checkout"]["getProducts"];
