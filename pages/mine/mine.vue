<template>
	<view class="page-content">
		<MyPoints :points="points" :showTobtn="showTobtn"></MyPoints>
		<view class="link-box">
			<u-cell-group :border="false">
				<!-- <u-cell title="我的模版" :border="false" :isLink="true"></u-cell> -->
				<u-cell title="联系客服" :border="false" :isLink="true" @click="handleLinkTo('/pages/mine/contact/contact')"></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import MyPoints from '@/components/MyPoints/MyPoints.vue';

export default {
	components: {
		MyPoints
	},
	data() {
		return {
			points: 100,
			showTobtn: true
		};
	},
	methods: {
		handleLinkTo(url) {
			uni.navigateTo({
				url
			});
		}
	}
};
</script>

<style lang="scss">
.page-content {
	height: 100%;
	width: 100%;
	padding: 30rpx;
}
.link-box {
	background-color: #fff;
	margin-top: 20rpx;
	border-radius: 16rpx;
}
</style>
