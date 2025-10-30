<template>
	<view class="page-content">
		<MyPoints :points="points" :showTobtn="showTobtn"></MyPoints>
		<view class="grid-container">
			<view v-for="(item, index) in gridList" :key="index" class="grid-item" @click="handleItemClick(item)">
				<view class="item-content">
					<view class="item-info">
						<text class="item-title">{{ item.num }} 积分</text>
						<text class="item-desc">
							<text class="unit">￥</text>
							{{ item.price }}
						</text>
					</view>
				</view>
			</view>
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
			gridList: [
				{
					num: 100,
					price: 9.9
				},
				{
					num: 500,
					price: 48
				},
				{
					num: 1000,
					price: 90
				}
			]
		};
	},
	methods: {
		handleItemClick(item) {
			uni.showToast({
				title: `${item.price}`,
				icon: 'none'
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
.grid-container {
	margin-top: 30rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	justify-content: space-between;
	box-sizing: border-box;
}

.grid-item {
	flex: 0 0 calc(50% - 10rpx);
	background: #ffffff;
	padding: 30rpx;
	margin-bottom: 10rpx;
	border-radius: 16rpx;
	transition: all 0.3s ease;
	box-sizing: border-box;

	&:active {
		transform: scale(0.96);
		background: #f0f0f0;
	}
}

.item-content {
	flex: 1;
}
.icon-text {
	font-size: 36rpx;
}

.item-info {
	height: 140rpx;
	display: flex;
	flex-direction: column;
}

.item-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
}

.item-desc {
	font-size: 32rpx;
	font-weight: 600;
	color: #ff7676;
	line-height: 1.4;
	margin-top: auto;
	text-align: right;
	.unit {
		font-size: 24rpx;
	}
}
</style>
