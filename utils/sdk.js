const { CONFIG } = require('./config')
const INTF_USER = `${CONFIG.baseUrl}/sdk/WxUserLog/user_log`

/**
 * 日期格式化
 * @param { Date } 日期 
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 小于两位数补0
 * @param {number} n 
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * wx.request 封装
 * @param {string} url [接口链接]
 * @param {object} param [request data]
 * @param {object} other [其余参数]
 */
const http = ({ url = '', param = {}, ...other } = {}) => {
  let timeStart = Date.now()

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: param,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      ...other,
      success: res => {
        // console.log(`${url}: ${JSON.stringify(res.data)} —— time: ${Date.now() - timeStart}ms`)
        resolve(res.data)
      },
      fail: res => {
        // console.log(`${url}: ${JSON.stringify(res)} —— time: ${Date.now() - timeStart}ms`)
        reject(res.data)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }).catch(res => {
    wx.showToast({
      title: 'fail',
      icon: 'none'
    })
  })
}

/**
 * request 封装
 */
const httpApi = {
  _get: (url, param = {}) => {
    return http({
      url,
      param
    })
  },

  _post: (url, param = {}) => {
    return http({
      url,
      param,
      method: 'post'
    })
  }
}

/**
 * getUserInfo
 */
const wxGetUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(`userInfo：${JSON.stringify(res)}`)
              resolve(res.userInfo)
            }
          })
        }
      },
      fail: res => {
        reject(res)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }).catch(res => {
    wx.showToast({
      title: 'getUserInfo fail!',
      icon: 'none'
    })
  })
}

/**
 * getSystemInfo
 */
const wxGetSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: (res) => {
        // console.log(`SystemInfo：${JSON.stringify(res)}`)
        resolve(res)
      },
      fail: res => {
        reject(res)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }).catch(res => {
    wx.showToast({
      title: 'getSystemInfo fail!',
      icon: 'none'
    })
  })  
}

/**
 * getNetworkType 
 */
const wxGetNetworkType = () => {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success (res) {
        // console.log(`networkType: ${JSON.stringify(res.networkType)}`)
        let networkTypeId = 0
        switch (res.networkType.toUpperCase()) {
          case 'NONE': 
            networkTypeId = 0
            break;
          case 'WIFI': 
            networkTypeId = 1
            break;
          case '2G': 
            networkTypeId = 2
            break;
          case '3G': 
            networkTypeId = 3
            break;
          case 'WAP': 
            networkTypeId = 4
            break;
         default: 
          networkTypeId = 5
          break;
        }
        resolve(networkTypeId)
      }
    })
  }).catch(res => {
    wx.showToast({
      title: 'getNetworkType fail!',
      icon: 'none'
    })
  })  
}

/**
 * getOS
 */
const wxGetOS = (os) => {
  let osId = 1

  switch (os.toUpperCase() ) {
    case 'ANDROID': 
      osId = 1
      break;
    case 'IOS': 
      osId = 2
      break;
    case 'WINPHONE': 
      osId = 3
      break;
    default:
      break;
  }

  return osId;
}

/**
 * login
 * @param {object}  opts
 * opts: {
 *  mode // dev:开发环境，prod: 线上环境, 默认prod
 *  openid // openid
 *  gameid // 小游戏ID
 *  gameversion // 游戏版本号
 *  success: (res) => {} // 成功回调
 *  fail: (res) => {} // 失败回调
 * }
 */
const wxLogin = (opts = {}) => {
  let { appid, gameversion, openid } = opts
  let getUserInfo = wxGetUserInfo()
  let getSystemInfo = wxGetSystemInfo()
  let getNetworkType = wxGetNetworkType()

  Promise.all([getUserInfo, getSystemInfo, getNetworkType]).then(res => {
    let { nickName, avatarUrl, gender, province, city} = res[0]
    let { system, screenWidth, screenHeight } = res[1]
    let networkType = res[2]
    let time = formatTime(new Date())
    let os = wxGetOS(system.split(' ')[0])
    let osVersion = system.split(' ')[1]
  
    httpApi._post(INTF_USER, {
      APP_ID: appid || '',  // 小游戏ID
      OPEN_ID: openid || '', //微信用户OPEN_ID
      TIME: time, // 用户客户端时间
      OS: os, // 操作系统类型:1-android,2-iOS,3-WINPHONE
      OS_VERSION: osVersion, //系统版本
      SDK_VERSION: '1.0.0', // SDK版本
      GAME_VERSION: gameversion || 'v1.3.1', //游戏版本号
      NETWORK_TYPE: networkType, //网络环境:0-没有网络,1-WIFI,2-2G,3-3G,4-WAP,5-Other
      SCREEN_WIDTH: screenWidth, // 屏幕分辨率:宽
      SCREEN_HEIGHT: screenHeight, // 屏幕分辨率:宽
      NICK_NAME: nickName, // 微信用户昵称
      ICON: avatarUrl, //头像地址
      SEX: gender, // 性别 0无 1男 2女
      PROVINCE: province, // 省份
      CITY: city // 城市
    }).then(res => {
      opts.success && opts.success(res)
    }).catch(res => {
      opts.fail && opts.fail(res)
    })
  })
}

module.exports = {
  wxLogin
}