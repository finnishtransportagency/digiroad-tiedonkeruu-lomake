const fi = {
	hello: 'Hei käännös!',
	form: {
		title: 'DIGIROAD, Ilmoita kadun rakentamisen aloittamisesta',
		reporter: 'Ilmoittajan nimi',
		email: 'Ilmoittajan sähköposti',
		project: 'Rakennushankkeen nimi',
		municipality: 'Kunta',
		opening_date: 'Liikenteelle avaamisajankohta',
		file: 'Liitetiedosto (.pdf, .dwg, .dxf, .dgn)',
		reset: 'Tyhjennä lomake',
		reset_confirm: 'Haluatko varmasti tyhjentää lomakkeen?',
		submit: 'Lähetä',
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
		file: {
			size: 'Liitetiedoston koko saa olla enintään 5MB!',
			type: 'Sallittuja tiedostomuotoja ovat: .pdf, .dwg, .dxf ja .dgn',
		},
	},
} as const

export default fi
