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
]
// ^----------------------------------------------------------^

const schema = z.object({
  reporter: z.string(),
  email: z.string().email(),
  project: z.string(),
  municipality: z.string(),
  opening_date: z.string().transform(value => new Date(value)),
  files: z.array(
    z
      .any()
      .refine(file => !file || file.content.length <= MAX_FILE_SIZE, `File size too large`)
      .refine(file => !file || ACCEPTED_FILE_TYPES.includes(file.contentType), 'Invalid file type')
  ),
})

export type Report = z.infer<typeof schema>

const validate = (input: unknown): Report => {
  return schema.parse(input)
}

export default validate
