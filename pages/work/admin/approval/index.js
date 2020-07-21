// pages/work/admin/approval/index.js
const {GET} = require('../../../../utils/network.js')
const { show, showSuccess, user, formatYMD} = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeArr: [],
    timeObj: {},
    searchTime: '',
    minDate: new Date('2020-01').getTime(),
    current:1,
    records:[],
    // sectionList:[],
    searchValue:"",
    flag:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      flag: options.flag
    })
    this.requestToApplyList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  inputToChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },
  searchConfirm(){
     this.setData({
       current:1
     })
    this.requestToApplyList()
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
      current: 1,
      searchValue:""
    })
    this.requestToApplyList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.requestToApplyList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickToDetail(e){
    let id = e.currentTarget.dataset.key

    wx.navigateTo({
      url: '/pages/work/admin/approval/detail/index?id=' + id + "&flag=" + this.data.flag || 1
    })
  },
  clickToDetail2(e){
    let id = e.currentTarget.dataset.key
    wx.navigateTo({
      url: '/pages/work/admin/approval/detail/index?id=' + id
    })
  },
  clickToAgain(e){
    let id = e.currentTarget.dataset.key
    wx.navigateTo({
      url: '/pages/work/admin/approval/again/index?id=' + id
    })
  },
  onHandleShowPopup() {
    console.log(12312);
    this.setData({
      showPopup: true
    })
  },
  onHandleClose() {
    this.setData({
      showPopup: false
    })
  },
  onInput(event) {
    this.setData({
      searchTime: formatYMD(new Date(event.detail)),
    });
  },
  requestToApplyList(isShow = true){
    let that = this
    var current = this.data.current
    if (current == 1){
      this.setData({
        timeArr: [],
        timeObj: {},

        records: [],
        // sectionList: [],
      })
    }
      
    GET('apply/a/page', { name:this.data.searchValue, time:this.data.searchTime,current: current,size:30},isShow,(flag,data,des)=>{
      wx.stopPullDownRefresh()
      if (flag){

        let list = that.data.records
        list = list.concat(data.records||[])
        that.setData({
          records:list,
          current: Number(current) + 1, 
        })

        that.listHandle()
        // that.updateSectionData(list)


      }else{
        show(des)
      }
    })
  },

  listHandle(){
    var list = this.data.records
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
      return y - x;
    })
    this.setData({
      timeArr: timeArr,
      timeObj: timeObj
    })

    // let sectionList = []
    // list.forEach(value=>{
    //   let date = value.createTime||''
    //   if (date.length >= 7) {
    //     date = date.slice(0,7)
    //   }
    //   let section = sectionList.find(value => {
    //     return value.date == date
    //   })
    //   if (section) {
    //     section.list = section.list.concat([value])
    //   }else{
    //     sectionList = sectionList.concat([{date:date,list:[value]}])
    //   }
    // })
    // this.setData({
    //   sectionList:sectionList
    // })
  }
})