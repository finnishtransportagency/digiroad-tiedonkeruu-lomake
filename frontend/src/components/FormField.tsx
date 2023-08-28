import styled from 'styled-components'
import { Field } from 'formik'

const FormField = styled(Field)`
	font-size: 1em;
	margin: 0.5em;
	border: 1px solid rgba(34, 36, 38, 0.15);
	border-radius: 0.3em;
	padding: 0.75em 1em;

	&:focus {
		border: 1px solid ${props => props.theme.mainButtonColor};
	}
`

export default FormField
