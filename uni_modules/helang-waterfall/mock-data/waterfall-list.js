let list = (page) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// 生成随机数方法
			let random = (min = 0, max) => {
				return Math.floor(Math.random() * max) + min;
			}
			// 待选的图片数据
			let imgs = [];
			// 待选的标题数据
			let titles = [
				'生日祝福创意相框',
				'节日贺卡一键生成',
				'情侣合照趣味贴纸',
				'旅行打卡专属水印',
				'美食拍照精致边框',
				'宝宝成长记录模板',
				'毕业纪念创意拼图',
				'婚礼请柬个性设计',
				'职场证件照美化',
				'朋友圈九宫格神器',
				'短视频热门特效',
			];

			let res = [];
			let t = `?t=${new Date().getTime()}`;
			for (let i = 0; i < 6; i++) {
				res.push({
					id: `${Date.now()}_${i+1}`,
					imgUrl: `/uni_modules/helang-waterfall/static/waterfall/${random(0,3)}.jpg`,
					title: titles[random(0, titles.length)],
					money: random(9, 9999),
					label: '官方自营',
					shop: '唐诗三百首旗舰店'
				})
			}
			resolve(res);
		}, 1000);
	})
}

export default {
	getList: list
}