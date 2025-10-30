<script>
export default {
	onLaunch: function () {
		console.log('App Launch');
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import '@/common/common.scss';

::-webkit-scrollbar {
	display: none;
}

* {
	word-break: break-all;
	word-wrap: break-word;
	box-sizing: border-box;
	font-family: PingFang SC, PingFang SC;
}

view {
	word-break: break-all;
	word-wrap: break-word;
	box-sizing: border-box;
	font-family: PingFang SC, PingFang SC;
}

/*每个页面都会生效的css */
page {
	/*这里一定要设置，否则小程序会有问题 */
	width: auto;
	font-family: PingFang SC, PingFang SC;
	box-sizing: border-box;
	background-color: #eff2f3;
	word-break: break-all;
	word-wrap: break-word;
}

uni-page-body,
html,
body {
	height: 100%;
	word-break: break-all;
	word-wrap: break-word;
}
</style>
