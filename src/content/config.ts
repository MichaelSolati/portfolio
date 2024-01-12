import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		canonical: z.string().optional(),
		description: z.string(),
		hero: z.string().optional(),
		title: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
	}),
});

export const collections = { blog };
