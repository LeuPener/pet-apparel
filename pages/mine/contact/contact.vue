<template>
	<view class="page-content">
		<view class="qr">
			<image style="width: 300rpx; height: 300rpx" src="/uni_modules/helang-waterfall/static/waterfall/0.jpg"></image>
		</view>
		<view class="text_1">
			<text>扫一扫，联系客服</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss">
.page-content {
	width: 100%;
	height: 100%;
	padding: 30rpx;
	background-color: #fff;
}
.qr {
	// 水平居中
	display: flex;
	justify-content: center;
	align-items: center;
}
.text_1 {
	margin: 48rpx 48rpx 0;
	color: #000000;
	font-size: 28rpx;
	line-height: 48rpx;
}
</style>
