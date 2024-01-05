import { useState } from 'react'
import LanguageSelector from './components/LanguageSelector'
import Toast, { ToastProps } from './components/Toast'
import FormPage from './pages/FormPage'
import Footer from './components/Footer'

const App = () => {
	const [toastProps, setToastProps] = useState<ToastProps>({
		$visible: false,
		message: '',
		type: 'success',
	})

	return (
		<>
			<LanguageSelector />
			<FormPage setToastProps={setToastProps} />
			<Footer />
			<Toast {...toastProps} />
		</>
	)
}

export default App
