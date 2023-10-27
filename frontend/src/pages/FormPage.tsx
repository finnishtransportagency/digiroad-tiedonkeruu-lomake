/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Formik, Form, FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useTranslation } from 'react-i18next'
import { useCallback, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { GoogleReCaptcha } from 'react-google-recaptcha-v3'
import FieldLabel from '../components/FieldLabel'
import FormField from '../components/FormField'
import ErrorLabel from '../components/ErrorLabel'
import schema, { ACCEPTED_FILE_TYPES, defaultValues, FormValues } from '../schema'
import Button from '../components/Button'
import Container from '../components/Container'
import Heading from '../components/Heading'
import httpService from '../services/httpService'
import { apiURL } from '../config'

import 'react-datepicker/dist/react-datepicker.css'

const FormPage = () => {
	const { t, i18n } = useTranslation()
	const fileInputRef = useRef<HTMLInputElement>()
	const [reCaptchaToken, setReCaptchaToken] = useState('')
	const [refreshReCaptcha, setRefreshReCaptcha] = useState(false)

	const verifyReCaptcha = useCallback((token: string) => {
		setReCaptchaToken(token)
	}, [])

	const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
		const formData = new FormData()

		formData.append('lang', i18n.language)
		formData.append('reporter', values.reporter)
		formData.append('email', values.email)
		formData.append('project', values.project)
		formData.append('municipality', values.municipality)
		formData.append('opening_date', values.opening_date)
		if (values.file) formData.append('files', values.file)

		if (await httpService.post(apiURL, formData, reCaptchaToken)) {
			if (fileInputRef.current) fileInputRef.current.value = ''
			actions.resetForm()
			setRefreshReCaptcha(r => !r)
		}
	}

	const handleReset = (resetForm: () => void) => {
		if (confirm(t('form.reset_confirm'))) {
			if (fileInputRef.current) fileInputRef.current.value = ''
			resetForm()
		}
	}

	return (
		<Container>
			<Heading $level='h1'>{t('form.title')}</Heading>
			<Formik
				onSubmit={handleSubmit}
				initialValues={defaultValues}
				validationSchema={toFormikValidationSchema(schema)}
			>
				{({ errors, touched, values, setFieldValue, setFieldTouched, isValid, resetForm }) => (
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

						<FieldLabel htmlFor='file'>{t('form.file')}</FieldLabel>
						<FormField
							as='input'
							type='file'
							ref={fileInputRef}
							accept={ACCEPTED_FILE_TYPES.join(',')}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								if (!event.currentTarget.files || event.currentTarget.files.length < 1) {
									setFieldValue('file', null)
								} else {
									setFieldValue('file', event.currentTarget.files[0])
								}
							}}
						/>
						{errors.file ? (
							// @ts-ignore
							<ErrorLabel>{t(errors.file)}</ErrorLabel>
						) : null}

						<GoogleReCaptcha onVerify={verifyReCaptcha} refreshReCaptcha={refreshReCaptcha} />

						<br />

						<Button type='button' onClick={() => handleReset(resetForm)} color='negative'>
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
