import styled from 'styled-components'

type HeadingProps = {
	$level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	children: string
}

const getFontSize = ($level: HeadingProps['$level']) => {
	switch ($level) {
		case 'h1':
			return '2em'
		case 'h2':
			return '1.5em'
		case 'h3':
			return '1.25em'
		case 'h4':
			return '1.145em'
		case 'h5':
			return '1.12em; font-weight: normal'
		case 'h6':
			return '1.07em; font-weight: normal'
	}
}

const StyledHeading = styled.h1<HeadingProps>`
	margin-top: 0;
	font-size: ${props => getFontSize(props.$level)};
`

const Heading = (props: HeadingProps) => {
	return (
		<StyledHeading as={props.$level} $level={props.$level}>
			{props.children}
		</StyledHeading>
	)
}

export default Heading
