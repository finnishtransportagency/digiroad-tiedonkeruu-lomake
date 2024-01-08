const fi = {
	form: {
		title: 'Ilmoita kadun rakentamisen aloittamisesta Digiroadiin',
		reporter: 'Ilmoittajan nimi',
		email: 'Ilmoittajan sähköposti',
		project: 'Rakennushankkeen nimi',
		municipality: 'Kunta',
		opening_date: 'Liikenteelle avaamisajankohta',
		file: 'Liitetiedosto',
		description: 'Lisätietoja',
		reset: 'Tyhjennä lomake',
		reset_confirm: 'Haluatko varmasti tyhjentää lomakkeen?',
		submit: 'Lähetä',
		submitting: 'Lähetetään...',
		submit_success: 'Lomake lähetetty onnistuneesti!',
	},
	tooltips: {
		file: 'Liitetiedosto voi olla muotoa .pdf, .dwg, .dxf tai .dgn. Tiedostojen yhteiskoko saa olla enintään 5,9MB',
	},
	errors: {
		reporter: 'Ilmoittajan nimi vaaditaan!',
		email: {
			required: 'Sähköposti vaaditaan!',
			value: 'Sähköpostin tulee olla validi!',
		},
		project: 'Rakennushankkeen nimi vaaditaan!',
		municipality: 'Kunta vaaditaan!',
		opening_date: {
			required: 'Avaamisajankohta vaaditaan!',
			value: 'Päivämäärän tulee olla muotoa dd.mm.yyyy',
			min: 'Avaamisajankohdan tulee olla tulevaisuudessa!',
		},
		files: {
			size: 'Liitetiedostojen yhteiskoko saa olla enintään 5,9MB!',
			type: 'Sallittuja tiedostomuotoja ovat: .pdf, .dwg, .dxf ja .dgn',
		},
		submit: 'Lomakkeen lähetys epäonnistui!',
	},
	links: {
		suravage: {
			description: 'SURAVAGE-pääohje',
			link: 'https://vayla.fi/vaylista/aineistot/digiroad/yllapito/suunniteltu-rakennusvaiheen-geometria/suravage-paaohje',
		},
		yllapito: {
			description: 'Ylläpito-ohje kunnille',
			link: 'https://vayla.fi/vaylista/aineistot/digiroad/yllapito/yllapito-ohje-kunnille',
		},
		drsovellus: {
			description: 'Digiroad-sovellus',
			link: 'https://digiroad.vaylapilvi.fi/',
		},
	},
} as const

export default fi
