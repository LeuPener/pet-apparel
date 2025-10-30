<template>
	<view style="padding: 20rpx 0;">
		<waterfall 
			ref="helangWaterfall" 
			:hideList="hideList"
			imageKey="imgUrl"
			@statusChange="handleStatusChange"
		>
			<template v-slot:default="{ list, colWidth }">
				<waterfall-col 
					v-for="(colItem,colIndex) in list" 
					:key="colIndex" 
					:colWidth="colWidth"
				>
					<template>
						<waterfall-item  
							v-for="(item,index) in colItem" 
							:key="item.__waterfall_renderId" 
							:colIndex="colIndex"
							:reportHeightTime="item.__waterfall_reportHeightTime"
							@height="onRenderHeight"
						>
							<view class="content" @click="handleClick" :data-col_index="colIndex" :data-item_index="index">
								<image 
									class="image" 
									mode="aspectFill" 
									:src="item.imgUrl" 
									:style="{height:item.__waterfall_imageHeight}"
								>
									<!-- 必须给图片的高度设置为 __waterfall_imageHeight 属性的高 -->
								</image>
								<view class="title">{{item.title}}</view>
								<view class="label ellipsis-1">{{item.label}}</view>
								<view class="money ellipsis-1">价格：{{item.money}}元</view>
								<view class="shop ellipsis-1">{{item.shop}}</view>
								<!-- 这个节点真实项目中可删除 -->
								<view 
									v-if="(colIndex === 0 && index === 0) || (colIndex === 1 && index === 1)"
									style="margin-top: 8px;border: red solid 1px;padding: 8px;" 
								>	
									<view style="font-size: 12px;color: red;margin-bottom: 4px;">
										次节点为演示 update 函数动态更新数据的能力，
										真是项目删除即可
									</view>
									<view>
										<button
											size="mini" 
											style="margin-right: 4px;" 
											:type="item.star ? 'primary':'warn'"
											@tap.stop="handleStar({
												colIndex,
												itemIndex:index,
												data:item
											})"
										>{{item.star ? '已':''}}收藏</button>
									</view>
									<view>
										<view 
											v-if="item.activeHeight" 
											:style="{height:item.activeHeight+'px'}"
											style="background-color: rgba(255, 0, 0, 0.4);font-size: 12px;"
										>当前随机高度：{{ item.activeHeight }}</view>
										<button size="mini"
											@tap.stop="handleActiveHeight({
												colIndex,
												itemIndex:index,
												data:item
											})"
										>随机高度</button>
									</view>
								</view>
							</view>
						</waterfall-item>
					</template>
				</waterfall-col>
			</template>
			<template #tips>
				<view class="load-txt">
					<view v-if="hideList">
						<template v-if="waterfall.status === 'fail'">
							<image src="/uni_modules/helang-waterfall/static/waterfall/fail.png" mode="aspectFit"></image>
							<view>数据异常</view>
						</template>
						<template v-else-if="waterfall.status === 'empty'">
							<image src="/uni_modules/helang-waterfall/static/waterfall/empty.png" mode="aspectFit"></image>
							<view>暂无内容</view>
						</template>
					</view>
					<view v-else style="padding-top: 30rpx;">加载中</view>
					
				</view>
			</template>
		</waterfall>
		<!-- 演示多种效果 -->
		<view class="status-change" @click="onStatusChange">设置</view>
	</view>
</template>

<script>
	// 瀑布流组件
	import Waterfall from "@/uni_modules/helang-waterfall/components/waterfall/waterfall-list";
	import WaterfallCol from "@/uni_modules/helang-waterfall/components/waterfall/waterfall-col";
	import WaterfallItem from "@/uni_modules/helang-waterfall/components/waterfall/waterfall-item";
	
	// 列表接口模拟数据，真是项目不需要
	import mockData from '../../mock-data/waterfall-list.js'
	
	export default {
		components: {
			"waterfall": Waterfall,
			"waterfall-col": WaterfallCol,
			"waterfall-item": WaterfallItem
		},
		computed:{
			hideList(){
				return ['fail','empty'].includes(this.waterfall.status);
			}
		},
		data() {
			return {
				// 异步请求相关
				ajax: {
					// 是否可以加载
					load: true,
					// 每页的请求条件
					rows:10,
					// 页码
					page:1,
					// 数据列表
					dataList:[]
				},
				// 瀑布流组件相关
				waterfall:{
					// 组件状态
					status:'',
					// 是否渲染完成
					renderEnd:true
				}
			}
		},
		onReady() {
			this.getList();
		},
		// 触底触发
		onReachBottom() {
			// 渲染完成，才允许请求下一页
			if(this.waterfall.renderEnd){
				this.getList();
			}
		},
		// 下拉刷新
		onPullDownRefresh(){
			// 正常情况下接口返回应该很会很快。故意延迟调用，让用户有在刷新的体验感
			setTimeout(()=>{
				this.ajax.page = 1;
				this.ajax.load = true;
				this.getList(this.ajax.page);
			},800);
		},
		methods: {
			// 监听渲染高度，此事件为必用
			onRenderHeight(e){
				const { colIndex, height, reportHeightTimeChange } = e;
				// 上报当前高度，上报后会自动触发下一项数据的渲染
				this.$refs.helangWaterfall.reportHeight({
					colIndex,
					height,
					reportHeightTimeChange
				});
			},
			// 获取数据
			getList() {
				// 请求未完成前禁止发起请求
				if (!this.ajax.load) {
					return;
				}
				this.ajax.load = false;
				
				// 请求数据， mockData.getList 示例一个 ajax 请求
				mockData.getList({
					pageNum:this.ajax.page,
					pageSize:this.ajax.rows
				}).then(res=>{
					// 获取到的数据，请注意数据结构
					console.log(res);
					
					// 第一页数据执行以下代码
					if(this.ajax.page == 1){
						// 关闭下拉
						uni.stopPullDownRefresh();
					}
					
					// 数据无效时处理
					if(!res || res.length < 1){
						// 设置提示内容
						this.waterfall.status = this.ajax.page === 1 ? 'fail' : 'empty';
						return;
					}
					
					// 当前页面页面为1时，表示列表重绘，场景一般是 刷新/搜索 时
					const reset  = this.ajax.page === 1 ? true : false;
					// 若是重绘列表的话，需要取消 `hideList`属性，隐藏状态下会引发列表尺寸获取错误的问题
					if(reset){
						this.waterfall.status = '';
					}
					// 调用 render 方法，使组件开始进入渲染阶段
					this.$refs.helangWaterfall.render(res,reset);
					this.ajax.load = true;
					this.ajax.page++;
				})
			},
			// 导航状态切换演示监听
			onStatusChange(){
				const vlaues = ['','fail','empty'];
				const labels = ['正常展示', '加载异常', '无结果'];
				uni.showActionSheet({
					itemList: labels,
					success: (res)=> {
						this.waterfall.status = vlaues[res.tapIndex];
					}
				});
			},
			// 瀑布流组件点击事件
			handleClick(e){
				const { col_index, item_index } = e?.currentTarget?.dataset;
				uni.showToast({
					title:`第${col_index+1}栏的${item_index+1}个被点击`,
					icon:'none'
				});
			},
			// 处理瀑布流渲染状态
			handleStatusChange(status){
				if(status === 'RENDER_END'){
					this.waterfall.renderEnd = true;
				}else{
					this.waterfall.renderEnd = false;
				}
			},
			// 收藏
			handleStar(params){
				const { colIndex, itemIndex, data } = params;
				// 切换收藏状态
				const star = !data?.star;
				this.$refs.helangWaterfall.update({
					colIndex,
					itemIndex,
					data:{
						...data,
						star
						// 此处因为收藏操作不会改变渲染高度，所以不需要传递reportHeight参数
					}
				})
			},
			// 收藏
			handleActiveHeight(params){
				const { colIndex, itemIndex, data } = params;
				const activeHeight = Math.floor(Math.random() * 100) + 50;				
				this.$refs.helangWaterfall.update({
					colIndex,
					itemIndex,
					data:{
						...data,
						activeHeight
					},
					// 因为改变高度后会于原来的高度产生差值，需要重新上报高度
					// update 方法的 reportHeight 参数设置为 true
					reportHeight:true
				});
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}
	
	.content{
		padding: 20rpx;
		background-color: white;
		border-radius: 4px;
		line-height: 1.3;
		
		.image{
			display: block;
			width: 100%;
			height: auto;
		}
		
		.ellipsis-1{
			white-space:nowrap;        // 强制一行显示
			overflow:hidden;          // 超出隐藏
			text-overflow:ellipsis;   // 省略号
		}
		
		.title{
			font-size: 28rpx;
			color:#666;
			margin: 20rpx 0;
		}
		
		.shop{
			font-size: 24rpx;
			color:#666;
			margin-top: 20rpx;
		}
		
		.label{
			padding: 10rpx 20rpx;
			border-radius: 100px;
			background-color: #F00;
			color: white;
			font-size: 24rpx;
			display: inline-block;
			line-height: 1;
		}
		
		.money{
			font-size: 28rpx;
			color:#F00;
			margin-top: 10rpx;
		}
	}
	
	.load-txt{
		padding:  0;
		text-align: center;
		color: #999;
		font-size: 24rpx;
	}
	
	.load-icon{
		width: 300rpx;
		height: 300rpx;
		margin: 0 auto 20rpx auto;
		display: block;
	}
	
	.status-change{
		position: fixed;
		left: 10rpx;
		top: 60%;
		width: 80rpx;
		height: 80rpx;
		z-index: 100;
		font-size: 24rpx;
		border-radius: 50%;
		background-color: #f00;
		color: #fff;
		line-height: 1;
		opacity: .7;
		box-shadow: 0 0 10px black;
		
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		align-content: center;
	}
</style>