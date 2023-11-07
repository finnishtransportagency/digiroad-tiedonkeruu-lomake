import styled from 'styled-components'

const LoadingCircle = styled.div<{ $color: string }>`
	width: 1.5em;
	height: 1.5em;
	border: 3px solid transparent;
	border-top: 3px solid ${props => props.$color};
	animation: spin 1s linear infinite;
	border-radius: 50%;

	@-ms-keyframes spin {
		from {
			-ms-transform: rotate(0deg);
		}
		to {
			-ms-transform: rotate(360deg);
		}
	}
	@-moz-keyframes spin {
		from {
			-moz-transform: rotate(0deg);
		}
		to {
			-moz-transform: rotate(360deg);
		}
	}
	@-webkit-keyframes spin {
		from {
			-webkit-transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(360deg);
		}
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`

export default LoadingCircle

