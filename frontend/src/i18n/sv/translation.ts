const sv = {
	tabs: {
		construction: 'PLACEHOLDER: Rakentamisen aloitus',
		opening: 'PLACEHOLDER: Liikenteelle avaus',
	},
	form: {
		constructionTitle: 'Anmäl start av gatubyggnation till Digiroad',
		openingTitle: 'Anmäl öppnandet av gatan för trafik till Digiroad',
		reporter: 'Anmälarens namn',
		email: 'Anmälarens e-post',
		project: 'Namn på byggprojektet',
		municipality: 'Kommun',
		opening_date: 'Öppettid för trafik',
		file: 'Bilagor',
		description: 'Mer information',
		reset: 'Töm formuläret',
		reset_confirm: 'Är du säker på att du vill rensa formuläret?',
		submit: 'Skicka',
		submitting_attachment: 'Sändning bilagor',
		submitting: 'Sändning...',
		submit_success: 'Formuläret har skickats!',
	},
	tooltips: {
		file: 'Den bifogade filen kan vara i .pdf-, .dwg-, .dxf-, .dgn- eller .gpkg-format. Den totala storleken på filerna får inte överstiga 35MB. Lägg till alla bilagor på en gång!',
	},
	errors: {
		attachment: 'Det gick inte att skicka in bilagorna',
		reporter: {
			required: 'Anmälarens namn krävs!',
			max: 'Namnet på uppgiftslämnaren får inte vara mer än 64 tecken långt!',
		},
		email: {
			required: 'E-post krävs!',
			value: 'E-postmeddelandet måste vara giltigt!',
			max: 'E-postadressen får inte vara mer än 320 tecken lång!',
		},
		project: {
			required: 'Namnet på byggprojektet krävs!',
			max: 'Namnet på byggprojektet får inte vara mer än 64 tecken långt!',
		},
		municipality: {
			required: 'Kommun krävs!',
			max: 'Kommunen får inte vara mer än 32 tecken lång!',
		},
		opening_date: {
			required: 'Öppettid krävs!',
			value: 'Datumet måste vara i formatet dd.mm.åååå',
			min: 'Öppningsdatumet måste ligga i framtiden!',
		},
		files: {
			size: 'Den totala storleken på bifogade filer får inte överstiga 35MB!',
			type: 'Tillåtna filformat är: .pdf, .dwg, .dxf och .dgn',
		},
		submit: 'Det gick inte att skicka in formuläret!',
	},
	links: {
		suravage: {
			description: 'SURAVAGE-instruktioner',
			link: 'https://vayla.fi/sv/trafikleder/material/digiroad/underhall/planerad-geometri-for-byggskedet/underhalla-vag-och-gatunatets-mittlinjematerial-i-finland-anvisning-',
		},
		yllapito: {
			description: 'Underhållsinstruktioner till kommuner',
			link: 'https://vayla.fi/sv/trafikleder/material/digiroad/underhall/underhallsinstruktioner-till-kommuner',
		},
		drsovellus: {
			description: 'Digiroad app',
			link: 'https://digiroad.vaylapilvi.fi/',
		},
	},
} as const

export default sv
