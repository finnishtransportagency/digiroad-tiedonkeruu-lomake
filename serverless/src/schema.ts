import { z } from 'zod'
import { SUPPORTED_LANGUAGES } from './translations'

// Remember to update frontend also if you change these values
/**
 * Amazon SES supports emails with a message size of up to 40MB but
 * lambda function has a limit of 6MB for the invocation payload.
 * Backend has a limit of 39MB incase the invocation payload somehow
 * contains file larger than 6MB.
 */
const MAX_TOTAL_FILE_SIZE = 39_000_000
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/acad',
  'image/vnd.dwg',
  'image/x-dwg',
  'application/dxf',
  'image/vnd.dxf',
  'image/vnd.dgn',
] as [string, ...string[]]
// ^----------------------------------------------------------^

const schema = z.object({
  lang: z.enum(SUPPORTED_LANGUAGES),
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
        content: z.instanceof(Buffer),
        encoding: z.string(),
      })
    )
    .refine(
      files =>
        files.reduce((totalSize: number, file) => {
          return totalSize + file.content.length
        }, 0) <= MAX_TOTAL_FILE_SIZE,
      `File size too large`
    ),
})

export type Report = z.infer<typeof schema>

const validate = (input: Object): Report => {
  const safeParseResult = schema.safeParse(input)
  if (safeParseResult.success) return safeParseResult.data
  if (safeParseResult.error.issues.filter(issue => issue.path[0] === 'lang').length > 0)
    return schema.parse({ ...input, lang: SUPPORTED_LANGUAGES[0] })
  throw safeParseResult.error
}

export default { validate }
