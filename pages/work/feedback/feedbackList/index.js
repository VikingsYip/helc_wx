// pages/work/feedback/feedbackList/index.js
const { validate, show, showSuccess } = require('../../../../utils/util.js')
const { GET } = require('../../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    size: 30,
    records: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestToList(true)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        var query = wx.createSelectorQuery()
        // query.select("#isTC").boundingClientRect()
        query.exec(function (res1) {
          that.setData({
            //计算scroll需要的高度
            scrollHeight: res1[1].top - res1[0].bottom - (res.screenWidth/750) * 60,
          })
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.requestToList(true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.current = 1
    this.requestToList(false)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.current++
    this.requestToList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //点击跳转详情
  clickToMessageDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/work/feedback/feedback?id=' + id,
    })
  },

  requestToList(isShow = true) {
    let that = this
    let list = that.data.records || []
    GET('opinion/a/page', { current: this.data.current, size: this.data.size }, isShow, (flag, data, des) => {
      // wx.stopPullDownRefresh()
      if (flag) {
        if (that.data.current == 1) {
          list = []
        }
        list = list.concat(data.records || [])
        that.setData({
          records: list
        })
      } else {
        show(des)
      }
    })
  },

  clickToAdd() {
    wx.navigateTo({
      url: '/pages/work/feedback/feedback'
    })
  }
})