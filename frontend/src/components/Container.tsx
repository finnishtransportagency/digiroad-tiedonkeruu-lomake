import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 40em;
	margin: 0.5em;
	box-shadow: 1px 1px 2px silver;
	border: 1px solid silver;
	border-radius: ${props => props.theme.borderRadius};
	padding: 1em;
`

export default Container
