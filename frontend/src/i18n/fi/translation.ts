const fi = {
	hello: 'Hei käännös!',
	form: {
		title: 'PLACEHOLDER Lomakkeen otsikko',
		reporter: 'Ilmoittajan nimi',
		email: 'Ilmoittajan sähköposti',
		project: 'Rakennushankkeen nimi',
		municipality: 'Kunta',
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
	},
} as const

export default fi
