/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Formik, Form, FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import FieldLabel from '../components/FieldLabel'
import FormField from '../components/FormField'
import ErrorLabel from '../components/ErrorLabel'
import schema, { defaultValues, FormValues } from '../schema'
import Button from '../components/Button'
import Container from '../components/Container'
import Heading from '../components/Heading'
import httpService from '../services/httpService'
import { apiURL } from '../config'

import 'react-datepicker/dist/react-datepicker.css'

const FormPage = () => {
	const { t } = useTranslation()

	const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
		console.log(await httpService.post(apiURL, values))
		actions.resetForm()
	}

	return (
		<Container>
			<Heading $level='h1'>{t('form.title')}</Heading>
			<Formik
				onSubmit={handleSubmit}
				initialValues={defaultValues}
				validationSchema={toFormikValidationSchema(schema)}
			>
				{({ errors, touched, values, setFieldValue, setFieldTouched, isValid }) => (
					<Form>
						<FieldLabel htmlFor='reporter'>{t('form.reporter')}</FieldLabel>
						<FormField name='reporter' placeholder={t('form.reporter')} />
						{errors.reporter && touched.reporter ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.reporter)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='email'>{t('form.email')}</FieldLabel>
						<FormField name='email' placeholder={t('form.email')} />
						{errors.email && touched.email ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.email)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='project'>{t('form.project')}</FieldLabel>
						<FormField name='project' placeholder={t('form.project')} />
						{errors.project && touched.project ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.project)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='municipality'>{t('form.municipality')}</FieldLabel>
						<FormField name='municipality' placeholder={t('form.municipality')} />
						{errors.municipality && touched.municipality ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.municipality)}</ErrorLabel>
						) : null}

						<FieldLabel htmlFor='opening_date'>{t('form.opening_date')}</FieldLabel>
						<FormField
							as={DatePicker}
							name='opening_date'
							selected={new Date(values.opening_date)}
							onChange={(date: string) => {
								void setFieldTouched('opening_date')
								void setFieldValue('opening_date', new Date(date))
							}}
							dateFormat='dd.MM.yyyy'
						/>
						{errors.opening_date && touched.opening_date ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.opening_date)}</ErrorLabel>
						) : null}

						<br />
						<Button type='reset' color='negative'>
							{t('form.reset')}
						</Button>
						<Button type='submit' color='positive' disabled={!isValid}>
							{t('form.submit')}
						</Button>
					</Form>
				)}
			</Formik>
		</Container>
	)
}

export default FormPage