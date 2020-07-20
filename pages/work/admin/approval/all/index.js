// pages/work/admin/approval/all/index.js
const {GET,POST} = require('../../../../../utils/network.js')
const {show,showSuccess,validate} = require('../../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successvisiable:false,
    orderId:'',
    detail:{},
    applyRemark:"",
    flag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id||''
    if(validate.isNotEmpty(id)){
      this.setData({
        orderId: id,
        flag: options.flag
      })
      this.requestToDetail()
    }
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
  requestToDetail(){
    let that = this
    GET('apply/id',{id:this.data.orderId},true,(flag,data,des)=>{
      if(flag){
        // data.applyDtls.map(obj=>{
        //   obj.checked=true
        // })
        if (data.deliveryImg){
          data.deliveryImg = data.deliveryImg.split(",")
        }
        if (data.appendix) {
          data.appendix = data.appendix.split(",")
        }
        that.setData({
          detail: data
        })
      }else{
        show(des)
      }
    })
  },
})