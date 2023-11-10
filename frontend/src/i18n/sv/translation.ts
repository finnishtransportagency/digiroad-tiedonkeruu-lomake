const sv = {
	form: {
		title: 'TRANSLATE: DIGIROAD, Ilmoita kadun rakentamisen aloittamisesta',
		reporter: 'TRANSLATE: Ilmoittajan nimi',
		email: 'TRANSLATE: Ilmoittajan sähköposti',
		project: 'TRANSLATE: Rakennushankkeen nimi',
		municipality: 'TRANSLATE: Kunta',
		opening_date: 'TRANSLATE: Liikenteelle avaamisajankohta',
		file: 'TRANSLATE: Liitetiedosto (.pdf, .dwg, .dxf, .dgn)',
		description: 'TRANSLATE: Lisätietoja',
		reset: 'TRANSLATE: Tyhjennä lomake',
		reset_confirm: 'TRANSLATE: Haluatko varmasti tyhjentää lomakkeen?',
		submit: 'TRANSLATE: Lähetä',
		submitting: 'TRANSLATE: Lähetetään...',
		submit_success: 'TRANSLATE: Lomake lähetetty onnistuneesti!',
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
			size: 'TRANSLATE: Liitetiedostojen yhteiskoko saa olla enintään 5,9MB!',
			type: 'TRANSLATE: Sallittuja tiedostomuotoja ovat: .pdf, .dwg, .dxf ja .dgn',
		},
		submit: 'TRANSLATE: Lomakkeen lähetys epäonnistui!',
	},
} as const

export default sv
