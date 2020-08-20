// pages/work/message/message.js
const {
  validate,
  formatTime,
  show
} = require('../../../utils/util.js')
const {
  GET
} = require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeId: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || ''
    if (validate.isNotEmpty(id)) {
      this.data.noticeId = id
      this.requestToDetail()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);

      },
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

  requestToDetail() {
    let that = this
    GET('notice/id', {
      id: this.data.noticeId
    }, true, (flag, data, des) => {
      if (flag) {       
        data.date = data.createTime
        that.setData({
          detail: data
        })
      } else {
        show(des)
      }
    })
  },
  onHandledownloadFile(e) {
    // console.log(e)
    // console.log(this.data.detail)
    let index = e.currentTarget.dataset.index;
    console.log(this.data.detail.appendixs[index].urlPath);

    wx.downloadFile({
      url: this.data.detail.appendixs[index].urlPath, //仅为示例，并非真实的资源
      success(res) {
        console.log(res)
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      }
    })
  }
})