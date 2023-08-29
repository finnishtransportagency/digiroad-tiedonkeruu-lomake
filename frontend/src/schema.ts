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
})

export const defaultValues = {
	reporter: '',
	email: '',
	project: '',
	municipality: '',
}

export default schema

