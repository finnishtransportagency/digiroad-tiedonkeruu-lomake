import axios from 'axios'

const post = async (url: string, formData: FormData) => {
	try {
		await axios.post(`${url}/postData`, formData)
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export default { post }

