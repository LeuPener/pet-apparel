<template>
	<view class="waterfall-item">
		<slot name="default"></slot>
	</view>
</template>

<script>
	import { wait } from './js/utils.js';
	export default {
		name:"helangWaterfallItem",
		options:{
			virtualHost: true
		},
		props:{
			colIndex:{
				type:Number,
				default:0
			},
			reportHeightTime:{
				type:Number | String | undefined | null,
				default:''
			}
		},
		watch:{
			"$props.reportHeightTime"(newValue, oldValue){
				if(newValue !== oldValue){					
					this.postHeight({
						reportHeightTimeChange:true
					});
				}
			}
		},
		data() {
			return {
				
			};
		},
		mounted() {
			this.postHeight();
		},
		methods:{
			async postHeight(params){
				const { reportHeightTimeChange = false } = params ?? {};
				// 添加一个异步的宏任务，部分低性能的移动设备会因为渲染问题导致上报的高度存在错误问题
				await wait(10);
				// 当前高度
				const currentHeight = await this.getHeight();
				// 显示高度
				const displayHeight = this.displayHeight || 0;
				// 上报高度
				let height = currentHeight - displayHeight;
				
				// 上报高度为0时，取消上报。防止用户调用 update 函数时错误的reportHeight参数情况 
				if(height === 0){
					return;
				}
				
				this.$emit("height",{
					colIndex:this.$props.colIndex,
					height,
					reportHeightTimeChange
				});
				// 缓存渲染高度
				this.displayHeight = currentHeight;
			},
			getHeight(){
				const query = uni.createSelectorQuery().in(this);
				return new Promise((resolve,reject)=>{
					query.select('.waterfall-item').boundingClientRect((data) => {
						// 节点高度
						const height = Math.floor(data.height) || 0;
						resolve(height);
					}).exec();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.waterfall-item{
		& + .waterfall-item{
			margin-top:20rpx;
		}
	}
</style>
