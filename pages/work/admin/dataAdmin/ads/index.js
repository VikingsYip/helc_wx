// pages/work/admin/dataAdmin/ads/index.js
const {GET,POST} = require('../../../../../utils/network.js')
const {validate,show,showSuccess} = require('../../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    current:1,
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
    let that = this
    wx.getSystemInfo({
      complete: (res) => {
        that.setData({
          scrollHeight:res.windowHeight - (res.windowWidth/750) * 140
        })
      },
    })
    this.requestToList()
  },
  scrollMore(){
    this.requestToList(false)
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

  clickToAdd(e){
    wx.navigateTo({
      url: '/pages/work/admin/dataAdmin/ads/add/index',
    })
  },

  clickToChange(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let id = this.data.list[index].id
    wx.navigateTo({
      url: '/pages/work/admin/dataAdmin/ads/add/index?id=' + id,
    })
  },

  clickToDelete(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let id = this.data.list[index].id
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '确定删除该公告？',
      showCancel: true,
      success: (result) => {
        if (result.confirm){
          that.requestToDelete(id)
        }
      },
      title: '提醒',
    })
  },

  requestToDelete(id){
    let that = this
    POST('notice/a/delete',{id:id},true,(flag,data,des)=>{
      if(flag){
        showSuccess('删除成功')
        that.requestToList()
      }else{
        show(des)
      }
    })
  },

  requestToList(isShow = true){
    let that = this
    var current = this.data.current
    GET('notice/page', { current: current, size: 30 , name: '' }, isShow ,(flag,data,des)=>{
      if(flag){
        that.setData({
          list:data.records||[],
          current: Number(current) + 1,
        })
      }else{
        show(des)
      }
    })
  }
})