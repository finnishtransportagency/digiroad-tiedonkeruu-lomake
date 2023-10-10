const sv = {
	hello: 'Hej översättning!',
	form: {
		title: 'PLACEHOLDER Lomakkeen otsikko',
		reporter: 'TRANSLATE: Ilmoittajan nimi',
		email: 'TRANSLATE: Ilmoittajan sähköposti',
		project: 'TRANSLATE: Rakennushankkeen nimi',
		municipality: 'TRANSLATE: Kunta',
		opening_date: 'TRANSLATE: Liikenteelle avaamisajankohta',
		file: 'TRANSLATE: Liitetiedosto',
		reset: 'TRANSLATE: Tyhjennä lomake',
		submit: 'TRANSLATE: Lähetä',
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
			value: 'TRANSLATE: Päivämäärän tulee olla muotoa dd/mm/yyyy',
			min: 'TRANSLATE: Avaamisajankohdan tulee olla tulevaisuudessa!',
		},
		file: {
			size: 'TRANSLATE: Liitetiedoston koko saa olla enintään 39MB!',
			type: 'TRANSLATE: Sallittuja tiedostomuotoja ovat: .pdf, .dwg, .dxf ja .dgn',
		},
	},
} as const

export default sv
