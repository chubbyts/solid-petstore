import { z } from 'zod';

export const numberSchema = z.union([
  z
    .string()
    .refine((number) => !Number.isNaN(parseInt(number, 10)))
    .transform((number) => parseInt(number, 10)),
  z.number(),
]);

export const sortSchema = z.union([z.literal('asc'), z.literal('desc')]);

const linkSchema = z.object({
  href: z.string(),
});

export const modelRequestSchema = z.object({}).strict();

export type ModelRequest = z.infer<typeof modelRequestSchema>;

export const modelResponseSchema = z
  .object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    _links: z
      .object({
        read: linkSchema.optional(),
        update: linkSchema.optional(),
        delete: linkSchema.optional(),
      })
      .strict(),
  })
  .strict();

export type ModelResponse = z.infer<typeof modelResponseSchema>;

export const modelListRequestSchema = z
  .object({
    offset: numberSchema.optional(),
    limit: numberSchema.optional(),
    filters: z.object({}).strict().optional(),
    sort: z.object({}).strict().optional(),
  })
  .strict();

export type ModelListRequest = z.infer<typeof modelListRequestSchema>;

export const modelListResponseSchema = z
  .object({
    offset: numberSchema,
    limit: numberSchema,
    filters: z.object({}).strict(),
    sort: z.object({}).strict(),
    count: numberSchema,
    items: z.array(modelResponseSchema),
    _links: z.object({
      create: linkSchema.optional(),
    }),
  })
  .strict();

export type ModelListResponse = z.infer<typeof modelListResponseSchema>;
