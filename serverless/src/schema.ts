import { z } from 'zod'
import { SUPPORTED_LANGUAGES } from './translations'

// Remember to update frontend also if you change these values
/**
 * Amazon SES supports emails with a message size of up to 40MB but
 * lambda function has a limit of 6MB for the invocation payload.
 * Backend has a limit of 39MB incase the invocation payload somehow
 * contains file larger than 6MB.
 */
const MAX_FILE_SIZE = 39_000_000
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
  lang: z
    .string()
    .optional()
    .transform(value => {
      if (!SUPPORTED_LANGUAGES.includes(value as (typeof SUPPORTED_LANGUAGES)[number])) {
        return 'fi'
      }
      return value
    }),
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
