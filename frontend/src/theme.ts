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
	editableFontFamily: "'Tahoma', sans-serif",
}

export const GlobalStyle = createGlobalStyle`
  body {
	  margin: 0;
	  padding: 1em;
		background-color: ${props => props.theme.bgColor};
	  font-family: 'Exo 2', sans-serif;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
  }
`

export default theme
