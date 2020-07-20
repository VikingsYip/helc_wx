// pages/work/supplier/stockOut/index.js
const { GET, POST, UPLOAD } = require('../../../../utils/network.js')
const { show, setToken, validate, formatWeek, showSuccess } = require('../../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeArr: [],
    timeObj: {},
    list: [],
    pageNo: 1,
    searchValue:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
  getList(isShow=true) {
    var that = this;
    var pageNo = this.data.pageNo;
    
    if (pageNo==1){
      this.setData({
        list:[]
      })
    }
    var list = this.data.list
      GET("apply/p/page", { current: pageNo, size: 30, name: this.data.searchValue }, isShow, (flag, data, des) => {
      if (flag) {
        data.records.map(obj => {
          list.push(obj)
        })
        that.setData({
          list: list,
          pageNo: Number(pageNo) + 1,
        })
        that.listHandle()
      } else {
        show(des)
      }
    })
  },
  listHandle() {
    var list = this.data.list
    var timeArr = [];
    var timeObj = {};
    list.map(obj => {
      var arr = obj.createTime.match(/\d+/g)
      var timeK = Number(arr[0] + "" + arr[1])
      if (timeArr.indexOf(timeK) == -1) {
        timeArr.push(timeK)
      }

      if (timeObj[timeK]) {
        timeObj[timeK].arr.push(obj)
      } else {
        timeObj[timeK] = {
          arr: [obj]
        }
      }
    })
    timeArr.sort((x, y) => {
      return  y - x
    })
    this.setData({
      timeArr: timeArr,
      timeObj: timeObj
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
    this.setData({
      pageNo: 1,
      searchValue:""
    })
    this.getList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  clickToDetail2(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/work/supplier/stockOut/detail/index?id=' + id,
    })
  },
  clickToDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/work/supplier/stockOut/detail/index?id=' + id +"&flag=1",
    })
  },
  inputToChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },
  searchConfirm(){
     this.setData({
       pageNo:1
     })
     this.getList()
  }
})