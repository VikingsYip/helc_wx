// pages/work/admin/dataAdmin/category/index.js
const { GET, POST, POSTJSON } = require('../../../../../utils/network.js')
const { show, validate, showSuccess } = require('../../../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSave: false,

    records: [],
    currentIndex: -1,
    editName: '',
    searchValue: '',
    editName: "",
    editCode: '',
    userInfo: {}
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
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let scrollHeight = res.windowHeight - res.windowWidth / 750 * (100)
        that.setData({
          scrollHeight: scrollHeight
        })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickToAdd(e) {
    this.setData({
      showSave: true,
      currentIndex: -1
    })
  },

  requestToOrganList() {
    let that = this;
    GET('dropdown/pcode', { pcode: "HDGM" }, true, (flag, data, des) => {
      if (flag) {
        console.log(data);

        that.setData({
          records: data
        })
      } else {
        show(des)
      }
    })
  },

  clickToHide(e) {
    this.setData({
      editName: "",
      showSave: false,
      currentIndex: -1
    })
  },

  clickToSave(e) {
    let that = this
    let name = this.data.editName.trim()

    let code = this.data.editCode.trim()

    if (validate.isEmpty(name)) {
      show('名称不能为空')
      return
    }

    wx.showLoading({
      title: '请求中...',
      mask: true
    })

    if (this.data.currentIndex == -1) {
      POSTJSON('dropdown/add', { "code": code, "name": name, "pcode": "HDGM" }, true, (flag, data, des) => {
        if (flag) {
          that.alertSuccess()
          that.requestToOrganList()
          wx.hideLoading()
        } else {
          show(des)
          wx.hideLoading()
        }
      })
    } else {
      let id = this.data.records[this.data.currentIndex].id
      POSTJSON('dropdown/edit', { "name": name, "id": id }, true, (flag, data, des) => {
        if (flag) {
          that.alertSuccess()
          that.requestToOrganList()
          wx.hideLoading()
        } else {
          show(des)
          wx.hideLoading()
        }
      })
    }

  },

  clickToDelete(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index
    })
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '确定删除该类别？',
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          that.requestToDelete()
        }
      },
      title: '提醒',
    })
  },

  requestToDelete() {
    let id = this.data.records[this.data.currentIndex].id
    let that = this
    GET('dropdown/delete', { id: id }, true, (flag, data, des) => {
      if (!flag) {
        show(des)
      } else {
        showSuccess("删除成功")
        that.requestToOrganList()
      }
    })
  },

  alertSuccess() {
    let that = this
    wx.showToast({
      title: '保存成功',
      duration: 1500,
      icon: 'success',
      mask: true,
      complete: (res) => {
        that.setData({
          showSave: false,
          currentIndex: -1,
        })
      },
    })
  },

  clickToChange(e) {
    let index = e.currentTarget.dataset.index
    let name = this.data.records[index].name
    this.setData({
      editName: name,
      showSave: true,
      currentIndex: index
    })
  },

  inputToChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },

})