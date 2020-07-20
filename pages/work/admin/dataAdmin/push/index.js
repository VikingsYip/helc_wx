// pages/work/admin/dataAdmin/push/index.js
const {show,showSuccess} = require('../../../../../utils/util.js')
const {GET,POST} = require('../../../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList:[],
    categoryIndex:0,
    categoryCurrent:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  scrollMoreL(){
    this.requestToCategory(false)
  },
  scrollMoreR(){
    this.requestToPopsById(true,false)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getSystemInfo({
      complete: (res) => {
        that.setData({
          scrollHeight:res.windowHeight - (res.windowWidth/750) * (80 + 90)
        })
        that.requestToCategory()
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

  clickToAdd(e){
    wx.navigateTo({
      url: '/pages/work/admin/dataAdmin/push/add/index',
    })
  },

  clickToChange(e){
    let index = e.currentTarget.dataset.index
    let arr = this.data.categoryList[this.data.categoryIndex].arr
    let id = arr[index].id
    wx.navigateTo({
      url: '/pages/work/admin/dataAdmin/push/add/index?id=' + id,
    })
  },

  clickToDelete(e){
    let index = e.currentTarget.dataset.index
    let arr = this.data.categoryList[this.data.categoryIndex].arr
    let category = arr[index]
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '确定删除该宣传品？',
      showCancel: true,
      title: '提醒',
      success: (res) => {
        if (res.confirm) {
          POST('brochure/a/delete', { id: category.id }, true, (flag, data, des) => {
            if (flag) {
              wx.showToast({
                title: '删除成功',
                duration: 1500,
                icon: 'success',
                mask: true
              })
            } else {
              show(des)
            }
          })
        }
      }
    })
  },

  /**请求类别列表 */
  requestToCategory(isShow = true){
    let that = this
    var categoryCurrent = this.data.categoryCurrent;
    if (categoryCurrent == 1){
      this.setData({
        categoryIndex: 0,
        categoryCurrent: 1,
        categoryList:[]
      })
    }
    var categoryList = this.data.categoryList
    GET('brochureType/page', { current: categoryCurrent, name: '', size: 30 }, isShow ,(flag,data,des)=>{
      if (flag){
        data.records.map(obj=>{
          obj.pageNo = 1,
          obj.isFirst = true,
          obj.arr = []
          categoryList.push(obj)
        })
        that.setData({
          categoryList: categoryList,
          categoryCurrent: Number(categoryCurrent) + 1,
        })
        that.requestToPopsById()
      }else{
        show(des)
      }
    })
  },
  /**请求宣传品列表 */
  requestToPopsById(more, isShow = true){
    let that = this
    var index = this.data.categoryIndex
    var id = this.data.categoryList[index].id
    var pageNo = this.data.categoryList[index].pageNo
    var isFirst = this.data.categoryList[index].isFirst
    if(!more){
      if (!isFirst){
         return;
      }
    }
    GET('brochure/page', { type: id, current: pageNo, size: 30 }, isShow,(flag,data,des)=>{
      if(flag){
        pageNo = pageNo + 1;
        var arr = that.data.categoryList[index].arr
        var list = data.records || [];
        list.map(obj=>{
          arr.push(obj)
        })
        that.setData({
          ["categoryList["+ index +"].pageNo"] : pageNo,
          ["categoryList[" + index + "].arr"]: arr,
          ["categoryList[" + index + "].isFirst"]: false,
        })
      }else{
        show(des)
      }
    })
  },

  clickToChangeCategory(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      categoryIndex:index
    })
    this.requestToPopsById()
  }
})