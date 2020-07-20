// pages/work/admin/dataAdmin/banner/add/index.js
const {validate,show,showSuccess} = require('../../../../../../utils/util.js')
const {POST,GET,UPLOAD} = require('../../../../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerId:'',
    detail:{},
    successShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id||''
    if (validate.isEmpty(id)){
      wx.setNavigationBarTitle({
        title: '添加Banner',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '修改Banner',
      })
      this.data.bannerId = id
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
    console.log(this.data.bannerId);
    
    GET('banner/id',{id:this.data.bannerId},true,(flag,data,des)=>{
      if (flag){
        that.setData({
          detail:data||{}
        })
      }else{
        show(des)
      }
    })
  },

  clickToAdd(){
    let that = this
    wx.chooseImage({
      count: 1,
      success: (result) => {
        let path = result.tempFilePaths[0]
        UPLOAD(path,{parentType:'banner'},true,(flag,data,des)=>{
          if (flag){
            showSuccess('上传成功')
            that.setData({
              ['detail.img']:data[0].filePath,
              ['detail.imgPath']:data[0].fullPath
            })
          }else{
            show('上传失败')
          }
        })
      },
    })
  },

  clickToPreview(){
    let path = this.data.detail.imgPath||''
    if(validate.isNotEmpty(path)){
      wx.previewImage({
        urls: [path],
        current: 0
      })
    }else{
      show('图片不存在')
    }
  },

  clickToSave(){
    let id = this.data.bannerId
    let that = this
    if (validate.isEmpty(id)){
      POST('banner/a/add',{img:that.data.detail.img},true,(flag,data,des)=>{
        if(flag){
          that.setData({
            successShow:true
          })
        }else{
          show(des)
        }
      })
    }else{
      POST('banner/a/edit',{img:that.data.detail.img,id:id},true,(flag,data,des)=>{
        if(flag){
          that.setData({
            successShow: true
          })
        }else{
          show(des)
        }
      })
    }
  },
  successConfirm() {
    let pages = getCurrentPages();
    if (pages.length > 2) {
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        categoryCurrent: 1
      })
      prevPage.requestToList()
    }
    wx.navigateBack({})
  },
})