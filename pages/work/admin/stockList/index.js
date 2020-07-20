// pages/work/admin/stockList/index.js
const {POST,GET} = require('../../../../utils/network.js')
const {validate,showSuccess,show} = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:1,
    searchValue:'',
    records:[],
    sectionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestToList()
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
    this.setData({
      current:1,
      searchValue:""
    })
    this.requestToList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.requestToList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickToDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/work/admin/stockList/detail/index?id='+id,
    })
  },

  requestToList(isShow = true){
    let that = this
    var current = this.data.current;
    if (current==1){
      this.setData({
        records: [],
        sectionList: []
      })
    }
    // wx.showNavigationBarLoading()
    GET('warehousing/a/page', { current: current, size: 30, name: this.data.searchValue},isShow,(flag,data,des)=>{
      // wx.stopPullDownRefresh()
      // wx.hideNavigationBarLoading()
      if(flag){
        that.setData({
          current: Number(current) + 1,
          records:that.data.records.concat(data.records||[])
        })
        that.updateSectionData(that.data.records)
      }else{
        show(des)
      }
    })
  },

  updateSectionData(list){
    console.log(list);
    let sectionList = []
    list.forEach(value=>{
      let date = value.createTime||''
      if (date.length >= 7) {
        date = date.slice(0,7)
      }
      let section = sectionList.find(value => {
        return value.date == date
      })
      if (section) {
        section.list = section.list.concat([value])
      }else{
        sectionList = sectionList.concat([{date:date,list:[value]}])
      }
    })
    console.log(sectionList);
    this.setData({
      sectionList:sectionList
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
      current: 1,
    })
    this.requestToList()
  }
})