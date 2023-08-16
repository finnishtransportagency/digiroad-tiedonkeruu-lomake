import { useTranslation } from 'react-i18next'

function App() {
	const { t } = useTranslation()
	return (
		<div>
			<h1>{t('title')}</h1>
			<p>{t('hello')}</p>
		</div>
	)
}

export default App
