// pages/tabBar/user/user.js
const {GET,POST} = require('../../../utils/network.js')
const {show} = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userType:{
      'ROLE_SUP':"供应商",
      'ROLE_ADMIN':"总公司管理员",
      'ROLE_DOWN_ADMIN': "分公司管理员",
      'ROLE_UP_ADMIN': "总公司领导",
      'ROLE_USER':"普通用户",
      'ROLE_NO':"无"
      
    },
  },
  toEdit(){
    wx.navigateTo({
      url: '/pages/register/user/index?edit=1',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  message(){
      wx.requestSubscribeMessage({
        tmplIds: ["kAAZjXhdEYb0aBCz_yalZ6nk2Qf07SGh8rZc5DdIDmU"],
        success: (res) => {
          if (res["kAAZjXhdEYb0aBCz_yalZ6nk2Qf07SGh8rZc5DdIDmU"] == "reject") {
            wx.showModal({
              complete: (res) => { },
              confirmText: '关闭',
              content: '您取消了消息订阅，后续可以在右上角的设置中手动开启',
              showCancel: false,
              success: (result) => {
               
              },
              title: '提醒',
            })
          } else {
            wx.showModal({
              complete: (res) => { },
              confirmText: '关闭',
              content: '订阅成功',
              showCancel: false,
              success: (result) => {

              },
              title: '提醒',
            })
          }
        },
        fail(err) {

        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    GET('user/token/user', {}, false, (flag, data, des) => {
      if (flag) {
        that.setData({
          userInfo: data
        })
        app.globalData.userInfo = data
      } else {
        show(des)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.requestToUserInfo()
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

  },

  requestToUserInfo(){
    let that = this
    GET('user/token/user',{},false,(flag,data,des)=>{
      if (flag) {
        that.setData({
          userInfo:data
        })
        app.globalData.userInfo = data
      }else{
        show(des)
      }
    })
  },

  clickToPreview(e){
    let path = this.data.userInfo.workingImg
    wx.previewImage({
      urls: [path],
    })
  }
})