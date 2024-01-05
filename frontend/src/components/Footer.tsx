import styled from 'styled-components'

const StyledFooter = styled.footer`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 1.5em;
	margin-top: 1em;
	margin-bottom: 5em;
	user-select: none;
`

const Footer = () => {
	return (
		<StyledFooter>
			<a
				href='https://vayla.fi/vaylista/aineistot/digiroad/yllapito/suunniteltu-rakennusvaiheen-geometria/suravage-paaohje'
				target='_blank'
				rel='noreferrer'
			>
				Suravage-pääohje
			</a>
			&bull;
			<a
				href='https://vayla.fi/vaylista/aineistot/digiroad/yllapito/yllapito-ohje-kunnille'
				target='_blank'
				rel='noreferrer'
			>
				Ylläpito-ohje kunnille
			</a>
			&bull;
			<a href='https://digiroad.vaylapilvi.fi/' target='_blank' rel='noreferrer'>
				Digiroad-sovellus
			</a>
		</StyledFooter>
	)
}

export default Footer

