const sv = {
	form: {
		title: 'TRANSLATE: Ilmoita kadun rakentamisen aloittamisesta Digiroadiin',
		reporter: 'TRANSLATE: Ilmoittajan nimi',
		email: 'TRANSLATE: Ilmoittajan sähköposti',
		project: 'TRANSLATE: Rakennushankkeen nimi',
		municipality: 'TRANSLATE: Kunta',
		opening_date: 'TRANSLATE: Liikenteelle avaamisajankohta',
		file: 'TRANSLATE: Liitetiedostot',
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
		reporter: {
			required: 'TRANSLATE: Ilmoittajan nimi vaaditaan!',
			max: 'TRANSLATE: Ilmoittajan nimi saa olla enintään 64 merkkiä pitkä!',
		},
		email: {
			required: 'TRANSLATE: Sähköposti vaaditaan!',
			value: 'TRANSLATE: Sähköpostin tulee olla validi!',
		},
		project: {
			required: 'TRANSLATE: Rakennushankkeen nimi vaaditaan!',
			max: 'TRANSLATE: Rakennushankkeen nimi saa olla enintään 64 merkkiä pitkä!',
		},
		municipality: {
			required: 'TRANSLATE: Kunta vaaditaan!',
			max: 'TRANSLATE: Kunta saa olla enintään 32 merkkiä pitkä!',
		},
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
