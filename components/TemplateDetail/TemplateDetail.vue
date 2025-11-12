<template>
	<view class="container">
		<view class="item">
			<view class="left">
				<image class="image" :src="subList.preview_image" mode="aspectFill"></image>
				<view v-if="!subList.is_unlocked" class="lock-tag">{{ subList.status_text }}</view>
			</view>

			<view class="middle">
				<text class="name">{{ subList.name }}</text>
				<text class="desc">{{ subList.description }}</text>
				<view class="info">
					<image style="width: 30rpx; height: 30rpx; margin-right: 6rpx" src="/static/images/common/sun.png" />
					<text>{{ subList.unlock_points }}</text>
				</view>
			</view>

			<view class="right" v-if="!subList.is_unlocked">
				<u-button
					text="解锁模板"
					:custom-style="{
						color: '#000000',
						height: '70rpx'
					}"
					color="#ffdd02"
					@click="handleAction(subList)"
				></u-button>
			</view>
		</view>
	</view>
</template>
<script>
import config from '@/utils/config.js';

export default {
	props: {
		list: {
			type: Object,
			default: () => {}
		}
	},
	watch: {
		list: {
			handler(newVal) {
				this.subList = newVal;
				this.subList.preview_image = config.mobeilURL + newVal.preview_image;
			}
		}
	},
	data() {
		return {
			subList: {}
		};
	},
	methods: {
		handleAction(item) {
			if (item.status === 'unlocked') {
				// 处理使用模板的逻辑
				console.log('使用模板', item);
			} else {
				// 处理解锁模板的逻辑
				console.log('解锁模板', item);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	margin: 30rpx 0;
	background: #fff;
	border-radius: 16rpx;
}

.left {
	position: relative;
	width: 140rpx;
	height: 140rpx;
	border-radius: 12rpx;
	overflow: hidden;
	margin-right: 24rpx;
}

.image {
	width: 100%;
	height: 100%;
}

.lock-tag {
	position: absolute;
	top: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.7);
	color: #fff;
	padding: 4rpx 12rpx;
	font-size: 20rpx;
	border-bottom-left-radius: 8rpx;
}

.middle {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.name {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 8rpx;
}

.desc {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 12rpx;
}

.info {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #333;
}

.points {
	font-size: 24rpx;
	color: #ff6b35;
}

.right {
	margin-left: 20rpx;
}

.action-btn {
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	font-size: 24rpx;
	border: none;
}

.action-btn.unlocked {
	background: #1890ff;
	color: #fff;
}

.action-btn.locked {
	background: #ff6b35;
	color: #fff;
}
</style>
