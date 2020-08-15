// pages/work/admin/dataAdmin/banner/index.js
const {POSTJSON,POST,GET} = require('../../../../../utils/network.js')
const {show,showSuccess,validate,imgReady} = require('../../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
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
    this.requestToList()
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

  clickToChange(e){
    let index = e.currentTarget.dataset.index
    let id = this.data.list[index].id
    wx.navigateTo({
      url: '/pages/work/admin/dataAdmin/banner/add/index?id=' + id,
    })
  },

  clickToAdd(e){
    if (this.data.list.length >=4){
      show("最多只能添加4张")
    }else{
      wx.navigateTo({
        url: '/pages/work/admin/dataAdmin/banner/add/index',
      })
    }
  },

  clickToDelete(e){
    let index = e.currentTarget.dataset.index
    let that = this
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '确定删除该图片？',
      showCancel: true,
      success: (result) => {
        if (result.confirm){
          that.requestToDelete(index)
        }
      },
      title: '提醒',
    })
  },

  requestToDelete(index){
    let id = this.data.list[index].id
    let that = this
    POST('banner/a/delete',{id:id},true,(flag,data,des)=>{
      if(flag){
        showSuccess('删除成功')
        that.requestToList()
      }else{
        show(des)
      }
    })
  },

  requestToList(){
    let that = this
    GET('banner/list',{},true,(flag,data,des)=>{
      wx.stopPullDownRefresh()
      if (flag){
        if(data){
          for(let item in data){
            wx.getImageInfo({
			      	src: data[item].imgPath,
			      	success: function (res) {
                data[item].imgWidth = res.width
                data[item].imgHeight = res.height
                that.setData({
                  list:data||[]
                })  
              }
            })
          }
        }
        
      }else{
        show(des)
      }
    })
  }
})