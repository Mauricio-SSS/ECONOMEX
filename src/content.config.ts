import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const visualSchema = z
  .object({
    type: z.string().optional(),
    title: z.string().optional(),
    dataset: z.string().optional(),
    variable: z.string().optional(),
    year: z.coerce.number().optional(),
  })
  .optional();

const visualSummarySchema = z
  .object({
    title: z.string().optional(),
    caption: z.string().optional(),
    lowLabel: z.string().optional(),
    highLabel: z.string().optional(),
    statOneValue: z.string().optional(),
    statOneLabel: z.string().optional(),
    statTwoValue: z.string().optional(),
    statTwoLabel: z.string().optional(),
    statThreeValue: z.string().optional(),
    statThreeLabel: z.string().optional(),
  })
  .optional();

const narrativeVisualSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    steps: z.array(z.string()).optional(),
  })
  .optional();

const reusableVisualItemSchema = z.object({
  label: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(),
  note: z.string().optional(),
  description: z.string().optional(),
  year: z.union([z.string(), z.number()]).optional(),
  title: z.string().optional(),
});

const articleContentBlockSchema = z
  .array(
    z.object({
      type: z.string().optional(),
      heading: z.string().optional(),
      text: z.string().optional(),
      quote: z.string().optional(),
      attribution: z.string().optional(),
      image: z.string().optional(),
      alt: z.string().optional(),
      title: z.string().optional(),
      caption: z.string().optional(),
      source: z.string().optional(),
      kicker: z.string().optional(),
      value: z.string().optional(),
      label: z.string().optional(),
      visualType: z.string().optional(),
      unit: z.string().optional(),
      highlightLabel: z.string().optional(),
      lowLabel: z.string().optional(),
      highLabel: z.string().optional(),
      leftLabel: z.string().optional(),
      leftValue: z.string().optional(),
      rightLabel: z.string().optional(),
      rightValue: z.string().optional(),
      items: z.array(reusableVisualItemSchema).optional(),
      points: z.array(reusableVisualItemSchema).optional(),
      events: z.array(reusableVisualItemSchema).optional(),
    })
  )
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
    authorImage: z.string().optional(),
    date: z.coerce.date(),
    readTime: z.string().optional(),
    abstract: z.string(),
    heroImage: z.string().optional(),
    showVisualStorytelling: z.boolean().default(true),
    mainVisual: visualSchema,
    visualSummary: visualSummarySchema,
    narrativeVisual: narrativeVisualSchema,
    contentBlocks: articleContentBlockSchema,
    sources: z.array(sourceSchema).optional(),
    topics: z.array(z.string()).optional(),
    summaryPoints: z.array(z.string()).optional(),
  }),
});

export const collections = {
  articulos,
};
