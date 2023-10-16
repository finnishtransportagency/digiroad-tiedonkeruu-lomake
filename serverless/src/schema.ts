import { z } from 'zod'

// Remember to update frontend also if you change these values
const MAX_FILE_SIZE = 39000000 // Amazon SES now supports emails with a message size of up to 40MB
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/acad',
  'image/vnd.dwg',
  'image/x-dwg',
  'application/dxf',
  'image/vnd.dxf',
  'image/vnd.dgn',
] as const
// ^----------------------------------------------------------^

const schema = z.object({
  reporter: z.string({ required_error: 'Missing reporter' }),
  email: z.string({ required_error: 'Missing email' }).email({ message: 'Invalid email' }),
  project: z.string({ required_error: 'Missing project' }),
  municipality: z.string({ required_error: 'Missing municipality' }),
  opening_date: z
    .string({ required_error: 'Missing opening date' })
    .transform(value => new Date(value)),
  files: z
    .array(
      z.object({
        filename: z.string(),
        contentType: z
          .enum(ACCEPTED_FILE_TYPES)
          .refine(contentType => contentType !== undefined, { message: 'Invalid file type' }),
        content: z
          .instanceof(Buffer)
          .refine(content => !content || content.length <= MAX_FILE_SIZE, `File size too large`),
        encoding: z.string(),
      })
    )
    .refine(files => files.length <= 1, 'Too many files'),
})

export type Report = z.infer<typeof schema>

const validate = (input: unknown): Report => {
  return schema.parse(input)
}

export default { validate }
