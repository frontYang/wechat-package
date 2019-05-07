
/* 基础配置 */
const { CONFIG , TOAST, RANDOM_TEXT} = require('./config.js')


/* 用CONFIG.isConsole来控制可否打印 */
const log = (...str) => {
  if(CONFIG.isConsole) {
    console.log(...str)
  }
}

/**
 * 判断是否是IOS
 */
const isIos = () => {
  const sys = getSystemInfo();
  return /iphone|ios/i.test(sys.platform);
}

/**
 * new Date 区分平台，IOS下不能解析  ‘-’ 连接符
 * @param {Object} opts 
 * @param {String/Number} type 
 * opts: {
 *  year: '', // 年
 *  month: '', // 月
 *  day: '', // 日
 *  hours: '', // 时
 *  minutes: '', // 分
 *  seconds: '',  // 秒
 * }
 * 
 * type: 1, 格式为  年月日
 * type: 2, 格式为  年月日时分秒
 */
const newDate = (opts, type) => {
  let cur = type == 1 ? `${opts.year}-${opts.month}-${opts.day}` : `${opts.year}-${opts.month}-${opts.day} ${opts.hours}:${opts.minutes}：${opts.seconds}`
  if (isIos()) {
    cur = type == 1 ? `${opts.year}/${opts.month}/${opts.day}` : `${opts.hours}:${opts.minutes}：${opts.seconds}`
  }
  return new Date(cur)
}

/**
 * 一维数组转多维
 * @param {Array} 数组 array
 * @param {Number} 几维 n, 默认7
 */
const getMulArray = (array, n) => {
  let newArr = [] 
  n = n ? n : 7
  array.forEach(function(item, index) {
    let num = Math.floor(index / n) 
    if (!newArr[num]) {
        newArr[num] = []
    }    
    newArr[num].push(item)
  }) 

  return newArr
}

/**
 * 时间格式化
 * @param {Date} date 日期 
 * @param {Number} type 类型 1：年月日时分秒 2： 年月日
 */
const formatTime = (date, type) => {
  let formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }

  let sign = isIos() ? '/' : '-'
  let year = date.getFullYear()
  let month = date.getMonth() + 1 
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  if(type == 1){
    return [year, month, day].map(formatNumber).join(sign) + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } else if (type == 2){
    return [year, month, day].map(formatNumber).join('-')
  }else{
    return [year, month, day].map(formatNumber).join('')
  }
  
}

/**
 * 获取完整接口链接
 * @param {string} url [接口链接]
 */
const getUrl = (url) => {
  if (url.indexOf('.//' == -1)) {
    url = CONFIG.baseUrl + url
  }
  return url
}

/**
 * wx.request 封装
 * @param {string} url [接口链接]
 * @param {object} param [request data]
 * @param {object} other [其余参数]
 * @param {boolean} flg 是否统一错误处理，兼容旧版，true：统一错误处理， false：不统一错误处理
 */
const http = ({ url, param, ...other, flg }) => {
  let timeStart = Date.now()

  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        /* 'content-type': 'application/json' */
        'content-type': 'application/x-www-form-urlencoded'
      },
      ...other,
      success: res => {
        log(url, `param: ${JSON.stringify(param)}`, res.data, `time: ${Date.now() - timeStart}ms`)
        if(flg){
          res.data.code == 0 ? resolve(res.data) : reject(res.data)
        }else {
          resolve(res.data)
        }
      },
      fail: res => {
        log(url, `param: ${JSON.stringify(param)}`, res, `time: ${Date.now() - timeStart}ms`)   
        wx.showToast({
          title: TOAST.overtime,
          icon: 'none'
        })
        if(!flg){
          reject(res.data)
        }
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }).catch(res => {
    if(flg){
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    }
  })
}

const _get = (url = '', param = {}, flg = false) => {
  return http({
    url,
    param,
    flg
  })
}

const _post = (url = '', param = {}, flg = false) => {
  return http({
    url,
    param,
    method: 'post',
    flg
  })
}

/* 获取字符串长度 */
const getStrLen = (str) => {
  if (str == null) return 0;
  if (typeof str != 'string') {
    str += '';
  }
  return str.replace(/[^\x00-\xff]/g, '01').length
}

/**
 * 获取元素信息
 * @param {string} id  元素id
 * @param {object} _this 当前作用域
 */
const domInter = (value, _this) => {
  return new Promise((resolve, reject) => {
    let query = wx.createSelectorQuery().in(_this)
    query.select(value).boundingClientRect((res) => {
      if(res){
        log(JSON.stringify(res))
        resolve(res)
      }else {
        reject(res)
      }
    }).exec()
  }).catch(res => {
    log('获取元素失败')
  })
}

/**
 * 获取系统信息
 */
const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: (res) => {
        resolve(res)
      },
      fail: (res) => {
        reject(res)
      }
    })
  }).catch(res => {
    console.log(res)
  })
}

/**
 * 获取网络类型
 */
const getNetworkType = () => {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        resolve(networkType)
      },
      fail: (res) => {
        reject(res)
      }
    })
  }).catch(res => {
    console.log(res)
  })
}

/**
 * 获取随机取数组内一个值
 */
const getRandomText = () => {
  let n = Math.floor(Math.random() * RANDOM_TEXT.length + 1) - 1
  return RANDOM_TEXT[n]
}

module.exports = {
  _get: _get,
  _post: _post,
  newDate: newDate,
  formatTime: formatTime,
  getMulArray: getMulArray,
  getRandomText: getRandomText,
  getNetworkType: getNetworkType,
  domInter: domInter,
  getStrLen: getStrLen
}