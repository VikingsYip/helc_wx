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
    rejectReason:"",
  },
  inputToChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },
  clickToFinish(){
    var id = this.data.id;
    var that = this;
    POST('warehousing/p/confirmFinish', { id }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          successvisiable: true
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
        searchValue: "",
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
  clickToSubmit(){
    var id = this.data.id;
    var that = this;
    POST('warehousing/p/confirm',{ id }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          successvisiable: true
        })
      } else {
        show(des)
      }
    })
  },
  clickToBack(){
    var id = this.data.id;
    var rejectReason = this.data.rejectReason;
    if (!rejectReason){
      show("拒绝理由不能为空")
      return;
    }
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要退回？',
      success(res) {
        if (res.confirm) {
          POST('warehousing/p/ackHeadquarters', { id,rejectReason}, true, (flag, data, des) => {
            if (flag) {
              that.setData({
                successvisiable: true
              })
            } else {
              show(des)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
})