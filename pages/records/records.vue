<template>
	<view class="page-container">
		<view class="record-list" v-if="recordList.length > 0">
			<view v-for="(item, index) in recordList" :key="item.id" class="record-item">
				<!-- 记录头部信息 -->
				<view class="record-header">
					<text class="time">{{ item.createTime }}</text>
					<view class="status flex items-center">
						<!-- 状态图标 -->
						<image v-if="item.status === 'processing'" src="/static/images/common/progress.png" class="status-icon" />
						<image v-else-if="item.status === 'completed'" src="/static/images/common/finished.png" class="status-icon" />

						<!-- 状态文本 -->

						<text :style="{ color: item.status === 'processing' ? '#f7bc41' : '#4cbc55' }">{{ getStatusText(item.status) }}</text>
					</view>
				</view>

				<!-- 图片展示区域 -->
				<view class="image-section">
					<!-- 原图 -->
					<view class="image-box">
						<text class="image-label">原图</text>
						<image :src="item.originalImage" mode="aspectFill" class="image-preview" @click="previewImage(item.originalImage, '原图')" />
					</view>

					<!-- 箭头 -->
					<view class="arrow">→</view>

					<!-- 生成图 -->
					<view class="image-box">
						<text class="image-label">生成图</text>
						<view class="generated-image-container">
							<image
								v-if="item.status === 'completed'"
								:src="item.generatedImage"
								mode="aspectFill"
								class="image-preview"
								@click="previewImage(item.generatedImage, '生成图')"
							/>
							<view v-else class="processing-placeholder">
								<text class="processing-text">{{ getProcessingText(item.status) }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 操作按钮 -->
				<!-- <view class="option-btn">
					<view style="width: 150rpx">
						<u-button
							type="primary"
							shape="circle"
							color="#fde743"
							text="下载"
							size="small"
							:custom-style="{
								color: '#000000'
							}"
							:disabled="item.status !== 'completed'"
							@click="downloadImage(item.generatedImage, item.id)"
						></u-button>
					</view>
				</view> -->
				<!-- <view class="action-buttons">
					<button class="btn btn-download" >
						<text class="btn-text">下载</text>
					</button>

					 <button class="btn btn-delete" @click="deleteRecord(item.id, index)">
						<text class="btn-icon">🗑️</text>
						<text class="btn-text">删除</text>
					</button> 
				</view> -->
			</view>
		</view>

		<!-- 空状态 -->
		<view v-else class="empty-state">
			<image src="/uni_modules/helang-waterfall/static/waterfall/empty.png" class="empty-image" />
			<text class="empty-text">暂无生成记录</text>
			<text class="empty-desc">快去生成你的第一张照片吧</text>
		</view>

		<!-- 加载更多 -->
		<view v-if="hasMore && recordList.length > 0" class="load-more">
			<u-loadmore status="loading" />
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			recordList: [
				{
					id: 1,
					createTime: '2025-01-15 12:15:45',
					status: 'completed', // processing:处理中, completed:已完成
					originalImage: '/uni_modules/helang-waterfall/static/waterfall/0.jpg',
					generatedImage: '/uni_modules/helang-waterfall/static/waterfall/0.jpg'
				},
				{
					id: 2,
					createTime: '2025-01-15 12:15:45',
					status: 'processing',
					originalImage: '/uni_modules/helang-waterfall/static/waterfall/0.jpg',
					generatedImage: ''
				},
				{
					id: 3,
					createTime: '2025-01-15 12:15:45',
					status: 'completed',
					originalImage: '/uni_modules/helang-waterfall/static/waterfall/0.jpg',
					generatedImage: '/uni_modules/helang-waterfall/static/waterfall/0.jpg'
				}
			],
			hasMore: true
		};
	},
	onLoad() {
		this.loadRecords();
	},
	onReachBottom() {
		this.loadMore();
	},
	onPullDownRefresh() {
		this.refreshRecords();
	},
	methods: {
		// 加载记录
		loadRecords() {
			// 模拟API调用
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},

		// 加载更多
		loadMore() {
			if (!this.hasMore) return;

			// 模拟加载更多数据
			setTimeout(() => {
				const newRecords = [
					{
						id: this.recordList.length + 1,
						createTime: '2024-01-15 11:10:30',
						status: 'completed',
						originalImage: '/static/images/sample-original4.jpg',
						generatedImage: '/static/images/sample-generated4.jpg'
					}
				];
				this.recordList = [...this.recordList, ...newRecords];
				this.hasMore = false;
			}, 1500);
		},

		// 刷新记录
		refreshRecords() {
			// 模拟刷新
			setTimeout(() => {
				this.recordList = [...this.initialRecords]; // 重置为初始数据
				this.hasMore = true;
				uni.stopPullDownRefresh();
				uni.showToast({
					title: '刷新成功',
					icon: 'success'
				});
			}, 1000);
		},

		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				processing: '处理中',
				completed: '已完成'
			};
			return statusMap[status] || '未知状态';
		},

		// 获取处理中文本
		getProcessingText(status) {
			if (status === 'processing') {
				return '生成中...';
			}
			return '等待处理';
		},

		// 预览图片
		previewImage(imageUrl, title = '图片预览') {
			if (!imageUrl) {
				uni.showToast({
					title: '图片加载中，请稍后',
					icon: 'none'
				});
				return;
			}

			uni.previewImage({
				urls: [imageUrl],
				current: 0,
				success: () => {
					console.log('预览图片成功:', imageUrl);
				},
				fail: (err) => {
					console.error('预览图片失败:', err);
					uni.showToast({
						title: '预览失败',
						icon: 'none'
					});
				}
			});
		},

		// 下载图片
		downloadImage(imageUrl, recordId) {
			if (!imageUrl) {
				uni.showToast({
					title: '图片尚未生成完成',
					icon: 'none'
				});
				return;
			}

			uni.showLoading({
				title: '下载中...',
				mask: true
			});

			// 模拟下载过程
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '图片已保存到相册',
					icon: 'success'
				});

				// 这里可以调用实际的下载API
				console.log('下载图片:', imageUrl, '记录ID:', recordId);
			}, 2000);
		},

		// 删除记录
		deleteRecord(recordId, index) {
			uni.showModal({
				title: '确认删除',
				content: '删除后将无法恢复该记录',
				confirmColor: '#ff4757',
				success: (res) => {
					if (res.confirm) {
						// 从列表中移除
						this.recordList.splice(index, 1);

						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});

						// 这里可以调用实际的删除API
						console.log('删除记录:', recordId);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page-container {
	padding: 30rpx;
	background: #f8f9fa;
	min-height: 100vh;
}

.header {
	margin-bottom: 30rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.record-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.record-item {
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.record-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.time {
	font-size: 26rpx;
	color: #666;
}

.status {
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
	.status-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 8rpx;
	}

	&.status-processing {
		background: #fff3cd;
		color: #856404;
	}

	&.status-completed {
		background: #d1edff;
		color: #007bff;
	}
}

.image-section {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 30rpx;
}

.image-box {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.image-label {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.image-preview {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	background: #f8f9fa;
}

.generated-image-container {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	background: #f8f9fa;
	display: flex;
	align-items: center;
	justify-content: center;
}

.processing-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: #f8f9fa;
	border-radius: 12rpx;
	border: 2rpx dashed #ddd;
}

.processing-text {
	font-size: 24rpx;
	color: #999;
}

.arrow {
	font-size: 32rpx;
	color: #ccc;
	margin: 0 20rpx;
	font-weight: bold;
}
.option-btn {
	display: flex;
	justify-content: flex-end;
}

.action-buttons {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10rpx;
	border: none;
	border-radius: 12rpx;
	font-size: 28rpx;
	transition: all 0.3s ease;

	&:active {
		transform: scale(0.98);
	}

	&:disabled {
		opacity: 0.5;
		transform: none;
	}
}

.btn-download {
	background: #fde743;
	color: #000;
	width: 120rpx;
	border-radius: 60rpx;
	margin-left: auto;
}

.btn-delete {
	background: #ffebee;
	color: #d32f2f;
}

.btn-icon {
	margin-right: 8rpx;
	font-size: 28rpx;
}

.btn-text {
	font-weight: 500;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;
}

.empty-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 40rpx;
	opacity: 0.5;
}

.empty-text {
	font-size: 32rpx;
	color: #999;
	margin-bottom: 16rpx;
}

.empty-desc {
	font-size: 26rpx;
	color: #ccc;
}

/* 加载更多 */
.load-more {
	padding: 40rpx 0;
}
</style>