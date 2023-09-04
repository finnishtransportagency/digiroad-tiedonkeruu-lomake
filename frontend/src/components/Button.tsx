import styled, { DefaultTheme } from 'styled-components'

type ButtonProps = { color?: 'positive' | 'negative' }

const buttonColor = (color: ButtonProps['color'], theme: DefaultTheme) => {
	switch (color) {
		case 'positive':
			return theme.positiveColor
		case 'negative':
			return theme.negativeColor
		default:
			return theme.primaryColor
	}
}

const Button = styled.button<ButtonProps>`
	font-family: 'Exo 2', sans-serif;
	color: ${props => props.theme.buttonAccentColor};
	background-color: ${props => buttonColor(props.color, props.theme)};
	margin: 0.5em;
	border: 2px solid ${props => buttonColor(props.color, props.theme)};
	border-radius: ${props => props.theme.borderRadius};
	padding: 0.75em 1.25em;
	font-size: 1em;
	cursor: pointer;

	transition: 0.1s;
	&:active:enabled {
		color: ${props => buttonColor(props.color, props.theme)};
		background-color: ${props => props.theme.buttonAccentColor};
	}
	&:disabled {
		filter: saturate(0.5) brightness(1.5);
		cursor: auto;
	}
`

export default Button
