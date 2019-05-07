//index.js
//获取应用实例
const app = getApp()
const { 
  CONFIG, // 相关配置
  INTF, // 接口
  api, // 工具API
  canvasApi,  // canvas相关API
  share_message,  // 默认分享信息
} = app.globalData


Page({
  data: {
    openid: '',
    userInfo: {},
    hasUserInfo: false,
  },
  
  onLoad (){
    app.getOpenid().then(openid => {
      this.setData({
        openid
      })
    })
  },

  /* 点击获取用户信息 */
  getUserInfo(e){
    app.tapGetUserInfo(e, this).then(openid => {
      this.setData({
        openid
      })
    })
  },
})
