import axios from 'axios'

const post = async (url: string, formData: FormData, reCaptchaToken: string, path?: string) => {
	try {
		await axios.post(`${url}/api${path ? `/${path}` : ''}`, formData, {
			headers: {
				'g-recaptcha-response': reCaptchaToken,
			},
		})
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export default { post }
