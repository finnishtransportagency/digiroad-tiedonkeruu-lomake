import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

interface LinkTabProps {
	$active?: boolean
}

const StyledLink = styled(Link)<LinkTabProps>`
	text-decoration: none;
	color: ${props => props.theme.primaryColor};
	background-color: ${props => props.theme.bgColor};
	margin: 0.5em;
	padding: 0.5em;
	box-shadow: 2px 0px 2px -2px silver;
	border: 1px solid silver;
	border-bottom: none;
	border-radius: ${props => props.theme.borderRadius} ${props => props.theme.borderRadius} 0 0;
	position: relative;
	z-index: ${props => (props.$active ? 2 : 0)};
`

const LinkTab = ({ children, to }: { children: React.ReactNode; to: string }) => {
	const currentPath = useLocation().pathname
	return (
		<StyledLink $active={currentPath === to} to={to}>
			{children}
		</StyledLink>
	)
}

export default LinkTab

