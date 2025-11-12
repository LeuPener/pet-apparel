<template>
	<view class="page-content">
		<MyPoints :points="points" :showTobtn="showTobtn"></MyPoints>
		<TemplateDetail :list="receivedData"></TemplateDetail>
		<view class="upload pd-box">
			<l-upload
				width="500"
				height="450"
				@complete="successPhoto"
				@remove="removePhoto"
				limit="1"
				title="点击上传宠物照片"
				:images="formdata.photo"
				:header="header"
				:serverUrl="action"
				uploadType="img"
			></l-upload>
		</view>
		<view class="pd-box">
			<view class="size-selector">
				<form-item-title text="选择尺寸" />
				<view class="size-list">
					<view v-for="(item, index) in sizeList" :key="index" class="size-item" :class="{ active: selectedSize === item.value }" @click="handleSizeSelect(item.value)">
						<view class="size-box">
							<view class="size-des">
								<view class="size-model" :style="{ width: item.width, height: item.height }"></view>
								<view class="size-text">
									<text>{{ item.label }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="creat-btn">
					<view class="text-1">
						<u-icon name="info-circle" color="#99999" size="28rpx"></u-icon>
						<text class="ml-2" style="font-size: 24rpx; color: #999">生成照片预计2-8分钟，可以在记录中查看</text>
					</view>
					<u-button
						text="立即生成"
						size="large"
						:custom-style="{
							color: '#000000'
						}"
						color="#ffdd02"
					></u-button>
				</view>
			</view>
		</view>
		<u-gap height="30rpx"></u-gap>
	</view>
</template>

<script>
import createPhoto from '@/api/createPhoto.js';
import lUpload from '@/components/l-upload/l-upload.vue';
import MyPoints from '@/components/MyPoints/MyPoints.vue';
import FormItemTitle from '@/components/FormItemTitle/FormItemTitle.vue';
import TemplateDetail from '@/components/TemplateDetail/TemplateDetail.vue';

export default {
	components: {
		lUpload,
		MyPoints,
		TemplateDetail,
		FormItemTitle
	},
	data() {
		return {
			receivedId: '',
			receivedData: {},
			points: 100,
			showTobtn: true,
			action: '/common/uploadFile',
			header: {
				'content-type': 'multipart/form-data',
				Authorization: ''
			},
			formdata: {
				photo: []
			},
			selectedSize: '1:1', // 默认选中的尺寸
			sizeList: [
				{
					label: '1:1',
					value: '1:1',
					width: '80rpx',
					height: '80rpx'
				},
				{
					label: '2:3',
					value: '2:3',
					width: '70rpx',
					height: '120rpx'
				},
				{
					label: '3:2',
					value: '3:2',
					width: '120rpx',
					height: '70rpx'
				}
			]
		};
	},
	onLoad(options) {
		this.fetchDetail(options);
	},
	methods: {
		fetchDetail({ id }) {
			this.receivedId = id;
			createPhoto
				.getTemplateDetail({ id })
				.then((res) => {
					this.receivedData = res.data;
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		successPhoto(data) {
			console.log(data);
			this.formdata.photo = data.imageArr;
		},
		removePhoto(index) {
			this.formdata.photo.splice(index, 1);
		},
		// 处理尺寸选择
		handleSizeSelect(size) {
			this.selectedSize = size;
			console.log('选中的尺寸:', size);

			// 可以在这里触发其他操作，比如重新生成图片等
			uni.showToast({
				title: `已选择${size}尺寸`,
				icon: 'none'
			});
		}
	}
};
</script>

<style lang="scss">
.page-content {
	width: 100%;
	height: 100%;
	padding: 30rpx;
}
.pd-box {
	margin-top: 30rpx;
	padding: 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
}
.upload {
	display: flex;
	justify-content: center;
	align-items: center;
}
.selector-title {
	display: block;
	font-size: 32rpx;
	color: #333;
	margin-bottom: 40rpx;
}

.size-list {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.size-item {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10rpx;
}

.size-box {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 2rpx solid #dee2e6;
	border-radius: 16rpx;
	transition: all 0.3s ease;
	height: 200rpx;

	.size-item.active & {
		background: #fffef8;
		border-color: #ffd700;
	}

	.size-model {
		border: 4rpx solid #333;
	}
}

.size-text {
	text-align: center;
	margin-top: 10rpx;
	font-size: 28rpx;
	font-weight: 600;
	color: #666;
}

.creat-btn {
	margin-top: 50rpx;
	.text-1 {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
}
</style>
