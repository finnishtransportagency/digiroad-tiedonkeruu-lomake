import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import Button from './Button'

const languages = [
	{ label: 'suomeksi', value: 'fi' },
	{ label: 'på svenska', value: 'sv' },
] as const

type LanguageValues = (typeof languages)[number]['value']
type LanguageButtonProps = { $first: boolean; $last: boolean; $selected: boolean }

const LanguageButton = styled(Button)<LanguageButtonProps>`
	margin: 0;
	border-radius: ${props => {
		if (props.$first) {
			return `${props.theme.borderRadius} 0 0 ${props.theme.borderRadius}`
		}
		if (props.$last) {
			return `0 ${props.theme.borderRadius} ${props.theme.borderRadius} 0`
		}
		return '0'
	}};
	${props =>
		props.$selected
			? null
			: `
	color: ${props.theme.primaryColor};
	background-color: ${props.theme.buttonAccentColor};`}
`

const LanguageSelector = () => {
	const { i18n } = useTranslation()
	const [selectedOption, setSelected] = useState<LanguageValues>(languages[0].value)

	const handleOptionChange = (value: LanguageValues) => {
		setSelected(value)
		void i18n.changeLanguage(value)
	}

	return (
		<div>
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
		</div>
	)
}

export default LanguageSelector
