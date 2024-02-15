import { createGlobalStyle } from 'styled-components'

/**
 * Official colours and fonts from Finnish Transport Infrastructure Agency's
 * graphic instructions: https://vayla.fi/tietoa-meista/medialle/graafinen-ohjeisto
 */

const theme = {
	bgColor: '#fff',
	accentColor: '#000',
	buttonAccentColor: '#fff',
	primaryColor: '#0064af',
	positiveColor: '#207a43',
	negativeColor: '#c73f00',
	primaryFont: "'Exo 2', sans-serif",
	editableFont: "'Tahoma', sans-serif",
	borderRadius: '0.3em',
}

export const GlobalStyle = createGlobalStyle`
  body {
	  margin: 0;
	  padding: 1em;
		background-color: ${props => props.theme.bgColor};
	  font-family: ${props => props.theme.primaryFont};
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
  }

	#root {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
`

export default theme
