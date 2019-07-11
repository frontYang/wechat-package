
/**
 * 上拉加载，下拉刷新
 * 使用方式：
 *  引入：const { loadMore } = require('load_more.js')
 *  onLoad中使用：loadMore(this, (data) => { 
 *                  // 回调函数
 *                })
 *  onPullDownRefresh中使用：this.upper()
 *  在上拉监听函数 或者 onReachBottom 中使用： this.lower()
 * 
 * 当前页面data中需要注册
 * intf_name: '需要请求的接口名（CONFIG.INTF中的接口名称）'
 * params: { 
 *  page: 'Number|初始页'
 *  size: 'Number|每页加载的条数'
 * }
 */

const { INTF } = require('config.js')
const { api } = require('util.js')

export const loadMore = (_this, callback) => {
  // 初始化数据
  _this.setData({
    list: [], // 数据 
    totalPage: 1, // 总页数
    total: 0, // 总数量
    loading: 1, // 加载状态,1: 加载中，2：加载完成
  })

  // 加载数据
  _this.getData = (type) => {
    wx.showLoading({
      title: '加载中'
    })

    return api._post(INTF[_this.data.intf_name], _this.data.params).then(res => {
      wx.hideLoading()

      if (res.code != 0) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        return
      }

      let list_name = _this.data.list_name || 'list'
      let list = _this.data.list

      if (type != 1) {
        // 加载
        list = list.length > 0 ? list.concat(res.data[list_name]) : res.data[list_name]
      } else {
        // 刷新
        list = res.data[list_name]
      }

      _this.setData({
        list,
        totalPage: res.data.total_pages || res.data.totalPage,
        loading: list.length < _this.data.params.size ? '2' : '1'
      })

      callback && callback(res.data)
    })
  }

  /* 上拉加载 */
  _this.lower = () => {
    console.log(`上拉加载`)
    let curPage = _this.data.params.page + 1
    let totalPage = _this.data.totalPage

    if (curPage >= totalPage) {
      console.log(`没有更多数据了`)
      _this.setData({
        loadType: 2
      })
      wx.hideLoading()

      return
    }
    _this.setData({
      ['params.page']: curPage
    })

    return _this.getData()
  }

  /* 下拉刷新 */
  _this.upper = (callback) => {
    console.log(`下拉刷新`)

    _this.setData({
      ['params.page']: 1
    })

    return _this.getData(1, callback)
  }

  // 默认加载第一页
  return _this.getData()
}