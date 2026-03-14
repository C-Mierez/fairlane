import { getPayload } from "payload";

import payloadConfig from "@payload-config";
import type { Category } from "@/payload-types";

const CATEGORIES = [
    {
        name: "Business & Money",
        color: "primary",
        slug: "business-money",
        subcategories: [
            { name: "Accounting", slug: "accounting" },
            {
                name: "Entrepreneurship",
                slug: "entrepreneurship",
            },
            { name: "Gigs & Side Projects", slug: "gigs-side-projects" },
            { name: "Investing", slug: "investing" },
            { name: "Management & Leadership", slug: "management-leadership" },
            {
                name: "Marketing & Sales",
                slug: "marketing-sales",
            },
            { name: "Networking, Careers & Jobs", slug: "networking-careers-jobs" },
            { name: "Personal Finance", slug: "personal-finance" },
            { name: "Real Estate", slug: "real-estate" },
        ],
    },
    {
        name: "Software Development",
        color: "secondary",
        slug: "software-development",
        subcategories: [
            { name: "Web Development", slug: "web-development" },
            { name: "Mobile Development", slug: "mobile-development" },
            { name: "Game Development", slug: "game-development" },
            { name: "Programming Languages", slug: "programming-languages" },
            { name: "DevOps", slug: "devops" },
        ],
    },
    {
        name: "Writing & Publishing",
        color: "accent",
        slug: "writing-publishing",
        subcategories: [
            { name: "Fiction", slug: "fiction" },
            { name: "Non-Fiction", slug: "non-fiction" },
            { name: "Blogging", slug: "blogging" },
            { name: "Copywriting", slug: "copywriting" },
            { name: "Self-Publishing", slug: "self-publishing" },
        ],
    },
    {
        name: "Other",
        slug: "other",
    },
    {
        name: "Food & Cooking",
        color: "primary",
        slug: "food-cooking",
        subcategories: [
            { name: "Baking", slug: "baking" },
            { name: "Vegan Cooking", slug: "vegan-cooking" },
            { name: "World Cuisines", slug: "world-cuisines" },
            { name: "Meal Prep", slug: "meal-prep" },
        ],
    },
    {
        name: "Self Improvement",
        color: "secondary",
        slug: "self-improvement",
        subcategories: [
            { name: "Productivity", slug: "productivity" },
            { name: "Personal Development", slug: "personal-development" },
            { name: "Mindfulness", slug: "mindfulness" },
            { name: "Career Growth", slug: "career-growth" },
        ],
    },
    {
        name: "Fitness & Health",
        color: "accent",
        slug: "fitness-health",
        subcategories: [
            { name: "Workout Plans", slug: "workout-plans" },
            { name: "Nutrition", slug: "nutrition" },
            { name: "Mental Health", slug: "mental-health" },
            { name: "Yoga", slug: "yoga" },
        ],
    },
    {
        name: "Design",
        color: "primary",
        slug: "design",
        subcategories: [
            { name: "UI/UX", slug: "ui-ux" },
            { name: "Graphic Design", slug: "graphic-design" },
            { name: "3D Modeling", slug: "3d-modeling" },
            { name: "Typography", slug: "typography" },
        ],
    },
    {
        name: "Drawing & Painting",
        color: "secondary",
        slug: "drawing-painting",
        subcategories: [
            { name: "Watercolor", slug: "watercolor" },
            { name: "Acrylic", slug: "acrylic" },
            { name: "Oil", slug: "oil" },
            { name: "Pastel", slug: "pastel" },
            { name: "Charcoal", slug: "charcoal" },
        ],
    },
    {
        name: "Music",
        color: "accent",
        slug: "music",
        subcategories: [
            { name: "Songwriting", slug: "songwriting" },
            { name: "Music Production", slug: "music-production" },
            { name: "Music Theory", slug: "music-theory" },
            { name: "Music History", slug: "music-history" },
        ],
    },
    {
        name: "Photography",
        color: "primary",
        slug: "photography",
        subcategories: [
            { name: "Portrait", slug: "portrait" },
            { name: "Landscape", slug: "landscape" },
            { name: "Street Photography", slug: "street-photography" },
            { name: "Nature", slug: "nature" },
            { name: "Macro", slug: "macro" },
        ],
    },
];

async function seedCategories() {
    const payload = await getPayload({ config: payloadConfig });

    for (const category of CATEGORIES) {
        console.log(`Creating category: ${category.name}`);

        const parentCategory = await payload.create({
            collection: "categories",
            data: {
                name: category.name,
                slug: category.slug,
                color: (category.color as Category["color"]) ?? "primary",
                childOf: null,
            },
        });

        for (const subcategory of category.subcategories ?? []) {
            console.log(`Creating subcategory: ${subcategory.name}`);
            await payload.create({
                collection: "categories",
                data: {
                    name: subcategory.name,
                    slug: subcategory.slug,
                    childOf: parentCategory.id,
                },
            });
        }
    }
}
try {
    await seedCategories();
    console.log("Categories seeded successfully.");
    process.exit(0);
} catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
}
