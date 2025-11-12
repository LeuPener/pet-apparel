<template>
	<view class="flex-row justify-between items-center section_5">
		<view class="flex-col">
			<view class="flex-row items-center">
				<image class="image_8" src="/static/images/common/sun.png" />
				<text class="text_4">我的积分</text>
			</view>
			<view class="flex-row items-center">
				<text class="ml-10 text_3">{{ points }}</text>
			</view>
		</view>
		<view class="flex-row items-center button" v-if="showTobtn" @click="handleToGongLue">
			<text class="text_2">获取积分</text>
			<u-icon name="arrow-right" color="#00000" size="30rpx"></u-icon>
		</view>
	</view>
</template>

<script>
export default {
	name: 'MyPoints',
	props: {
		points: {
			type: Number,
			default: 0
		},
		showTobtn: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	methods: {
		handleToGongLue() {
			uni.navigateTo({
				url: '/pages/mine/buyPoints/buyPoints'
			});
		}
	}
};
</script>

<style lang="scss">
.ml-10 {
	margin-left: 10rpx;
}

.section_5 {
	padding: 36rpx 32rpx;
	background-color: #f8e14f;
	border-radius: 16rpx;

	.image_7 {
		width: 10rpx;
		height: 18rpx;
	}

	.image_8 {
		width: 40rpx;
		height: 42rpx;
	}

	.text_3 {
		color: #000000;
		font-size: 80rpx;
	}
	.text_4 {
		font-weight: normal;
		font-size: 24rpx;
		margin-left: 6rpx;
		color: #666;
	}
	.button {
		background-color: #ffffff;
		border-radius: 8rpx;
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 20rpx;
		text-align: center;

		.font_2 {
			font-size: 24rpx;
			font-weight: 700;
			color: #000000;
		}

		.text_2 {
			font-size: 30rpx;
			font-weight: unset;
		}
	}
}
</style>
