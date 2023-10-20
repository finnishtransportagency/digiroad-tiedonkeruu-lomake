import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ThemeProvider } from 'styled-components'
import { reCaptchaSiteKey } from './config'
import theme, { GlobalStyle } from './theme'
import App from './App'

import './i18n/config'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<GoogleReCaptchaProvider reCaptchaKey={reCaptchaSiteKey}>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<App />
			</ThemeProvider>
		</GoogleReCaptchaProvider>
	</React.StrictMode>,
)
