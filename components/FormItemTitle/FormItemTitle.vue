<template>
	<view class="flex-row justify-between items-center group_4">
		<view class="flex-row items-center">
			<view class="section"></view>
			<text class="font ml-9">{{ text }}</text>
		</view>
		<view class="right">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
export default {
	name: 'FormItemTitle',
	props: {
		text: {
			type: String,
			default: ''
		}
	}
};
</script>

<style lang="scss" scoped>
.ml-9 {
	margin-left: 18rpx;
}

.group_4 {
	padding-bottom: 24rpx;

	.section {
		background-color: #fbd610;
		border-radius: 6rpx;
		width: 8rpx;
		height: 40rpx;
	}

	.font {
		font-size: 32rpx;
		font-family: PingFang SC;
		line-height: 30.02rpx;
		font-weight: 700;
		color: #000000;
	}
}
</style>
