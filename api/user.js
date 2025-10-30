import request from "../utils/request"
export default {
	/**
	 * @param {Object} code 登录code
	 */
	getLoginCode(code) {
		return request.get(`/pet/getOpenid/${code}`);
	},

	login(data) {
		return request.post('/pet/login_by_weixin', data);
	},
}