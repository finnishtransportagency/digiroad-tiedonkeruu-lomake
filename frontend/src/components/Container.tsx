import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 40em;
	margin: 0.5em;
	background-color: ${props => props.theme.bgColor};
	box-shadow: 1px 1px 2px silver;
	border: 1px solid silver;
	border-radius: 0 ${props => props.theme.borderRadius} ${props => props.theme.borderRadius}
		${props => props.theme.borderRadius};
	padding: 1em;
	z-index: 1;
`

export default Container
