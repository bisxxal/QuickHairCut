import { z } from 'zod'
 
export const createProfileForm = z.object({
  name: z
    .string()
    .transform(val => val === '' ? undefined : val)
    .optional()
    .refine(val => !val || val.length >= 3, { message: 'Name must be atleast 3 characters' }),

  bio: z.string()
    .transform(val => val === '' ? undefined : val)
    .optional()
    .refine(val => !val || val.length >= 3, { message: 'bio must be atleast 3 characters' }),

  age: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      return Number(val);
    }, z.number().min(18, { message: 'Age must be at least 18' }).optional()),


  relationshipGoals: z.string().min(3, 'looking for must be atleast 3 characters'),
  batch: z.string().optional(),
  gender: z.string(),
  height: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return Number(val);
  }, z.number().min(18, { message: 'height should not greater than 8 ft' }).optional()),
  languages: z.string()
    .transform(val => val === '' ? undefined : val)
    .optional()
    .refine(val => !val || val.length >= 3, { message: 'languages must be atleast 3 characters' }),
  job: z
    .string()
    .transform(val => val === '' ? undefined : val)
    .optional()
    .refine(val => !val || val.length >= 3, { message: 'job must be atleast 3 characters' }),

  livingIn: z
    .string()
    .transform(val => val === '' ? undefined : val)
    .optional()
    .refine(val => !val || val.length >= 3, { message: 'living in must be atleast 3 characters' }),

})
export type TCreateProfileForm = z.infer<typeof createProfileForm>

export const reportABug = z.object({
  title: z.string().min(3, 'Title must be atleast 5 characters'),
  description: z.string().min(3, 'Description must be atleast 5 characters'),
})

export type TReportABug = z.infer<typeof reportABug>