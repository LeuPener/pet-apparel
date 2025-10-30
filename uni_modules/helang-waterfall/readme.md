# 瀑布流 helang-waterfall

## 插件简介

> 这是一款简单又好用的瀑布流布局组件，从`1.2.1`版本开始全新升级为组件+插槽的方案实现，极大的简便了组件的使用和内容调整。

#### <font color="red">源码中有详细的注释，请各位开发者按个人需求自行修改。</font>

### <font color="red">对使用有疑问，可以先导入 [示例项目] 学习 页面与组件的使用流程</font>

## 组件使用

### 示例源码

> 示例源码较多，请下载示例项目查看

### 组件清单
```javascript
// 引用组件
/* 瀑布流组件 */
// 容器组件
import Waterfall from "@/uni_modules/helang-waterfall/components/waterfall/waterfall-list";
// 分栏组件
import WaterfallCol from "@/uni_modules/helang-waterfall/components/waterfall/waterfall-col";
// 内容组件
import WaterfallItem from "@/uni_modules/helang-waterfall/components/waterfall/waterfall-item";


export default {
	// ...
	// 注册组件
	components: {
		"waterfall": Waterfall,
		"waterfall-col": WaterfallCol,
		"waterfall-item": WaterfallItem
	},
	// ...
}
```

### 容器组件 waterfall-list

#### 插槽 
插槽名称 | 透传数据 | 说明
--------|------|------
default | 详情见default插槽透传数据说明 |瀑布流列表内容，放置 `waterfall-col` 组件
tips | - | 瀑布流列表下方提示信息

#### default插槽透传数据说明 

- 数据结构：`{ list,colWidth }`
- 字段说明：
	1. list：渲染的数据列表，数据增加了 `__waterfall_renderId`、`__waterfall_imageHeight` 属性
		1. `__waterfall_renderId` 用于&lt;waterfall-item&gt;组件循环渲染的 `key`
		2. `__waterfall_reportHeightTime` 用于&lt;waterfall-item&gt;组件监听是否需要重新上报高度的时机
		3. `__waterfall_imageHeight` 用于&lt;image&gt;标签的 `style高度`
	2. colWidth：栏目的宽度，用于 &lt;waterfall-col&gt; 组件的`colWidth`属性


####  属性

属性名 | 类型 | 默认值 | 说明
--------|------|------|------
col | Number | 2 | 列表分栏数量，`不可动态修改`
imageWidth | Number / String | 305 | 列表中图片渲染的宽度，可支持 px 和 rpx单位的宽度，Number类型为rpx单位，若需要px单位则可写`152px`, `不可动态修改`，305是示例列表的图片渲染宽度
imageKey | String | url | 数据中图片的key值，默认为`url`
hideList | Boolean | false | 是否隐藏列表，可隐藏列表部分来展示更多的提示内容(如：空列表时)
cacheImageHeight | Boolean | true | 是否缓存图片高度，能减少图片信息的加载过程提高渲染效率。

#### 方法 
- 源码演示

```javascript
// 组件绑定 ref
<waterfall ref="helangWaterfall">...</waterfall>

// 通过 ref 调用组件中的方案
// 渲染
this.$refs.helangWaterfall.render(数据Array,是否重绘Boolean);

// 上报当前高度
this.$refs.helangWaterfall.reportHeight({
	colIndex: 栏目序号Number,
	height: 高度Number,
	reportHeightTimeChange: 是否需要重新上报高度Boolean
});

// 更新数据
this.$refs.helangWaterfall.update({
	colIndex: 栏目序号Number,
	itemIndex: 渲染项序号Number,
	data: 新的数据Object，切记需要保留之前的属性，仅做新属性的覆盖，参考示例项目,
	reportHeight: 是否上报高度Boolean
});
```
- 详细说明

方法名称 | 参数 | 说明
--------|------|------
render | (数据Array,是否重绘Boolean) | 开启瀑布流渲染
reportHeight | ({<br />&nbsp;&nbsp;colIndex: 栏目序号Number,<br />&nbsp;&nbsp;height: 高度Number,<br />&nbsp;&nbsp;reportHeightTimeChange: 是否需要重新上报高度Boolean<br />}) | 汇报当前项的渲染高度，数据从`<waterfall-item @height="onRenderHeight">` 获取
update | ({<br />&nbsp;&nbsp;colIndex: 栏目序号Number,<br />&nbsp;&nbsp;itemIndex: 渲染项序号Number,<br />&nbsp;&nbsp;data: 新的数据Object，切记需要保留之前的属性，仅做新属性的覆盖，参考示例项目<br />&nbsp;&nbsp;reportHeight: 是否上报高度Boolean，用于改变数据会导致节点渲染高度发生改变时使用（如有添加、展开、删除节点的操作时）<br />}) | 更新数据，可参考示例项目的收藏和改变高度的功能实现

#### 事件
事件名称 | 参数 | 说明
--------|------|------
@statusChange | (渲染状态值String) | 监听瀑布流组件的渲染状态，状态有:`RENDER_LOADING(加载中)`、`RENDER_START(渲染开始)`、`RENDER_END(渲染结束)`，<br />可让业务代码配合拦截部分操作减少渲染过程中的BUG发生

### 分栏组件 waterfall-col

####  属性

属性名 | 类型 | 默认值 | 说明
--------|------|------|------
colWidth | String | '' | 栏目宽度，数据来源于 `waterfall-lsit` 的插槽透传的`colWidth`属性

### 内容组件 waterfall-item

####  属性

属性名 | 类型 | 默认值 | 说明
--------|------|------|------
colIndex | Number | 0 | 栏目索引，用于汇报渲染高度时使用
reportHeightTime | Number / String / undefined / null | 0 | 高度上报时间，用于监听是否数据发生更新

####  事件

方法名 | 回调参数 | 说明
--------|------|------
@height | ({colIndex, height，reportHeightTimeChange}) | 监听当前内容渲染后的高度，<br />`colIndex`:栏目索引、<br />`height`:渲染的高度值、<br />`reportHeightTimeChange`:是否需要重新上报高度Boolean

## 常见问题解答

### 1. 列表渲染速度太慢，怎么优化？

瀑布流布局最大的难点是在于图片加载是一个异步的过程，所以本插件也是利用了图片加载这个事件来触发组件初始化完成的。为了更好的加载体验和降低用户的用户的流量消耗，推荐使用`缩略图`来做为列表中的显示（也应当这么做，不只是在瀑布流布局中），这也是做好一个产品最基本的优化要求。

## 友情提示：
1. 当前项目源码使用了 ES6 和 scss 请添加运行依赖
2. [插件ZIP]只包含模板文件和数据文件，不包含项目运行依赖（如 pages.json）
3. [示例项目ZIP]是完整的项目文件，可下载后导入 HBuilderX 中直接运行体验
4. 文件下载在当前页面的上部靠右位置，有 [下载插件ZIP] [下载示例项目ZIP] 按钮，点击即可下载