<template>
	<view class="l-upload">
		<view class="upload-box">
			<view class="image-item" :style="{ width: width + 'rpx', height: height + 'rpx', 'margin-right': marginRight + 'rpx' }" v-for="(item, index) in fileList" :key="index">
				<block v-if="item.split('.')[1] == 'mp4'">
					<video :src="item" class="img" :style="{ width: width + 'rpx', height: height + 'rpx' }"></video>
					<view class="img-del" @tap.stop="delVideo(index)"></view>
				</block>
				<block v-else>
					<image :src="item" class="img" :style="{ width: width + 'rpx', height: height + 'rpx' }" @tap.stop="previewImage(index)" mode="aspectFill"></image>
					<view class="img-del" @tap.stop="delImage(index)"></view>
				</block>
			</view>
			<view v-if="isShowAdd" class="upload-add" :style="{ width: width + 'rpx', height: height + 'rpx' }" @tap="chooseFile">
				<view class="upload-icon flex-col items-center">
					<view>
						<image style="width: 120rpx; height: 120rpx" src="/static/images/common/camera.png" />
					</view>
					<view v-if="title">
						<text style="color: #000">{{ title }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'lUpload',
	props: {
		//标题
		title: {
			type: [Number, String],
			default: ''
		},
		//图片宽度
		width: {
			type: [Number, String],
			default: 220
		},
		//图片高度
		height: {
			type: [Number, String],
			default: 220
		},
		// 上传类型 图片img/视频video  默认都可以
		uploadType: {
			type: String,
			default: 'all'
		},
		//禁用添加
		disableAdd: {
			type: Boolean,
			default: false
		},
		//限制数
		limit: {
			type: Number,
			default: 9
		},
		//original 原图，compressed 压缩图，默认二者都有
		sizeType: {
			type: Array,
			default() {
				return ['original', 'compressed'];
			}
		},
		//album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
		sourceType: {
			type: Array,
			default() {
				return ['album', 'camera'];
			}
		},
		//可上传图片类型，默认为空，不限制  Array<String> ['jpg','png','gif']
		imageFormat: {
			type: Array,
			default() {
				return [];
			}
		},
		//图片路径
		images: {
			type: Array,
			default() {
				return [];
			}
		},
		//视频路径
		videos: {
			type: Array,
			default() {
				return [];
			}
		},
		//服务器接口地址。当接口地址为空时，直接返回本地图片地址
		serverUrl: {
			type: String,
			default: ''
		},
		//文件对应的key，默认为 file
		fileKeyName: {
			type: String,
			default: 'file'
		},
		//HTTP 请求 Header, header 中不能设置 Referer。
		header: {
			type: Object,
			default() {
				return {};
			}
		},
		//HTTP 请求中其他额外的 form data
		formData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	watch: {
		images: function (newvalue, oldvalue) {
			this.imageList = [...newvalue];
			this.fileList = [...this.videos, ...newvalue];
		},
		videos: function (newvalue, oldvalue) {
			this.videoList = [...newvalue];
			this.fileList = [...this.images, ...newvalue];
		}
	},
	data() {
		return {
			//图片地址
			imageList: [...this.images],
			//图片地址
			videoList: [...this.videos],
			fileList: [...this.videos, ...this.images],
			marginRight: 20,

			lineNum: 0,
			videoContext: null
		};
	},
	computed: {
		isShowAdd() {
			let isShow = true;
			if (this.disableAdd || (this.limit && this.imageList.length + this.videoList >= this.limit)) {
				isShow = false;
			}
			return isShow;
		}
	},
	created() {
		console.log(this.images);
		// this.initBoxData()
	},
	methods: {
		change() {
			console.log('111', this.imageList);
			this.fileList = [...this.videoList, ...this.imageList];
			this.$emit('complete', {
				imageArr: [...this.imageList],
				videoArr: [...this.videoList]
			});
		},

		// initBoxData() {
		// 	const query = uni.createSelectorQuery().in(this);
		// 	query.select('.upload-box').fields({
		// 		rect: true, //返回节点布局位置
		// 		size: true //返回节点尺寸
		// 	}, res => {
		// 		let imgwidth = Math.floor(this.width / 2)
		// 		this.lineNum = Math.floor(res.width / imgwidth)
		// 		// this.marginRight = (res.width - this.lineNum * imgwidth) / (this.lineNum - 1)
		// 	});
		// 	query.exec(); //执行
		// },
		toast(text) {
			text &&
				uni.showToast({
					title: text,
					icon: 'none'
				});
		},

		chooseFile() {
			if (this.uploadType == 'img') {
				this.chooseImage();
			} else if (this.uploadType == 'video') {
				this.chooseVideo();
			} else {
				uni.showActionSheet({
					itemList: ['图片', '视频'],
					success: (res) => {
						if (res.tapIndex + 1 == 1) {
							this.chooseImage();
						} else {
							this.chooseVideo();
						}
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				});
			}
		},

		chooseVideo() {
			uni.chooseVideo({
				sizeType: this.sizeType,
				camera: 'back', //默认摄像头是后置摄像头
				success: (e) => {
					this.videoList.push(e.tempFilePath);
					//服务器地址
					if (this.serverUrl) {
						this.uploadImage(null, e.tempFilePath, 'video')
							.then(() => {
								this.change();
							})
							.catch(() => {
								this.change();
							});
					} else {
						//无服务器地址则直接返回成功
						this.change();
					}
				}
			});
		},

		chooseImage() {
			uni.chooseImage({
				count: this.limit - this.imageList.length - this.videoList.length,
				sizeType: this.sizeType,
				sourceType: this.sourceType,
				success: (e) => {
					console.log('e', e);
					let imageArr = [];
					for (let i = 0; i < e.tempFiles.length; i++) {
						let len = this.imageList.length + this.videoList.length;
						if (len >= this.limit) {
							this.toast(`最多可上传${this.limit}张图片/视频`);
							break;
						}
						//过滤图片类型
						let path = e.tempFiles[i].path;

						if (this.imageFormat.length > 0) {
							let format = '';
							// #ifdef H5
							let type = e.tempFiles[i].type;
							format = type.split('/')[1];
							// #endif

							// #ifndef H5
							format = path.split('.')[path.split('.').length - 1];
							// #endif

							if (this.imageFormat.indexOf(format) == -1) {
								let text = `只能上传 ${this.imageFormat.join(',')} 格式图片！`;
								this.toast(text);
								continue;
							}
						}

						imageArr.push(path);
						this.imageList.push(path);
					}

					let start = this.imageList.length - imageArr.length;
					for (let j = 0; j < imageArr.length; j++) {
						let index = start + j;
						console.log(index, imageArr[j]);
						//服务器地址
						if (this.serverUrl) {
							this.uploadImage(index, imageArr[j], 'image')
								.then((res) => {
									this.change();
								})
								.catch(() => {
									this.change();
								});
						} else {
							//无服务器地址则直接返回成功
							this.change();
						}
					}
				}
			});
		},
		uploadImage(index, url, type) {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: this.serverUrl,
					name: this.fileKeyName,
					header: this.header,
					formData: this.formData,
					filePath: url,
					success: (res) => {
						if (res.statusCode == 200) {
							//返回结果 此处需要按接口实际返回进行修改
							let data = JSON.parse(res.data.replace(/\ufeff/g, '') || '{}');
							console.log('res', data);
							if (data.code === 200) {
								if (type === 'image') {
									//图片 -此处无需修改
									this.imageList.push(data.accessPath); //根据实际情况修改-（this.imageList不能改）
								} else if (type === 'video') {
									//视频 -此处无需修改
									this.videoList.push(data.accessPath); //根据实际情况修改-（this.videoList不能改）
								}
							} else {
								// 上传失败
							}
							resolve();
						} else {
							reject(res.msg);
						}
					},
					fail: function (res) {
						reject(res);
					}
				});
			});
		},
		delVideo(index) {
			uni.showModal({
				title: '提示',
				content: '确认删除该视频吗？',
				success: (res) => {
					if (res.confirm) {
						this.videoList.splice(index, 1);
						this.$emit('remove', {
							index: index,
							type: 'video'
						});
						this.change();
					}
				}
			});
		},
		delImage(index) {
			uni.showModal({
				title: '提示',
				content: '确认删除该图片吗？',
				success: (res) => {
					if (res.confirm) {
						this.imageList.splice(index, 1);
						this.$emit('remove', {
							index: index,
							type: 'image'
						});
						this.change();
					}
				}
			});
		},
		previewImage(index) {
			if (!this.imageList.length) return;
			uni.previewImage({
				current: this.imageList[index],
				loop: true,
				urls: this.imageList
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.upload-icon {
	font-style: 28rpx;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	padding: 10rpx;
}

// .icon-tianjia:before {
// 	content: "+";
// }

.l-upload {
	width: 100%;

	.upload-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;

		.image-item {
			position: relative;
			margin-bottom: var(--margin-right);

			.img {
				display: block;
				background-color: #f6f6f6;
				border-radius: 16rpx;
				overflow: hidden;
			}

			.img-del {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				right: -12rpx;
				top: -12rpx;
				background-color: #ff205c;
				border-radius: 50%;
				color: white;
				font-size: 34rpx;
				z-index: 200;

				&::before {
					content: '';
					width: 16rpx;
					height: 1px;
					position: absolute;
					left: 10rpx;
					top: 18rpx;
					background-color: #fff;
				}
			}
		}

		.upload-add {
			color: #999;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
		}
	}
}
</style>
