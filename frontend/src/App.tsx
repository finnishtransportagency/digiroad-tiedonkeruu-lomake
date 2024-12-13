import { useState } from 'react'
import LanguageSelector from './components/LanguageSelector'
import Toast, { ToastProps } from './components/Toast'
import ContructionReport from './pages/ConstructionReport'
import Footer from './components/Footer'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LinkTab from './components/LinkTab'
import VerticalGroup from './components/VericalGroup'
import Navbar from './components/Navbar'
import OpeningReport from './pages/OpeningReport'
import { useTranslation } from 'react-i18next'

const App = () => {
	const { t } = useTranslation()
	const [toastProps, setToastProps] = useState<ToastProps>({
		$visible: false,
		message: '',
		type: 'success',
	})

	return (
		<BrowserRouter>
			<VerticalGroup>
				<LanguageSelector />
				<Navbar>
					<LinkTab to='/rakentamisen-aloitus'>{t('tabs.construction')}</LinkTab>
					<LinkTab to='/liikenteelle-avaus'>{t('tabs.opening')}</LinkTab>
				</Navbar>
				<Routes>
					<Route path='/' element={<Navigate to='/rakentamisen-aloitus' />} />
					<Route
						path='/rakentamisen-aloitus'
						element={<ContructionReport setToastProps={setToastProps} />}
					/>
					<Route
						path='/liikenteelle-avaus'
						element={<OpeningReport setToastProps={setToastProps} />}
					/>
				</Routes>
				<Footer />
				<Toast {...toastProps} />
			</VerticalGroup>
		</BrowserRouter>
	)
}

export default App
