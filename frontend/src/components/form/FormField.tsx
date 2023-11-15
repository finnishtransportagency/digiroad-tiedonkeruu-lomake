import styled from 'styled-components'
import { Field } from 'formik'

const FormField = styled(Field)<{ $errors: boolean; $maxWidth: string }>`
	flex-grow: 1;
	${props => (props.$maxWidth ? `max-width: ${props.$maxWidth};` : '')}
	font-family: ${props => props.theme.editableFont};
	font-size: 0.98em;
	margin: 0.5em;
	border: 1px solid silver;
	border-radius: ${props => props.theme.borderRadius};
	padding: 0.75em 1em;
	resize: ${props => (props.as === 'textarea' ? 'vertical' : 'none')};

	&:focus {
		outline: 2px solid ${props => props.theme.primaryColor};
	}

	${props => (props.$errors ? `border: 1px solid ${props.theme.negativeColor};` : '')}

	cursor: ${props => (props.type === 'file' ? 'pointer' : 'auto')};
	&::file-selector-button {
		display: none;
	}
`

export default FormField
