import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const StyledFooter = styled.footer`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 1em;
	margin-top: 1em;
	margin-bottom: 5em;
	user-select: none;
`

const Footer = () => {
	const { t } = useTranslation()

	return (
		<StyledFooter>
			<a href={t('links.suravage.link')} target='_blank' rel='noreferrer'>
				{t('links.suravage.description')}
			</a>
			&bull;
			<a href={t('links.yllapito.link')} target='_blank' rel='noreferrer'>
				{t('links.yllapito.description')}
			</a>
			&bull;
			<a href={t('links.drsovellus.link')} target='_blank' rel='noreferrer'>
				{t('links.drsovellus.description')}
			</a>
		</StyledFooter>
	)
}

export default Footer
