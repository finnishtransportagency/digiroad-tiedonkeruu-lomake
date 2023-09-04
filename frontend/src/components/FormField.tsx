import styled from 'styled-components'
import { Field } from 'formik'

const FormField = styled(Field)`
	font-family: ${props => props.theme.editableFont};
	font-size: 0.98em;
	margin: 0.5em;
	border: 1px solid silver;
	border-radius: 0.3em;
	padding: 0.75em 1em;

	&:focus {
		outline: 2px solid ${props => props.theme.primaryColor};
	}
`

export default FormField
