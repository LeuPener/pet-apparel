import config from "./config";
/**
 * uni.request的封装
 * 使用方式： httpExt.get("admin/login", {}).then(res => {}).catch(err => {})
 * @param {*} url 请求地址
 * @param {*} method 请求类型
 * @param {*} data 请求参数
 */
const request = (url, method, data = {}, headerconfig = {}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.mobeilURL + url,
			method: method || "GET",
			data: data,
			header: {
				"content-type": "application/json",
				Accept: "application/json",
				Authorization: uni.getStorageSync("cxbtoken") ?
					uni.getStorageSync("cxbtoken") : "",
				...headerconfig,
			},
			dataType: "json",
			success(res) {
				if (res.statusCode == 401) {
					uni.clearStorageSync();
					uni.showToast({
						title: "请先登录",
						icon: "none",
					});
				} else if (res.statusCode == 405) {
					uni.clearStorageSync();
					uni.showToast({
						title: "请重新登录",
						icon: "none",
					});
				} else if (res.statusCode == 200) {
					if (res.data.code === 401) {
						uni.clearStorageSync();
						uni.showToast({
							title: "登录过期，请先登录",
							icon: "none",
						});
						uni.$emit('islogin', {
							msg: false
						})
						// reject(res.data);
					}
					resolve(res.data);
				} else {
					reject(res);
					uni.showToast({
						title: "请求发生异常",
						icon: "none",
					});
				}
			},
			fail(error) {
				uni.showToast({
					title: "请求超时，请重试",
					icon: "none",
				});
				reject(error);
			},
		});
	});
};

const get = (url, data = {}) => {
	return request(url, "GET", data);
};
const post = (url, data = {}, headerconfig) => {
	return request(url, "POST", data, headerconfig);
};
export default {
	get,
	post,
	request,
};