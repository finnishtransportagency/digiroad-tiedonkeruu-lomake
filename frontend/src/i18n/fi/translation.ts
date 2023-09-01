const fi = {
	hello: 'Hei käännös!',
	form: {
		title: 'PLACEHOLDER Lomakkeen otsikko',
		reporter: 'Ilmoittajan nimi',
		email: 'Ilmoittajan sähköposti',
		project: 'Rakennushankkeen nimi',
		municipality: 'Kunta',
		opening_date: 'Liikenteelle avaamisajankohta',
		reset: 'Tyhjennä lomake',
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
			value: 'Päivämäärän tulee olla muotoa dd/mm/yyyy',
			min: 'Avaamisajankohdan tulee olla tulevaisuudessa!',
		},
	},
} as const

export default fi
