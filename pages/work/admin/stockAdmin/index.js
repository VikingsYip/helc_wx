// pages/work/admin/stockAdmin/index.js
const {user,validate,show,showSuccess} = require('../../../../utils/util.js')
const {POST,GET} = require('../../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    categoryIndex: 0,
    categoryCurrent:1,
    // currentList:[],
    userInfo:{},
    // currentIndex:-1,
    // count:0,
    // showSelected:false
  },
  scrollMoreL() {
    this.requestToCategory(false)
  },
  scrollMoreR() {
    this.requestToPopsById(true, false)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo:user.getUser()
    })
    this.requestToCategoryList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        var query = wx.createSelectorQuery()
        query.select("#wran").boundingClientRect()
        query.select("#bottom").boundingClientRect()
        query.exec(function (res1) {
          console.log(res1)
          that.setData({
            //计算scroll需要的高度
            scrollHeight: res.windowHeight - res1[1].height - res1[0].bottom - (res.windowHeight / 750) * 30,
          })
          console.log(that.data.scrollHeight)
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

  requestToCategoryList(isShow = true) {
    let that = this
    var categoryCurrent = this.data.categoryCurrent
    if (categoryCurrent == 1) {
      this.setData({
        categoryList: [],
        categoryIndex: 0
      })
    }
    var categoryList = this.data.categoryList
    GET('brochureType/page', { current: categoryCurrent, name: '', size: 30 }, isShow, (flag, data, des) => {
      if (flag) {
        data.records.map(obj => {
            obj.pageNo = 1,
            obj.isFirst = true,
            obj.arr = []
            categoryList.push(obj)
        })
        that.setData({
          categoryList: categoryList,
          categoryCurrent: Number(categoryCurrent) + 1
        })
        that.requestToPopsById()
      } else {
        show(des)
      }
    })
  },
  /**请求宣传品列表 */
  requestToPopsById(more,isShow = true) {
    let that = this
    var index = this.data.categoryIndex
    var id = this.data.categoryList[index].id
    var pageNo = this.data.categoryList[index].pageNo
    var isFirst = this.data.categoryList[index].isFirst
    if (!more) {
      if (!isFirst) {
        return;
      }
    }
    GET('brochure/page', { type: id, current: pageNo, size: 30 }, isShow, (flag, data, des) => {
      if (flag) {
        pageNo = pageNo + 1;
        var arr = that.data.categoryList[index].arr
        var list = data.records || [];
        list.map(obj => {
          if (Number(obj.stockNum) <= Number(obj.warningNum)){
            obj.red = true;
          }
          obj.num = 0;
          arr.push(obj)
        })
        that.setData({
          ["categoryList[" + index + "].pageNo"]: pageNo,
          ["categoryList[" + index + "].arr"]: arr,
          ["categoryList[" + index + "].isFirst"]: false,
        })
      } else {
        show(des)
      }
    })
  },

  clickToChangeCategory(e){
    this.setData({
      categoryIndex:e.currentTarget.dataset.index
    })
    this.requestToPopsById()
  },
  clickToDetail(e){
    var index = e.currentTarget.dataset.index
    var id = this.data.categoryList[this.data.categoryIndex].arr[index].id
    wx.navigateTo({
      url: '/pages/work/admin/stockAdmin/detail/index?id='+id,
    })
  },

})