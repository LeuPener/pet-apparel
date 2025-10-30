<template>
	<view class="page-content">
		<view class="card-warp">
			<view class="title-box">
				<view class="sub-cards-h">
					<text>宠物趣味照模版</text>
				</view>
				<!-- <view class="sub-cards-title">
					<text>宠物写真、动漫风格、表情包...等你来玩</text>
				</view> -->
			</view>
			<WaterfallFlow :isReachBottom="isReachBottom" :isPullRefresh="isPullRefresh" @reset-status="resetStatus" />
		</view>
		<LoginPopup :show="showLogin" @handleClose="handleClose" @onSuccess="handleSuccess" />
	</view>
</template>

<script>
import WaterfallFlow from '@/components/WaterfallFlow/WaterfallFlow.vue';
import LoginPopup from '@/components/Login/LoginPopup.vue';

export default {
	components: {
		LoginPopup,
		WaterfallFlow
	},
	data() {
		return {
			showLogin: false,
			isReachBottom: false,
			isPullRefresh: false
		};
	},
	onLoad() {
		uni.$on('islogin', (data) => {
			console.log('data', data);
			this.showLogin = !data.msg;
		});
	},
	onShow() {
		if (!uni.getStorageSync('userinfo')) {
			this.showLogin = true;
		}
	},
	onHide() {
		this.showLogin = false;
	},
	onReachBottom() {
		this.isReachBottom = true;
	},
	onPullDownRefresh() {
		this.isPullRefresh = true;
	},
	methods: {
		handleSuccess() {},
		handleClose() {
			this.showLogin = false;
		},
		// 重置状态
		resetStatus() {
			// 重置状态
			this.isReachBottom = false;
			this.isPullRefresh = false;
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss" scoped>
.page-content {
	height: 100%;
	background: linear-gradient(to bottom, #fcd71d, #fff0b8);
	position: relative;
	padding: 30rpx 0;
}
.card-warp {
	min-height: 100%;
	position: relative;
	padding: 30rpx 0;
	background: linear-gradient(to bottom, #fcd71d, #fff0b8);
}
.title-box {
	padding: 0 30rpx;

	.sub-cards-h {
		font-size: 32rpx;
		font-weight: bold;
		position: relative;
		z-index: 1;
	}

	.sub-cards-title {
		padding: 10rpx 0 20rpx 0;
		color: #666;
		position: relative;
		z-index: 1;
	}
}
</style>
