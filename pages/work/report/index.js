// pages/work/report/index.js
const wxCharts = require('../../../utils/wxcharts.js')
const { GET, POST, UPLOAD } = require('../../../utils/network.js')
const { show, setToken, validate, formatWeek, showSuccess } = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      complete: (res) => {
        console.log(res);
        let scale = res.windowWidth / 750
        let width = 690 * scale
        let height = 400 * scale
        that.setData({
          width: width,
          height: height
        })
        that.getData()
      }
    })
    
  },
  getData(isShow = true){
    var that = this;
    GET("report/list", {  }, isShow, (flag, data, des) => {
      if (flag) {
        var categories = []
        var series = [{
          name: "成交量",
          data: []
        }]
        data = data.reverse()
        data.map(x=>{
          var arr = x.mydate.match(/\d+/g)
          categories.push(arr[1]+"-"+arr[2])
          series[0].data.push(x.mycount)
        })
        that.setData({
          categories,
          series
        })
        // that.refreshPieCharts()
        that.refreshLineCharts()
      } else {
        show(des)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  refreshLineCharts(width, height) {
    var categories = this.data.categories
    var series = this.data.series
    var width = this.data.width
    var height = this.data.height
    new wxCharts({
      canvasId: 'line',
      type: 'line',
      categories: categories,
      series: series,
      yAxis: {
        title: '成交量',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      extra: {
        lineStyle: 'curve'
      },
      width: width,
      height: height,
      dataLabel: true
    })
  },

  refreshPieCharts(width, height) {
    new wxCharts({
      canvasId: 'pie',
      type: 'pie',
      series: [{
        name: '成交量1',
        data: 15
      }, {
        name: '成交量2',
        data: 20
      }, {
        name: '成交量3',
        data: 40
      }, {
        name: '成交量4',
        data: 10
      }],
      width: width,
      height: height,
      dataLabel: true
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

  }
})