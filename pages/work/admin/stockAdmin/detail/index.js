// pages/work/admin/stockAdmin/detail/index.js
const { user, validate, show, showSuccess } = require('../../../../../utils/util.js')
const { POST, GET } = require('../../../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    detail:{},
    funVisiable: false,
    successVisiable: false,
    title:"",
    type:"",
    num:0,
    remark:""
  },
  modelShow(e){
    var type = e.currentTarget.dataset.type;
    this.setData({
      num:0,
      funVisiable: true,
      type: type,
      title: (type=="ruku") ? "发起入库" : "库存调配"
    })
  },
  inputToChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },
  funConfirm(){
    var that = this;
    var remark = this.data.remark;
    var warehousingType = this.data.type == "ruku" ? "RKLX01" : "RKLX02";
    var warehousingNum 	= this.data.num;
    var brochureId = this.data.id;
    POST('warehousing/a/add', { remark, warehousingType, warehousingNum, brochureId}, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          funVisiable: false,
          successVisiable: true
        })
      } else {
        show(des)
      }
    })
     return false;
  },
  reduceNum(){
     var num = this.data.num;
     var type = this.data.type;
     num = num - 50;
     if(type=="ruku"){
        if(num<0){
           show("入库不能小于0")
           return;
        }
     }else{
       if( num < 0){
         show("调配不能小于0")
         return;
       }
     }
     this.setData({
       num : num
     })
  },
  addNum(){
    var num = this.data.num;
    var type = this.data.type;
    num = num + 50;
    if (type == "ruku") {
      
    } else {
      var max = Number(this.data.detail.stockNum);
      if (num > max) {
        show("调配不能大于当前库存量")
        return;
      }
    }
    this.setData({
      num: num
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
     this.setData({
       id: id
     })

    this.requestToDetail(id)
  },
  requestToDetail(id) {
    let that = this
    GET('brochure/id', { id: id }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          detail: data
        })
      } else {
        show(des)
      }
    })
  },
  successConfirm(){
     wx.navigateBack({
       
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

  }
})