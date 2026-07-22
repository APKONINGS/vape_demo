import { z } from "zod";

// Single source of truth for password strength, shared by the zod schemas below (server
// + client-side validation) and the live checklist UI in components/password-requirements.tsx
// (so the checklist can never drift out of sync with what's actually enforced).
export const PASSWORD_REQUIREMENTS = [
  { id: "length", label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { id: "lowercase", label: "One lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { id: "number", label: "One number", test: (pw: string) => /[0-9]/.test(pw) },
  { id: "special", label: "One special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
] as const satisfies readonly { id: string; label: string; test: (pw: string) => boolean }[];

const passwordSchema = z
  .string()
  .max(72, "Password is too long")
  .refine((pw) => PASSWORD_REQUIREMENTS.every((req) => req.test(pw)), {
    message: "Password does not meet all requirements",
  });

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Enter a valid email address"),
  password: passwordSchema,
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const productSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  description: z.string().max(4000).default(""),
  price: z.number().int().positive("Price must be a positive number of cents"),
  salePrice: z.number().int().positive().nullable(),
  images: z.array(z.string().url("Each image must be a valid URL")).min(1, "Provide at least one image URL"),
  sizes: z.array(z.string().min(1)).min(1, "Provide at least one size"),
  colors: z.array(z.string().min(1)).min(1, "Provide at least one color"),
  stock: z.number().int().min(0),
  active: z.boolean(),
  categoryId: z.string().nullable(),
});
export type ProductInput = z.infer<typeof productSchema>;

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"]),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  vehicleType: z.enum(["SEDAN", "SUV", "TRUCK", "ANY"]),
  parentId: z.string().nullable(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const collectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  bannerUrl: z.string().url("Must be a valid URL").nullable(),
  productIds: z.array(z.string()),
});
export type CollectionInput = z.infer<typeof collectionSchema>;

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1, "Rating is required").max(5),
  comment: z.string().max(2000).default(""),
});
export type ReviewInput = z.infer<typeof reviewSchema>;
