<template>
	<u-popup :show="nshow" :round="10" mode="bottom" closeable @close="handleClose">
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
			<button open-type="getPhoneNumber" class="login-btn" @getphonenumber="getUserPhone">一键授权登陆</button>
			<!--  #ifdef APP-PLUS -->
			<view class="login-phone-btn">输入手机号登录/注册</view>
			<!-- #endif -->
		</view>
	</u-popup>
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
						console.log('res', res);
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
		getUserPhone(usermsg) {
			if (!this.checked) {
				uni.showToast({
					title: '请先同意协议',
					icon: 'none'
				});
				return;
			}
			// uni.showLoading({
			// 	title: '登录中',
			// 	mask: true
			// });
			console.log('usermsg', usermsg);
			try {
				uni.showToast({
					title: `获取code${this.logincode}`,
					icon: 'none'
				});
				// if (usermsg.detail?.code) {
				// 	if (this.logincode) {
				// 		user.getLoginCode(this.logincode)
				// 			.then((res) => {
				// 				const { code, data, message } = res;
				// 				if (code !== 200) {
				// 					throw Error(message);
				// 				}
				// 				user.login({
				// 					sessionKey: data.session_key,
				// 					openId: data.openid,
				// 					encryptedData: usermsg.detail.encryptedData,
				// 					iv: usermsg.detail.iv
				// 				})
				// 					.then((res) => {
				// 						uni.hideLoading();
				// 						if (res.code !== 0 && res.code !== 200) {
				// 							throw Error(res.message);
				// 						}
				// 						uni.showToast({
				// 							title: '登录成功',
				// 							icon: 'none'
				// 						});

				// 						uni.setStorageSync('userinfo', res.data);
				// 						uni.setStorageSync('cxbtoken', res.data.token);
				// 						this.nshow = false;
				// 						this.handleSuccess();
				// 					})
				// 					.catch((err) => {
				// 						throw Error();
				// 					});
				// 			})
				// 			.catch((err) => {
				// 				throw Error();
				// 			});
				// 	} else {
				// 		throw Error();
				// 	}
				// } else {
				// 	throw Error();
				// }
			} catch (e) {
				uni.hideLoading();
				uni.showToast({
					title: e || '登录失败',
					icon: 'none'
				});
			}
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

	.login-icon {
		margin-top: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		> image {
			height: 238rpx;
		}
	}

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
