// pages/work/admin/stockList/detail/index.js
const {POST,GET} = require('../../../../../utils/network.js')
const {validate,show,showSuccess} = require('../../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    detail:'',
    successvisiable:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id||''
    this.setData({
      id:id
    })
    this.requestToDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  successConfirm(){
    let pages = getCurrentPages();
    if (pages.length > 2) {
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        current: 1,
        searchValue: ""
      })
      prevPage.requestToList()
    }
    wx.navigateBack({})
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

  requestToDetail(){
    let that = this
    GET('warehousing/id',{id:this.data.id},true,(flag,data,des)=>{
      if(flag){
        that.setData({
          detail:data
        })
      }else{
        show(des)
      }
    })
  },

  clickToSubmit(e){
    let that = this
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '确认撤回该入库单',
      showCancel: true,
      success: (result) => {
        if(result.confirm){
          that.requestToBack()
        }
      },
      title: '提醒',
    })
  },

  requestToBack(){
    let that = this
    POST('warehousing/a/recall',{id:this.data.id},true,(flag,data,des)=>{
      if(flag){
        this.setData({
          successvisiable: true
        })
      }else{
        show(des)
      }
    })
  }
})