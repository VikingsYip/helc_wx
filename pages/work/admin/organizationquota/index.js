// pages/work/admin/organizationquota/index.js
const { user, validate, show, showSuccess } = require('../../../../utils/util.js')
const { POST, GET } = require('../../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  clickToChange(e){
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/work/admin/organizationquota/data/index?id=' + id + "&orgName=" + name,
    })
  },
  requestToOrganList() {
    let that = this
    GET('organization/list', { corporateType: 0 }, true, (flag, data, des) => {
      if (flag) {
        this.setData({
          list:data
        })
      } else {
        show(des)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestToOrganList()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})