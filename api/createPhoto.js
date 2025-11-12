import request from "../utils/request"
export default {
	getTemplateDetail(data) {
		return request.get('/api/Template/getTemplateDetail', data);
	},
}