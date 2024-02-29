import { z } from 'zod';
import { modelResponseSchema, listRequestSchema, sortSchema, listResponseSchema } from './model';

export const petRequestSchema = z.object({
  name: z.string(),
  tag: z.string().nullish(),
  vaccinations: z.array(
    z.object({
      name: z.string(),
    }),
  ),
});

export type PetRequest = z.infer<typeof petRequestSchema>;

export const petResponseSchema = z.object({
  ...modelResponseSchema.shape,
  ...petRequestSchema.shape,
});

export type PetResponse = z.infer<typeof petResponseSchema>;

export const petFiltersSchema = z.object({
  name: z.string().optional(),
});

export type PetFilters = z.infer<typeof petFiltersSchema>;

export const petSortSchema = z.object({
  name: sortSchema.optional(),
});

export type PetSort = z.infer<typeof petSortSchema>;

export const petListRequestSchema = z.object({
  ...listRequestSchema.shape,
  filters: petFiltersSchema.optional(),
  sort: petSortSchema.optional(),
});

export type PetListRequest = z.infer<typeof petListRequestSchema>;

export const petListResponseSchema = z.object({
  ...listResponseSchema.shape,
  filters: petFiltersSchema,
  sort: petSortSchema,
  items: z.array(petResponseSchema),
});

export type PetListResponse = z.infer<typeof petListResponseSchema>;
