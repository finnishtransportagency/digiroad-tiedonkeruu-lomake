/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Formik, FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { GoogleReCaptcha } from 'react-google-recaptcha-v3'
import { v4 as uuidv4 } from 'uuid'
import Form from '../components/form/Form'
import FieldLabel from '../components/form/FieldLabel'
import FormField from '../components/form/FormField'
import ErrorLabel, { ErrorLabelPlaceholder } from '../components/form/ErrorLabel'
import FormikPersist from '../components/form/FormikPersist'
import VerticalGroup from '../components/VericalGroup'
import HorizontalGroup from '../components/HorizontalGroup'
import { ToastProps } from '../components/Toast'
import Button from '../components/Button'
import Container from '../components/Container'
import Heading from '../components/Heading'
import httpService from '../services/httpService'
import { apiURL } from '../config'
import { resources } from '../i18n/config'
import municipalities from '../i18n/municipalities'

import 'react-datepicker/dist/react-datepicker.css'
import schemas, { OpeningFormValues, openingDefaultValues } from '../schemas'

const OpeningReport = ({
	setToastProps,
}: {
	setToastProps: Dispatch<SetStateAction<ToastProps>>
}) => {
	const { t, i18n } = useTranslation()
	const fileInputRef = useRef<HTMLInputElement>()
	const descriptionInputRef = useRef<HTMLTextAreaElement>()
	const [reCaptchaToken, setReCaptchaToken] = useState('')
	const [refreshReCaptcha, setRefreshReCaptcha] = useState(false)
	const [municipalitySuggestions, setMunicipalitySuggestions] = useState<string[]>([])

	useEffect(() => {
		// Refresh reCaptcha token every 110 seconds (token expires after 120 seconds)
		const interval: NodeJS.Timer = setInterval(() => {
			setRefreshReCaptcha(r => !r)
		}, 1000 * 110)
		return () => clearInterval(interval)
	}, [i18n])

	useEffect(() => {
		setMunicipalitySuggestions(municipalities[i18n.language as keyof typeof resources])
	}, [i18n.language])

	const verifyReCaptcha = useCallback((token: string) => {
		setReCaptchaToken(token)
	}, [])

	const handleSubmit = async (
		values: OpeningFormValues,
		actions: FormikHelpers<OpeningFormValues>,
	) => {
		const reportId = uuidv4()
		setToastProps({ $visible: true, message: t('form.submitting'), type: 'loading' })

		const formData = new FormData()
		formData.append('report_id', reportId)
		formData.append('lang', i18n.language)
		formData.append('reporter', values.reporter)
		formData.append('email', values.email)
		formData.append('project', values.project)
		formData.append('municipality', values.municipality)
		formData.append('opening_date', values.opening_date)
		formData.append('description', values.description)
		// TODO: APPEND MAP DATA HERE

		if (
			(
				await httpService.post(`${apiURL}/api/postOpeningReport`, formData, {
					'g-recaptcha-response': reCaptchaToken,
				})
			).success
		) {
			// Successfull submit
			resetAllInputs(actions.resetForm)
			setToastProps({ $visible: true, message: t('form.submit_success'), type: 'success' })
		} else {
			// Failed submit
			setToastProps({ $visible: true, message: t('errors.submit'), type: 'error' })
		}

		setTimeout(() => {
			setToastProps(oldProps => ({ ...oldProps, $visible: false }))
		}, 3000)
		setRefreshReCaptcha(r => !r)
	}

	const handleReset = (resetForm: () => void) => {
		setRefreshReCaptcha(r => !r)
		if (confirm(t('form.reset_confirm'))) {
			resetAllInputs(resetForm)
		}
	}

	const resetAllInputs = (resetForm: () => void) => {
		if (fileInputRef.current) fileInputRef.current.value = ''
		if (descriptionInputRef.current) descriptionInputRef.current.value = ''
		resetForm()
	}

	return (
		<Container>
			<HorizontalGroup>
				<Heading $level='h1'>{t('form.openingTitle')}</Heading>
				<img
					src='/vayla_alla_fi_sv_rgb.png'
					alt='Väylävirasto-logo'
					style={{ userSelect: 'none' }}
					width='35%'
					height='35%'
				/>
			</HorizontalGroup>
			<Formik
				onSubmit={handleSubmit}
				initialValues={openingDefaultValues}
				validationSchema={toFormikValidationSchema(schemas.openingReportSchema)}
			>
				{({
					errors,
					touched,
					values,
					setFieldValue,
					setFieldTouched,
					isValid,
					isSubmitting,
					resetForm,
				}) => (
					<Form>
						<FormikPersist name='opening-values' />
						<VerticalGroup>
							<FieldLabel htmlFor='reporter'>{t('form.reporter')}</FieldLabel>
							<FormField
								name='reporter'
								placeholder={t('form.reporter')}
								$errors={errors.reporter && touched.reporter}
							/>
							{errors.reporter && touched.reporter ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.reporter)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='email'>{t('form.email')}</FieldLabel>
							<FormField
								name='email'
								placeholder={t('form.email')}
								$errors={errors.email && touched.email}
							/>
							{errors.email && touched.email ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.email)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='project'>{t('form.project')}</FieldLabel>
							<FormField
								name='project'
								placeholder={t('form.project')}
								$errors={errors.project && touched.project}
							/>
							{errors.project && touched.project ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.project)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='municipality'>{t('form.municipality')}</FieldLabel>
							<FormField
								name='municipality'
								placeholder={t('form.municipality')}
								$errors={errors.municipality && touched.municipality}
								list='muni-suggestions'
							/>
							{values.municipality.length > 1 && (
								<datalist id='muni-suggestions'>
									{municipalitySuggestions &&
										municipalitySuggestions
											.filter(suggestion =>
												suggestion
													.toLocaleLowerCase()
													.startsWith(values.municipality.toLocaleLowerCase()),
											)
											.map(suggestion => {
												return <option key={suggestion} value={suggestion} />
											})}
								</datalist>
							)}
							{errors.municipality && touched.municipality ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.municipality)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='opening_date'>{t('form.opening_date')}</FieldLabel>
							<FormField
								as={DatePicker}
								name='opening_date'
								$errors={errors.opening_date && touched.opening_date}
								selected={new Date(values.opening_date)}
								onChange={(date: string) => {
									void setFieldTouched('opening_date')
									void setFieldValue('opening_date', new Date(date))
								}}
								dateFormat='dd.MM.yyyy'
							/>
							{errors.opening_date ? (
								// @ts-ignore
								<ErrorLabel>{t(errors.opening_date)}</ErrorLabel>
							) : (
								<ErrorLabelPlaceholder />
							)}
						</VerticalGroup>

						<VerticalGroup>
							<FieldLabel htmlFor='description'>{t('form.description')}</FieldLabel>
							<FormField
								as='textarea'
								name='description'
								ref={descriptionInputRef}
								placeholder={t('form.description')}
								value={values.description}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setFieldValue('description', event.currentTarget.value)
								}
							/>
						</VerticalGroup>

						<VerticalGroup>
							<div
								style={{
									height: '15em',
									width: '100%',
									border: '1px solid',
									alignContent: 'center',
									textAlign: 'center',
								}}
							>
								KARTTAUPOTUS
							</div>

							<GoogleReCaptcha onVerify={verifyReCaptcha} refreshReCaptcha={refreshReCaptcha} />

							<HorizontalGroup>
								<Button
									type='button'
									onClick={() => handleReset(resetForm)}
									color='negative'
									disabled={isSubmitting}
								>
									{t('form.reset')}
								</Button>
								<Button type='submit' color='positive' disabled={!isValid || isSubmitting}>
									{t('form.submit')}
								</Button>
							</HorizontalGroup>
						</VerticalGroup>
					</Form>
				)}
			</Formik>
		</Container>
	)
}

export default OpeningReport

