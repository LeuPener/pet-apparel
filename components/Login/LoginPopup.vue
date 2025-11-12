<template>
	<view>
		<u-popup :show="nshow" round="10" mode="bottom" closeable @close="handleClose">
			<view class="login-box flex-col items-center">
				<view class="agreement flex-col items-center">
					<view style="margin-bottom: 24rpx" class="flex-row justify-center">
						<u-checkbox-group v-model="checked">
							<u-checkbox activeColor="#fcd610" label="我已阅读并同意"></u-checkbox>
						</u-checkbox-group>
						<view class="flex-row justify-center items-center">
							<text @click="handleToLink('/pages/index/agreement/agreement')">《用户协议》</text>
						</view>
					</view>
				</view>
				<button open-type="getUserInfo" class="login-btn" @click="getUserInfo">一键授权登陆</button>
				<!--  #ifdef APP-PLUS -->
				<view class="login-phone-btn">输入手机号登录/注册</view>
				<!-- #endif -->
			</view>
		</u-popup>
	</view>
</template>

<script>
import user from '@/api/user.js';
export default {
	name: 'LoginPopup',
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		show: function (newvalue, oldvalue) {
			this.nshow = newvalue;
			if (newvalue) {
				uni.login({
					success: (res) => {
						this.logincode = res.code;
					}
				});
			}
		}
	},
	data() {
		return {
			nshow: false,
			checked: false,
			logincode: ''
		};
	},
	mounted() {
		this.nshow = this.show;
	},
	methods: {
		handleClose() {
			this.$emit('handleClose');
		},
		handleSuccess() {
			this.$emit('onSuccess');
		},
		getUserInfo() {
			if (!this.checked) {
				uni.showToast({
					title: '请先同意协议',
					icon: 'none'
				});
				return;
			}
			wx.getUserProfile({
				desc: '获取用户信息',
				success: (profileRes) => {
					const postData = {
						code: this.logincode,
						encryptedData: profileRes.encryptedData,
						iv: profileRes.iv,
						rawData: profileRes.rawData,
						signature: profileRes.signature,
						userInfo: profileRes.userInfo
					};
					try {
						user.login(postData)
							.then((res) => {
								uni.hideLoading();
								if (res.code !== 0 && res.code !== 200) {
									throw Error(res.message);
								}
								uni.showToast({
									title: '登录成功',
									icon: 'none'
								});

								uni.setStorageSync('userinfo', res.data.user_info);
								uni.setStorageSync('cxbtoken', res.data.user_info.token);
								this.nshow = false;
								this.handleSuccess();
							})
							.catch((err) => {
								throw Error();
							});
					} catch (e) {
						uni.hideLoading();
						uni.showToast({
							title: e || '登录失败',
							icon: 'none'
						});
					}
				}
			});
		},
		handleToLink(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.login-box {
	padding: 100rpx 48rpx 48rpx;

	.agreement {
		color: #999999;

		.check-box {
			// font-size: 24rpx;
			color: #999999;
		}
	}

	.login-btn {
		margin-top: 40rpx;
		text-align: center;
		width: 100%;
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
		line-height: 88rpx;
		height: 88rpx;
		background: #fcd610;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		border: 0;
	}

	.login-phone-btn {
		text-align: center;
		width: 100%;
		margin-top: 24rpx;
		height: 92rpx;
		background: rgba(252, 214, 16, 0.15);
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #f99118;
		line-height: 92rpx;
	}
}
</style>
