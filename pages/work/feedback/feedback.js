// pages/work/feedback/feedback.js

const { GET, POST, UPLOAD} = require('../../../utils/network.js')
const { show, setToken, validate, formatWeek, showSuccess } = require('../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailShow:false,
    userInfo:{},
    value:"",
    imageArr:[]
  },
  handleConfirm(){
     wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      GET('user/token/user', {}, false, (flag, data, des) => {
        if (flag) {
          that.setData({
            userInfo: data
          })
          app.globalData.userInfo = data
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  valueInput(e){
    this.setData({
      value: e.detail.value
    })
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
  clickToUploadImage(e) {
    let that = this
    wx.chooseImage({
      count: 1,
      fail: (res) => { },
      success: (result) => {
        let path = result.tempFilePaths[0]
        that.requestToUploadImage(path)
      },
    })
  },
  requestToUploadImage(path) {
    let that = this
    UPLOAD(path, { parentType: 'user' }, true, (flag, data, des) => {
      if (flag) {
        let p = data[0].fullPath
        var imageArr = that.data.imageArr;
        imageArr.push(p)
        that.setData({
          imageArr: imageArr
        })
        showSuccess("上传成功")
      } else {
        show(des)
      }
    })
  },
  clickToReviewImage(e) {
    var index = e.target.dataset.index
    let image = this.data.imageArr[index];
    wx.previewImage({
      urls: [image],
      current: 0
    })
  },
  tijiao(){
    var that = this;
    var content = this.data.value.trim();
    if (validate.isEmpty(content)) {
      show('意见不能为空')
      return;
    }
    POST('opinion/add', {
      content: content,
      appendix: this.data.imageArr.join(",")
    }, true, (flag, data, des) => {
      that.setData({
        detailShow:true
      }) 
    })
  }
})