import { useEffect, useRef } from 'react'
import { useFormikContext } from 'formik'
import isEqual from 'react-fast-compare'
import { useDebouncedCallback } from 'use-debounce'
import { FormValues } from '../../schema'

/**
 * Preserves formik form values in local storage
 *
 * @param name The name of the local storage key
 */
const FormikPersist = ({ name }: { name: string }) => {
	const { values, setValues } = useFormikContext<FormValues>()
	const prefValuesRef = useRef<FormValues>()

	const onSave = (values: FormValues) => {
		// File objects cannot be stringified, so we remove them
		values.files = null
		window.localStorage.setItem(name, JSON.stringify(values))
	}

	const debouncedOnSave = useDebouncedCallback(onSave, 300)

	useEffect(() => {
		const savedForm = window.localStorage.getItem(name)

		if (savedForm) {
			const parsedForm = JSON.parse(savedForm)

			prefValuesRef.current = parsedForm
			setValues(parsedForm)
		}
	}, [name, setValues])

	useEffect(() => {
		if (!isEqual(prefValuesRef.current, values)) {
			debouncedOnSave(values)
		}
	})

	useEffect(() => {
		prefValuesRef.current = values
	})

	return null
}

export default FormikPersist

