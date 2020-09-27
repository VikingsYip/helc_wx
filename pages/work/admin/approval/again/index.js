// pages/work/admin/approval/detail/index.js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id||''
    if(validate.isNotEmpty(id)){
      this.setData({
        orderId: id
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
  clickToAgain(){
    var id = this.data.orderId
    var applyRemark = this.data.applyRemark || ""
    var flag = false  // 有一个大于0
    var flag2 = false // 有一个等于
    var applyDtls = []
    var applyQtys = []
    this.data.detail.applyDtls.map( obj => {
      if (obj.applyNum != obj.applyNum2){
        if (obj.applyNum == 0){
          flag2 = true
        }else{
          flag = true
          applyDtls.push(obj.id)
          applyQtys.push(obj.applyNum)
        }
      }
    })
    if (!flag2){
      if(!flag){
        show("没有修改不能重新提交")
        return
      }
      POST('apply/a/reApply', { id, applyRemark, applyDtlIds: applyDtls.join(","), applyQtys: applyQtys.join(",") }, true, (flag, data, des) => {
        if (flag) {
          this.setData({
            successvisiable: true
          })
        } else {
          show(data)
        }
      })
    }else{
      show("商品数量不能为0")
    }
  },
  requestToDetail(){
    let that = this
    GET('apply/id',{id:this.data.orderId},true,(flag,data,des)=>{
      if(flag){
        if (data.deliveryImg){
          data.deliveryImg = data.deliveryImg.split(",")
        }
        if (data.appendix) {
          data.appendix = data.appendix.split(",")
        }
        data.applyDtls.map(obj=>{
          obj.applyNum2 = obj.applyNum
        })
        that.setData({
          detail: data
        })
      }else{
        show(des)
      }
    })
  },
  inputToChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]: e.detail.value
    })
  },
  successConfirm(){
    let pages = getCurrentPages();
    if (pages.length > 2) {
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        current: 1,
        searchValue: ""
      })
      prevPage.requestToApplyList()
    }
    wx.navigateBack({})
  },
  reduceNum(e) {
    var index = e.target.dataset.index;
    var num = e.target.dataset.num;
    var obj = this.data.detail.brochure[index];
    num = (num - 50 < 0) ? 0 : num - 50;
      this.setData({
        ["detail.applyDtls[" + index + "].applyNum"]: num
      })
    
  },
  addNum(e) {
    var index = e.target.dataset.index;
    var num = e.target.dataset.num;
    var obj = this.data.detail.brochure[index];
    var max = (obj.stockNum < 0) ? 0 : obj.stockNum;
    var min = 0;
    var maxapply = this.data.detail.organizationQuota[index].quotanum || 0;
    // var max = max > maxapply ? maxapply : max 

    var tishi = "不能超过分公司可用数"
    if (maxapply < max){
      max = (maxapply < 0) ? 0 : maxapply
      tishi = "不能超过最大额度"
    }

    num = num + 50;
    if (num <= max) {
      // if (num <= maxapply) {
        this.setData({
          ["detail.applyDtls[" + index + "].applyNum"]: num
        })
      // } else {
      //   this.setData({
      //     ["detail.applyDtls[" + index + "].applyNum"]: maxapply
      //   })
      // }
    } else {
      this.setData({
        ["detail.applyDtls[" + index + "].applyNum"]: max
      })
      show(tishi)
    }
  },
  inpNum(e) {
    var index = e.currentTarget.dataset.index;
    var obj = this.data.detail.brochure[index];
    var max = (obj.stockNum < 0) ? 0 : obj.stockNum;
    var min = 0;
    var maxapply = this.data.detail.organizationQuota[index].quotanum || 0;
    // var maxapply = obj.maxApplyNum;

    var tishi = "不能超过分公司可用数"
    if (maxapply < max) {
      max = (maxapply < 0) ? 0 : maxapply
      tishi = "不能超过最大额度"
    }

    // var max = max > maxapply ? maxapply : max 
    var num = Number(e.detail.value);
    if ((/^\d{1,}$/.test(num))) {
      if (num <= max) {
        // if (num <= maxapply) {
          this.setData({
            ["detail.applyDtls[" + index + "].applyNum"]: num
          })
        // } else {
          // show("超过最大申领数")
          // this.setData({
          //   ["detail.applyDtls[" + index + "].applyNum"]: maxapply
          // })
        // }
      } else{
        this.setData({
          ["detail.applyDtls[" + index + "].applyNum"]: max
        })
        show(tishi)
      }
    } else {
      show("输入正确格式")
      this.setData({
        ["detail.applyDtls[" + index + "].applyNum"]: 0
      })
      return
    }
  }
})