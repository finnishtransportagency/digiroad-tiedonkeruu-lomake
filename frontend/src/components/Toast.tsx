import styled, { DefaultTheme, keyframes } from 'styled-components'
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

const fadeIn = keyframes`
  from {
		display: none;
    opacity: 0;
    transform: translate(-50%, -100%);
  }
  to {
		display: block;
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`

const fadeOut = keyframes`
  from {
		display: block;
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  to {
		display: none;
    opacity: 0;
    transform: translate(-50%, -100%);
  }
`

const StyledToast = styled.div<Omit<ToastProps, 'message'>>`
	position: fixed;
	display: ${props => (props.$visible ? 'block' : 'none')};
	top: 25%;
	left: 50%;
	transform: translate(-50%, ${props => (props.$visible ? '-50%' : '-100%')});
	padding: 1em;
	border-radius: ${props => props.theme.borderRadius};
	background-color: ${props => toastColor(props.type, props.theme)};
	animation: ${props => (props.$visible ? fadeIn : fadeOut)} 0.5s ease-in-out;
	animation-fill-mode: forwards;
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
