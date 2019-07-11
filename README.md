

## 项目结构
```
+-- components(组件)
|   +-- ui-test
|       +-- ui-test.wxml
|       +-- ui-test.wxss
|       +-- ui-test.js
|       +-- ui-test.json
+-- pages(页面)
|   +-- common(公用资源)
|   +-- package(分包目录)
|     +-- package(分包页面入口)
|       +-- page1(分包页面入口一)
|         +-- page1.wxml
|         +-- page1.wxss
|         +-- page1.json
|         +-- page1.js
|       +-- page2(分包页面入口二)
|         +-- page2.wxml
|         +-- page2.wxss
|         +-- page2.json
|         +-- page2.js
|   +-- page1(对应page1分包各个子页面及静态资源)
|     +-- res(静态资源)
|     +-- subpage1(page1的子页面一)
|     +-- subpage2(page1的子页面二)
|   +-- page2(对应page2分包各个子页面及静态资源)
|     +-- res(静态资源)
|     +-- subpage1(page2的子页面一)
|     +-- subpage2(page2的子页面二)
+-- templates(模板)
|   +-- tpl-test
|       +-- tpl-test.wxml
|       +-- tpl-test.wxss
+-- test(测试文件)
+-- img(本地图片资源，小程序送测时在project.config.json里面忽略该文件，并将图片资源更新到线上)
+-- image(只支持相对定位的图片，例如tabBar图标)
+-- utils
|   +-- util.js(公用方法)
|   +-- config.js(项目配置相关)
|   +-- load_more.js(上拉加载，下拉刷新主要逻辑)
+-- app.js
+-- app.json
+-- app.wxss
+-- jsconfig.json
+-- project.config.json

```

## components
### f2-canvas
> 说明：基于f2的图表组件
github: https://github.com/antvis/wx-f2.git

使用方法：
```html
<ff-canvas 
  class="elementClass" 
  id="elementId" 
  canvas-id="canvasId" 
  opts="{{ opts }}">
</ff-canvas>

```

```js
// 懒加载
...
opts: {
  lazyLoad: true
},
...

let weekChart = this.selectComponent('#elementId')
weekChart.init((...arg) => {
  initChartLine([...arg, chartData]) // 相关方法
})

```

---
