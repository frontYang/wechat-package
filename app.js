//app.js
const { CONFIG, INTF } = require('./utils/config.js')
const api = require('./utils/util.js')
const canvasApi = require('./utils/canvasApi.js')

App({
  onLaunch(options) {
    console.log(`onLaunch options, ${JSON.stringify(options)}`)
    let channel = ''
    if(options.referrerInfo.extraData && options.referrerInfo.extraData.trackSZ){
      channel = options.referrerInfo.extraData.trackSZ
    }
    // 获取用户缓存信息
    this.getUserInfo().then(userInfo => {
      this.log(`app-getStorage-userinfo: ${JSON.stringify(userInfo)}`)
      this.globalData.userInfo = userInfo;
    })

    // login
    this.getOpenid(channel).then(openid => {
      this.globalData.openid = openid;
    })

    this.clearStorage()
  },

  // 清除 缓存
  clearStorage(){

  },

  /* 登录 */
  login(channel){
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          this.log(`[success]-login: ${JSON.stringify(res)}`)
          if (res.code) {
            api._post(INTF.get_open_id, {
              code: res.code,
              channel: channel || ''
            }).then(res => {
              var openid = res.data.openid
              wx.setStorage({
                key: 'openid',
                data: openid,
              });
              this.globalData.openid = openid
              resolve()
            }).catch(res => {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            })
          } else {
            this.log('[fail]-login')
          }
        },
      })
    })
  },

  /* 获取openid，后期一起优化，暂时这样处理 */
  getOpenid(channel){
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'openid',
        success: (res) => {
          this.log(`[getOpenid-success]getStorage-openid: ${JSON.stringify(res.data)}`)
          resolve(res.data)
        },
        fail: res => {
          reject(res)
        }
      })
    }).catch(res => {
      this.log(`[getOpenid-fail-重新登录]`)
      this.login(channel)
    })
  },

  /* 获取userinfo */
  getUserInfo(){
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'userInfo',
        success: (res) => {
          this.log(`有缓存用户信息：${JSON.stringify(res.data)}`)
          resolve(res.data)
        },
        fail: (res) => {
          reject(res)
        }
      });
    }).catch(res => {
    })
  },

  /* 收集formid */
  collectFormid(form_id){
    this.getOpenid().then(openid => {
      api._post(INTF.collect, {
        openid,
        form_id
      }).then(res => {

      }).catch(res => {})
    }).catch(res => {})
  },

  /* 更新用户授权信息 */
  saveUser(data) {
    let openid = wx.getStorageSync('openid')

    api._post(INTF.save_user, {
      openid: openid,
      iv: data.iv,
      encrypted_data: data.encryptedData,
      type: 1
    }).then(res => {})
  },

  /* 检查用户信息 */
  checkUserInfo(_this){
    let canIUse = wx.canIUse('button.open-type.getUserInfo')

    // 缓存用户信息
    let setUserStorage = (userInfo) => {
      this.globalData.userInfo = userInfo || null

      _this.setData({
        userInfo: userInfo || null,
        hasUserInfo: userInfo != undefined ? true : false
      })

      wx.setStorage({
        key: 'userInfo',
        data: userInfo,
      })
    }

    if (this.globalData.userInfo != '' && this.globalData.userInfo != undefined) {
      // 从全局获取
      setUserStorage(this.globalData.userInfo, true)
    } else if (canIUse) {
      // 缓存获取
      this.getUserInfo().then(userInfo => {
        setUserStorage(userInfo)
      })

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      this.userInfoReadyCallback = res => {
        this.log('用户信息延时')
        setUserStorage(res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          setUserStorage(res.userInfo)
        }
      })
    }
  },

  /* button获取用户信息 */
  tapGetUserInfo(e, _this) {
    return new Promise((resolve, reject) => {
      // 点击登录授权之后，获取到的用户信息，保存到storage里面去
      this.globalData.userInfo = e.detail.userInfo

      _this.setData({
        hasUserInfo: e.detail.userInfo != undefined ? true : false
      })

      if(_this.data.hasUserInfo){
        // 获取用户信息成功
        _this.setData({
          userInfo: e.detail.userInfo,
        })

        wx.setStorage({
          key: 'userInfo',
          data: e.detail.userInfo
        })

        // 更新用户信息
        this.saveUser(e.detail)

        this.getOpenid().then(openid => {
          // 获取成功后相关操作
          resolve(openid)
        })
      }
    }).catch(() => {
      this.log('授权失败')
    })
  },

  /* 分享提示 */
  shareTip(opts = {}){
    let openid = wx.getStorageSync('openid')

    api._post(INTF.share, {
      openid: openid,
      type: opts.type || '', // 1：习惯，2：目标
      target: opts.target || '', // 习惯id或者目标id
    }).then(res => {
      if(res.code == 1){
        // 有经验值
        wx.showModal({
          title: '提示',
          content: `分享成功，宝石+${res.data.rewardCount}`,
          showCancel: false,
          confirmText: '我知道了',
          success: (result) => {
            if(result.confirm){

            }
          },
          fail: ()=>{},
          complete: ()=>{}
        })
      }else if(res.code == 0){

      }
    })
  },

  /* 全局变量 */
  globalData: {
    userInfo: '',
    appid: 'openid',
    share_message: {
      title: '',
      path: '',
      imageUrl: '',
    },
    CONFIG: CONFIG,
    INTF: INTF,
    api: api,
    canvasApi: canvasApi
  },

  /* 用CONFIG.isConsole来控制可否打印 */
  log(...str){
    if(CONFIG.isConsole) {
      console.log(...str)
    }
  }
})
