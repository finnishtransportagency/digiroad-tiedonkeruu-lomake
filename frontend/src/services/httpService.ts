import axios from 'axios'

const post = async (url: string, formData: FormData, reCaptchaToken: string) => {
	try {
		await axios.post(url, formData, {
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
