// pages/work/supplier/stockOut/detail/index.js

const { GET, POST, UPLOAD } = require('../../../../../utils/network.js')
const { show, setToken, validate, formatWeek, showSuccess } = require('../../../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    successShow: false,
    detail: {},
    title:"",
    flag:false,
    imageArr:[],
    remark:"",
    logArr:[],
  },
  clickToAll(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/work/admin/approval/all/index?id=' + id,
    })
  },
  getLog() {
    let that = this
    GET('applyRecord/p/page', { applyId: this.data.id }, true, (flag, data, des) => {
      if (flag) {
        this.setData({
          logArr: data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      flag: options.flag,
      id: options.id,
      userInfo: app.globalData.userInfo
    })

    if(this.data.flag){
      wx.setNavigationBarTitle({
        title: '出库单处理'
      })
    }

    this.getDetail()
  },
  getDetail() {
    var that = this;
    var id = this.data.id;
    GET("apply/id", { id: id }, true, (flag, data, des) => {
      if (flag) {
        if (data.deliveryImg){
          data.deliveryImg = data.deliveryImg.split(",")
        }
        if (data.appendix) {
          data.appendix = data.appendix.split(",")
        }
        that.setData({
          state: data.status,
          detail: data
        })
        that.getLog()
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

  },

  clickToBack(e) {
    var id = this.data.id
    var remark = this.data.remark;
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要撤回吗？',
      success: function (sm) {
        if (sm.confirm) {
          POST("apply/p/backHeadquarters", { id: id, rejectReason: remark }, true, (flag, data, des) => {
            if (flag) {
              that.setData({
                title: "退回成功",
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
  successConfirm() {
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
  clickToDetail(e) {
    var id = this.data.id;
    var remark = this.data.remark;
    var that = this;
    POST("apply/p/confirmOrder", { id: id, remark: remark }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          title: "确认成功",
          successShow: true
        })
      } else {
        show(des)
      }
    })
  },
  clickToDelivery(e) {
    var id = this.data.id;
    var remark = this.data.remark;
    var imageArr = this.data.imageArr;
    var that = this;
    POST("apply/p/confirmDelivery", { 
        id: id, 
        deliveryRemark:remark,
        imgs: imageArr.join(",")
     }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          title: "发货成功",
          successShow: true
        })
      } else {
        show(des)
      }
    })
  },
  clickToBackDelivery(e){
    var id = this.data.id;
    var that = this;
    POST("apply/p/backDelivery", { id: id }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          title: "撤回成功",
          successShow: true
        })
      } else {
        show(des)
      }
    })
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
})