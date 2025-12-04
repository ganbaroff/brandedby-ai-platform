import z from "zod";

// Celebrity Schema (Unified)
export const CelebritySchema = z.object({
  id: z.number(),
  name: z.string(),
  region: z.enum(['international', 'azerbaijan']),
  role: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  niches: z.string(), // JSON string array
  rating: z.number(),
  popularity: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  biography_ru: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  career_milestones: z.array(z.object({
    year: z.number(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
  })).optional(),
  // Azerbaijan-specific fields
  name_az: z.string().optional(),
  birth_year: z.number().optional(),
  biography: z.string().optional(),
  career_highlights: z.array(z.string()).optional(),
  social_media: z.object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
  video_templates: z.array(z.string()).optional(),
});

export type Celebrity = z.infer<typeof CelebritySchema>;

// Template Schema
export const TemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  is_azeri: z.boolean(),
  preview_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Template = z.infer<typeof TemplateSchema>;

// Project Schema
export const ProjectSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable(),
  celebrity_id: z.number().nullable(),
  template_id: z.number().nullable(),
  package_type: z.string(),
  video_format: z.string().nullable(),
  niche: z.string().nullable(),
  description: z.string().nullable(),
  custom_location_url: z.string().nullable(),
  additional_character_url: z.string().nullable(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Package Types
export type PackageType = 'Standard' | 'Pro' | 'Premium';

export interface PackageInfo {
  name: PackageType;
  price: number;
  duration: string;
  quality: string;
  watermark: boolean;
  customLocation: boolean;
  additionalCharacters: number;
  features: string[];
}

// Video Format Types
export type VideoFormat = 'greeting' | 'advertisement' | 'announcement' | 'educational' | 'entertainment';

// API Response Types

// Specify the data type for data if possible. For example, z.unknown() or a specific zod object
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
