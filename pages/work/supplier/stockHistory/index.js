// pages/work/supplier/stockIn/index.js
const { POST, GET } = require('../../../../utils/network.js')
const { validate, showSuccess, show } = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    records: [],
    searchValue:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestToList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    this.setData({
      current: 1,
      searchValue:"",
    })
    this.requestToList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.requestToList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/work/supplier/stockHistory/detail/index?id=' + id,
    })
  },

  requestToList(isShow = true) {
    let that = this
    var current = this.data.current
    
    if (current == 1) {
      this.setData({
        records: []
      })
    }
    var records = this.data.records
    GET('brochure/p/page', { current: current, size: 30, name: this.data.searchValue }, isShow, (flag, data, des) => {
      // wx.stopPullDownRefresh()
      // wx.hideNavigationBarLoading()
      if (flag) {
        that.setData({
          records: records.concat(data.records || []),
          current: Number(current) + 1
        })
      } else {
        show(des)
      }
    })
  },
  inputToChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },
  searchConfirm: function () {
    this.setData({
      current: 1,
    })
    this.requestToList()
  },
})