const sv = {
	form: {
		title: 'TRANSLATE: Ilmoita kadun rakentamisen aloittamisesta Digiroadiin',
		reporter: 'TRANSLATE: Ilmoittajan nimi',
		email: 'TRANSLATE: Ilmoittajan sähköposti',
		project: 'TRANSLATE: Rakennushankkeen nimi',
		municipality: 'TRANSLATE: Kunta',
		opening_date: 'TRANSLATE: Liikenteelle avaamisajankohta',
		file: 'TRANSLATE: Liitetiedosto',
		description: 'TRANSLATE: Lisätietoja',
		reset: 'TRANSLATE: Tyhjennä lomake',
		reset_confirm: 'TRANSLATE: Haluatko varmasti tyhjentää lomakkeen?',
		submit: 'TRANSLATE: Lähetä',
		submitting: 'TRANSLATE: Lähetetään...',
		submit_success: 'TRANSLATE: Lomake lähetetty onnistuneesti!',
	},
	tooltips: {
		file: 'TRANSLATE: Liitetiedosto voi olla muotoa .pdf, .dwg, .dxf tai .dgn. Tiedostojen yhteiskoko saa olla enintään 4MB',
	},
	errors: {
		reporter: 'TRANSLATE: Ilmoittajan nimi vaaditaan!',
		email: {
			required: 'TRANSLATE: Sähköposti vaaditaan!',
			value: 'TRANSLATE: Sähköpostin tulee olla validi!',
		},
		project: 'TRANSLATE: Rakennushankkeen nimi vaaditaan!',
		municipality: 'TRANSLATE: Kunta vaaditaan!',
		opening_date: {
			required: 'TRANSLATE: Avaamisajankohta vaaditaan!',
			value: 'TRANSLATE: Päivämäärän tulee olla muotoa dd.mm.yyyy',
			min: 'TRANSLATE: Avaamisajankohdan tulee olla tulevaisuudessa!',
		},
		files: {
			size: 'TRANSLATE: Liitetiedostojen yhteiskoko saa olla enintään 4MB!',
			type: 'TRANSLATE: Sallittuja tiedostomuotoja ovat: .pdf, .dwg, .dxf ja .dgn',
		},
		submit: 'TRANSLATE: Lomakkeen lähetys epäonnistui!',
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
