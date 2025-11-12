import request from "../utils/request"
export default {
	getTemplateList(data) {
		return request.get('/api/Template/getTemplateList', data);
	},
}