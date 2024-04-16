import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import Button from './Button'
import { resources } from '../i18n/config'

const languages = [
	{ label: 'suomeksi', value: 'fi' },
	{ label: 'på svenska', value: 'sv' },
] as const

type LanguageValues = (typeof languages)[number]['value']
type LanguageButtonProps = { $first: boolean; $last: boolean; $selected: boolean }

const LanguageButton = styled(Button)<LanguageButtonProps>`
	font-size: 0.9em;
	padding: 0.65em 1.1em;
	margin: 0;
	border-radius: ${props => {
		if (props.$first) return `${props.theme.borderRadius} 0 0 ${props.theme.borderRadius}`
		if (props.$last) return `0 ${props.theme.borderRadius} ${props.theme.borderRadius} 0`
		return '0'
	}};
	${props =>
		props.$selected
			? null
			: `
	color: ${props.theme.primaryColor};
	background-color: ${props.theme.buttonAccentColor};`}
	user-select: none;
`

const LanguageButtonContainer = styled.div`
	align-self: flex-end;
`

const LanguageSelector = () => {
	const { i18n } = useTranslation()
	const defaultLanguage: LanguageValues = useMemo(() => {
		if (i18n.language in resources) return i18n.language as LanguageValues
		console.warn(`Unsupported language ${i18n.language}, falling back to fi`)
		i18n.changeLanguage('fi')
		return 'fi'
	}, [i18n])
	const [selectedOption, setSelected] = useState<LanguageValues>(defaultLanguage)

	const handleOptionChange = (value: LanguageValues) => {
		setSelected(value)
		void i18n.changeLanguage(value)
	}

	return (
		<LanguageButtonContainer>
			{languages.map((option, index) => {
				return (
					<LanguageButton
						key={option.value}
						$first={index === 0}
						$last={index === languages.length - 1}
						$selected={selectedOption === option.value}
						onClick={() => handleOptionChange(option.value)}
					>
						{option.label}
					</LanguageButton>
				)
			})}
		</LanguageButtonContainer>
	)
}

export default LanguageSelector
