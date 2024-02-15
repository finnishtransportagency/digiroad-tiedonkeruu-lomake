import styled from 'styled-components'

const StyledTooltip = styled.div`
	font-weight: normal;
	visibility: hidden;
	position: absolute;
	z-index: 1;
	bottom: 120%;
	right: -300%;
	width: 15em;
	border: 0.2em solid ${props => props.theme.primaryColor};
	border-radius: ${props => props.theme.borderRadius};
	padding: 0.5em;
	color: ${props => props.theme.accentColor};
	background-color: ${props => props.theme.bgColor};
`

const TooltipTriangle = styled.div`
	visibility: hidden;
	position: absolute;
	bottom: 60%;
	left: 20%;
	border-width: 0.6em;
	border-style: solid;
	border-color: ${props => props.theme.primaryColor} transparent transparent transparent;
`

const TooltipIcon = styled.div`
	position: relative;
	top: 0.45em;
	display: inline-block;
	width: 1em;
	height: 1em;
	margin-left: 0.5em;
	text-align: center;
	color: ${props => props.theme.buttonAccentColor};
	background-color: ${props => props.theme.primaryColor};
	padding: 0.3em 0.4em 0.45em 0.4em;
	font-weight: bold;
	font-size: 0.75em;
	border-radius: 50%;

	&:hover ${StyledTooltip} {
		visibility: visible;
	}
	&:hover ${TooltipTriangle} {
		visibility: visible;
	}
`

const Tooltip = ({ message }: { message: string }) => {
	return (
		<TooltipIcon>
			?
			<TooltipTriangle />
			<StyledTooltip>{message}</StyledTooltip>
		</TooltipIcon>
	)
}

export default Tooltip

