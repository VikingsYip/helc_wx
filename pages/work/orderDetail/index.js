// pages/work/orderDetail/index.js

const { GET, POST, UPLOAD } = require('../../../utils/network.js')
const { show, setToken, validate, formatWeek, showSuccess } = require('../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    successShow:false,
    detail:{},
    title:"",
    feedback:"",
    imageArr: [],
    logArr:[],
    flag: false,
    againBack: false,
    remark:''
  },
  clickToAgain(e) {
    var id = this.data.id;
    wx.navigateTo({
      url: '/pages/work/toApply/index?againId=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
     this.setData({
       flag: options.flag,
       id: options.id,
       userInfo: app.globalData.userInfo
     })
     this.getDetail()
    this.getLog()
  },
  getLog() {
    let that = this
    GET('applyRecord/u/page', { applyId: this.data.id }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          logArr: data
        })
      } else {
        show(des)
      }
    })
  },
  getDetail(){
    var that = this;
    var id = this.data.id;
    GET("apply/id", { id:id }, true, (flag, data, des) => {
      if (flag) {
        if (data.deliveryImg){
          data.deliveryImg = data.deliveryImg.split(",")
        }
        if (data.appendix) {
          data.appendix = data.appendix.split(",")
        }

        that.setData({
          state: data.status,
          detail:data
        })
      } else {
        show(des)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  inputToChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.againBack){
      let pages = getCurrentPages();
      if (pages.length > 2) {
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          pageNo: 1,
          searchValue: ""
        })
        prevPage.getList()
      }
      wx.navigateBack({})
    }
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

  clickToDelete(e){
    var id = this.data.id;
    var remark = this.data.remark;
    var that = this
    if (this.data.remark=='') {
      show('请填写撤回备注');
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '确定要撤回吗？',
      success: function (sm) {
        if (sm.confirm) {
          POST("apply/u/recall", { id: id,remark:remark }, true, (flag, data, des) => {
            if (flag) {
              that.setData({
                title: "撤回成功",
                successShow: true
              })
            } else {
              show(des)
            }
          })
          // 用户点击了确定 可以调用删除方法了
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  successConfirm(){
    let pages = getCurrentPages();
    if (pages.length > 2) {
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        pageNo: 1,
        searchValue: ""
      })
      prevPage.getList()
    }
    wx.navigateBack({})
  },
  clickToBack(e){
    wx.navigateBack({
      delta: 1,
    })
  },
  clickToReceiptFeedback(){
    var id = this.data.id;
    var that = this;
    
  },
  clickToReceipt(){
    var id = this.data.id
    var that = this
    var imageArr = this.data.imageArr;
    var feedback = this.data.feedback;
    if (imageArr.length==0) {
      show('请上传收货图片');
      return false;
    }
    POST("apply/u/confirmReceipt", { id, feedback, appendix: imageArr.join(",") }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          title: "收货成功",
          successShow: true
        })
      } else {
        show(des)
      }
    })
    // POST("apply/u/confirmReceipt", { id: id }, true, (flag, data, des) => {
    //   if (flag) {
    //     that.setData({
    //       title: "收货成功",
    //       successShow: true
    //     })
    //   } else {
    //     show(des)
    //   }
    // })
  }
})