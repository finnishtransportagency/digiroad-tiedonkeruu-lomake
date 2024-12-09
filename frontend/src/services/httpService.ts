import axios from 'axios'

const post = async (url: string, formData: FormData, headers: { [k: string]: string } = {}) => {
	try {
		const response = await axios.post(url, formData, { headers })
		return { success: true, response } as const
	} catch (error) {
		console.error(error)
		return { success: false, response: undefined } as const
	}
}

export default { post }
