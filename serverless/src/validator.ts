import { z } from 'zod'

const schema = z.object({
  reporter: z.string(),
  email: z.string().email(),
  project: z.string(),
  municipality: z.string(),
  opening_date: z.string().transform(value => new Date(value)),
})

const validate = (input: unknown) => {
  return schema.parse(input)
}

export default validate
