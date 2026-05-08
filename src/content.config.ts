import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const visualSchema = z
  .object({
    type: z.string().optional(),
    title: z.string().optional(),
    dataset: z.string().optional(),
    variable: z.string().optional(),
    year: z.number().optional(),
  })
  .optional();

const sourceSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const articulos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/articulos' }),
  schema: z.object({
    template: z.string().default('articulo-visual'),
    title: z.string(),
    oneSentence: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    abstract: z.string(),
    heroImage: z.string().optional(),
    mainVisual: visualSchema,
    sources: z.array(sourceSchema).optional(),
    topics: z.array(z.string()).optional(),
    summaryPoints: z.array(z.string()).optional(),
  }),
});

export const collections = {
  articulos,
};
