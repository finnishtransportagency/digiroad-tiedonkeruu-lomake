import styled from 'styled-components'

const ErrorLabel = styled.div`
	margin-top: -0.5em;
	margin-left: 0.5em;
	font-size: 1em;
	color: ${props => props.theme.negativeColor};
`

const StyledPlaceholder = styled(ErrorLabel)`
	opacity: 0;
`

export const ErrorLabelPlaceholder = () => {
	return <StyledPlaceholder>error placeholder</StyledPlaceholder>
}

export default ErrorLabel
