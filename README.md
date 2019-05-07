

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
+-- app.js
+-- app.json
+-- app.wxss
+-- jsconfig.json
+-- project.config.json

```