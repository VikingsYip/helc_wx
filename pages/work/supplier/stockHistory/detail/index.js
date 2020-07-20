// pages/work/supplier/stockHistory/detail/index.js
const { POST, GET } = require('../../../../../utils/network.js')
const { validate, showSuccess, show } = require('../../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
     id:"",
     data:{},
    current:1,
    records:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id: options.id
      })
      this.getDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getDetail(isShow = true){
    var that= this;
    GET('brochure/id', { id: this.data.id}, isShow, (flag, data, des) => {
      // wx.stopPullDownRefresh()
      // wx.hideNavigationBarLoading()
      if (flag) {
         this.setData({
           data: data,
         })
         that.getHistory()
      } else {
        show(des)
      }
    })
  },
  getHistory(isShow = true){
    var that = this
    var current = this.data.current;
    GET('brochureRecord/a/page', { brochureId: this.data.id,current: current}, isShow, (flag, data, des) => {
      // wx.stopPullDownRefresh()
      // wx.hideNavigationBarLoading()
      if (flag) {
        if (data.length!=0){
          this.setData({
            records: that.data.records.concat(data.records),
            current: Number(current) + 1
          })
        }
        
      } else {
        show(des)
      }
  })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getHistory(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})