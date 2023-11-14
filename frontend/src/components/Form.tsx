import { Form as FormikForm } from 'formik'
import styled from 'styled-components'

// Wraps after every two children
const Form = styled(FormikForm)`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
`

export default Form

