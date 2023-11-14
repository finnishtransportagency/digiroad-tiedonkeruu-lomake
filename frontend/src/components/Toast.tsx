import styled, { DefaultTheme } from 'styled-components'
import LoadingCircle from './LoadingCircle'
import theme from '../theme'

export type ToastProps = {
	$visible: boolean
	message: string
	type: 'loading' | 'success' | 'error'
}

const toastColor = (type: ToastProps['type'], theme: DefaultTheme) => {
	switch (type) {
		case 'loading':
			return theme.primaryColor
		case 'success':
			return theme.positiveColor
		case 'error':
			return theme.negativeColor
		default:
			return theme.primaryColor
	}
}

const StyledToast = styled.div<Omit<ToastProps, 'message'>>`
	position: fixed;
	top: 25%;
	left: 50%;
	transform: translate(-50%, ${props => (props.$visible ? '-50%' : '-100%')});
	padding: 1em;
	border-radius: ${props => props.theme.borderRadius};
	background-color: ${props => toastColor(props.type, props.theme)};
	opacity: ${props => (props.$visible ? 1 : 0)};
	transition:
		transform 0.5s ease-in-out,
		opacity 0.5s ease-in-out;
	z-index: 999;
`

const Message = styled.div`
	display: flex;
	align-items: center;
	text-align: center;
	gap: 0.5em;
	color: ${props => props.theme.buttonAccentColor};
`

const Toast = ({ $visible, message, type }: ToastProps) => {
	return (
		<StyledToast $visible={$visible} type={type}>
			<Message>
				{type === 'loading' && <LoadingCircle $color={theme.buttonAccentColor} />}
				{message}
			</Message>
		</StyledToast>
	)
}

export default Toast

