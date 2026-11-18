import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Posts live in src/content/blog/<locale>/<slug>.md. A translation shares the slug of its original.
const blog = defineCollection({
  // The ID keeps "<locale>/<file name>" as is; the default generator would turn "en/index.md" into "en".
  loader: glob({ pattern: '{en,pt}/*.md', base: './src/content/blog', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.strictObject({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    // Coercion alone would turn null into 1970-01-01, so only dates and date strings are accepted.
    pubDate: z.union([z.date(), z.string()], { error: 'Expected a date such as 2026-11-17' }).pipe(z.coerce.date()),
    category: z.string().regex(/^[a-z0-9-]+$/, 'Expected a category id from src/data/blog.yml'),
    tags: z.array(z.string().trim().min(1)).default([]),
    cover: z.string()
      .regex(/^\/images\/[^\s]+\.(svg|png|jpe?g|webp|gif|avif)$/i, 'Expected a local /images/ path')
      .refine((path) => existsSync(resolve(process.cwd(), 'public', path.slice(1))), 'Image does not exist in public/')
      .optional(),
    coverAlt: z.string().trim().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
