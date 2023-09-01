import { t } from 'i18next'
import { z } from 'zod'

const schema = z.object({
	reporter: z.string({
		required_error: t('errors.reporter'),
	}),
	email: z
		.string({
			required_error: t('errors.email.required'),
		})
		.email({
			message: t('errors.email.value'),
		}),
	project: z.string({
		required_error: t('errors.reporter'),
	}),
	municipality: z.string({
		required_error: t('errors.reporter'),
	}),
	opening_date: z
		.date({
			coerce: true,
			errorMap: (issue, ctx) => {
				// console.log(issue)
				if (issue.code === 'invalid_type') {
					return { message: t('errors.opening_date.required') }
				}
				if (issue.code === 'invalid_date') {
					return { message: t('errors.opening_date.value') }
				}
				return { message: ctx.defaultError }
			},
		})
		.min(new Date(new Date().setHours(0, 0, 0, 0)), t('errors.opening_date.min')),
})

export const defaultValues = {
	reporter: '',
	email: '',
	project: '',
	municipality: '',
	opening_date: new Date().toString(),
}

export default schema
