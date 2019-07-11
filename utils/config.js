/**
 * 项目通用静态配置
 * tip: 送审前更改 MODE='prop'
 */

// 指定环境===两种模式：prop:正式环境，dev：测试环境
const MODE = 'dev'

// 测试环境————接口
const DEV_DOMAIN_INTF = ``

// 测试环境————图片
const DEV_URL_IMAGES = ``

// 正式环境————接口
const PROP_DOMAIN_INTF = ``

// 正式环境————图片
const PROP_URL_IMAGES = ``


/* 通用配置 */
const CONFIG = {
  // 是否console
  isConsole: MODE == 'dev' ? true : false,

  // 接口域名
  baseUrl: MODE == 'dev' ? DEV_DOMAIN_INTF : PROP_DOMAIN_INTF,

  // 图片路径
  imgBaseUrl: MODE == 'dev' ? DEV_URL_IMAGES : PROP_URL_IMAGES,
}


/* 接口 */
const INTF = {

}

/* toast 提示语 */
const TOAST = {
  // 接口请求出错提示语
  overtime: `网络不可用，请检查网络设置`,
}

module.exports = {
  CONFIG,
  INTF,
  TOAST
}
