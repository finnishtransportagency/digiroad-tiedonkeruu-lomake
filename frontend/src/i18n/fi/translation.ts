const fi = {
	form: {
		title: 'Ilmoita kadun rakentamisen aloittamisesta Digiroadiin',
		reporter: 'Ilmoittajan nimi',
		email: 'Ilmoittajan sähköposti',
		project: 'Rakennushankkeen nimi',
		municipality: 'Kunta',
		opening_date: 'Liikenteelle avaamisajankohta',
		file: 'Liitetiedostot',
		description: 'Lisätietoja',
		reset: 'Tyhjennä lomake',
		reset_confirm: 'Haluatko varmasti tyhjentää lomakkeen?',
		submit: 'Lähetä',
		submitting: 'Lähetetään...',
		submit_success: 'Lomake lähetetty onnistuneesti!',
	},
	tooltips: {
		file: 'Liitetiedosto voi olla muotoa .pdf, .dwg, .dxf tai .dgn. Tiedostojen yhteiskoko saa olla enintään 4MB',
	},
	errors: {
		reporter: {
			required: 'Ilmoittajan nimi vaaditaan!',
			max: 'Ilmoittajan nimi saa olla enintään 64 merkkiä pitkä!',
		},
		email: {
			required: 'Sähköposti vaaditaan!',
			value: 'Sähköpostin tulee olla validi!',
			max: 'Sähköpostiosoite saa olla enintään 320 merkkiä pitkä!',
		},
		project: {
			required: 'Rakennushankkeen nimi vaaditaan!',
			max: 'Rakennushankkeen nimi saa olla enintään 64 merkkiä pitkä!',
		},
		municipality: {
			required: 'Kunta vaaditaan!',
			max: 'Kunta saa olla enintään 32 merkkiä pitkä!',
		},
		opening_date: {
			required: 'Avaamisajankohta vaaditaan!',
			value: 'Päivämäärän tulee olla muotoa dd.mm.yyyy',
			min: 'Avaamisajankohdan tulee olla tulevaisuudessa!',
		},
		files: {
			size: 'Liitetiedostojen yhteiskoko saa olla enintään 4MB!',
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
