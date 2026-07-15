import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		published: z.coerce.date(),
		updated: z.coerce.date().optional(),
		description: z.string(),
		image: z.string().optional(),
		tags: z.array(z.string()).default([]),
		categories: z.array(z.string()).default([]),
		author: z.array(z.string()).default([]),
		difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
		draft: z.boolean().default(false),
		pinned: z.boolean().default(false),
		series: z.string().optional(),
		order: z.number().optional(),
		links: z
			.object({
				website: z.string().url().optional(),
				github: z.string().url().optional(),
			})
			.optional(),
		downloads: z
			.array(
				z.object({
					id: z.string(),
					label: z.string(),
					url: z.string().url(),
				}),
			)
			.default([]),
	}),
});

const docs = defineCollection({
	loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			order: z.number().default(0),
			section: z.string().default('general'),
			tags: z.array(z.string()).default([]),
			heroImage: z.optional(image()),
		}),
});

const authors = defineCollection({
	loader: glob({ base: './src/content/authors', pattern: '**/*.{yaml,yml,json}' }),
	schema: z.object({
		name: z.string(),
		avatar: z.string().optional(),
		bio: z.string().optional(),
		website: z.string().url().optional(),
		github: z.string().url().optional(),
		twitter: z.string().url().optional(),
	}),
});

const series = defineCollection({
	loader: glob({ base: './src/content/series', pattern: '**/*.{yaml,yml,json}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		cover: z.string().optional(),
		author: z.array(z.string()).default([]),
		chapters: z.array(z.string()),
	}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx,yaml,yml,json}' }),
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		stack: z.array(z.string()).default([]),
	}),
});

export const collections = { blog, docs, authors, series, pages };
