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
    imageArr:[],
    currentId:undefined,
    isAdd:true,
    record:{}
  },
  handleConfirm(){
     wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        currentId:options.id,
        isAdd:false
      })
      this.requestToDetail(options.id)
    }
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
    console.log(this.data.userInfo)
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
        console.log(data)
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
  requestToDetail(id){
    let that = this
    GET("opinion/id", {id:id}, true , (flag, data, des) =>{
      if (flag) {
        if(data.appendix) {
          let imageArr = data.appendix.split(";")
          data.imageArr = imageArr;
        }
        this.setData({
          record:data
        })
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
      wx.showModal({
        complete: (res) => { },
        confirmText: '关闭',
        content: '感谢您提出的意见和建议',
        showCancel: false,
        success: (result) => {
          wx.navigateBack({})
        },
        title: '提醒',
      })
    })
  },
  receive(){
    let that = this;
    GET('opinion/receive',{id:this.data.currentId},true, (flag, data, des) => {
      if(flag){
        wx.showModal({
          complete: (res) => { },
          confirmText: '关闭',
          content: '操作成功',
          showCancel: false,
          success: (result) => {
            wx.navigateBack({})
          },
          title: '提醒',
        })
      }
    })
  }
})