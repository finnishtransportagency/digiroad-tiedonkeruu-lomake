import { FormValues } from '../schema'
import axios from 'axios'

const post = async (url: string, data: FormValues | string) => {
	try {
		return await axios.post(`${url}/postData`, data)
	} catch (error) {
		console.log(error)
		return 'Error Occured'
	}
}

export default { post }

