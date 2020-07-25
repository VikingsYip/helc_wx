// pages/work/admin/approval/detail/index.js
const {GET,POST} = require('../../../../../utils/network.js')
const { show, showSuccess, validate } = require('../../../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    successvisiable:false,
    orderId:'',
    detail:{},
    applyRemark:"",
    flag:false,
    logArr: [],
    isTC: 0,
    radioArr:[{
      name:"1",
      checked:false,
      value:"普通物流(年度预算场数范围内，请选此处)",      
    }, {
      name:"2",
      checked: false,
      value: "其他物流(年度预算场数范围外，请选此处)",
    }],
    radioDefaultArr:[{
      name:"1",
      checked:false,
      value:"是",      
    }, {
      name:"2",
      checked: false,
      value: "否",
    }],
    btnReply: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || ''
    var userInfo = app.globalData.userInfo
    
    if(validate.isNotEmpty(id)){
      this.setData({
        userInfo,
        orderId: id,
        flag: options.flag
      })
      this.requestToDetail()
    }
    if(this.data.flag){
      wx.setNavigationBarTitle({
        title: '审批流程'
      })
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
  clickToAll(e){
    let id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '/pages/work/admin/approval/all/index?id='+id,
    })
  },
  checkFlag(){
    var detail = this.data.detail;
    var flag = false
    var applyDtlIds = []
    var applyQtys = []
    detail.applyDtls.map(obj=>{
      if (obj.checked) {
        obj.dtl.map(y => {
          if (y.applyNum>0) {            
            flag = true;
            applyDtlIds.push(y.id)
            applyQtys.push(y.applyNum)
          }
        })
      }
    })
    return { flag: flag, applyDtlIds: applyDtlIds, applyQtys: applyQtys}
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickToBack(e){
    var id = this.data.orderId
    var applyRemark = this.data.applyRemark
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要退回？',
      success(res) {
        if (res.confirm) {
          POST('apply/a/backApply', { id: id, remark: applyRemark }, true, (flag, data, des) => {
            if (flag) {
              that.setData({
                successvisiable: true
              })
            } else {
              show(des)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onHandlenNum() {
    this.setData({
      flag:3
    })
  },
  clickToSubmit(){
    var obj = this.checkFlag()
    var id = this.data.orderId
    var applyRemark = this.data.applyRemark || "";
    var that = this;
    if (obj.flag){
      POST('apply/a/reApply', {
        id, applyRemark, applyDtlIds: obj.applyDtlIds.join(","), applyQtys: obj.applyQtys.join(",")  }, true, (flag, data, des) => {
          console.log(flag, data, des)
        if (flag) {
          this.setData({
            successvisiable: true
          })
        } else {
          show(des)
        }
      })
    }else{
      var tishi = that.data.flag == 3 ? "至少通过一个商品，并且数量大于0" : "至少通过一个商品"
      show(tishi)
    }
  },
  clickToResubmit(){
    var obj = this.checkFlag()
    var id = this.data.orderId
    var applyRemark = this.data.applyRemark
    if (obj.flag) {
      POST('apply/a/recall/examine', { id, applyRemark }, true, (flag, data, des) => {
        if (flag) {
          this.setData({
            successvisiable: true
          })
        } else {
          show(data)
        }
      })
    } else {
      show("至少通过一个商品")
    }
  },
  requestToDetail(){
    let that = this
    GET('apply/id',{id:this.data.orderId},true,(flag,data,des)=>{
      if(flag){
        data.applyDtls.map(obj=>{
          obj.checked=true
        })
        if (data.deliveryImg){
          data.deliveryImg = data.deliveryImg.split(",")
        }
        if (data.appendix) {
          data.appendix = data.appendix.split(",")
        }
        if (data.hasOwnProperty('eventNumberPeople')||data.hasOwnProperty('eventTime')||data.hasOwnProperty('eventAddress')) {
          that.setData({
            isTC: 1
          })
        }
        //物流类型为空 默认普通
        if (!data.logisticsType){
          data.logisticsType = "1";
        }
        var radioArr = this.data.radioArr.map((item) => {
          if (item.name == data.logisticsType) {
            item.checked=true
            return item
          } else {
            item.checked = false
            return item
          }
        })

        var radioDefaultArr = this.data.radioDefaultArr.map((i) => {
          if (data.otherAddress == this.data.userInfo.recipientAddr) {
            if (i.value=='是') {
              i.checked = true
              return i
            }
          } else {
            if (i.value=='否') {
              i.checked = true
              return i
            }
          }
        })

        that.setData({
          radioArr,
          radioDefaultArr,
          detail: data,
        })
        that.getLog()
      }else{
        show(des)
      }
    })
  },
  getLog(){
    let that = this
    GET('applyRecord/a/page', { applyId: this.data.orderId }, true, (flag, data, des) => {
      if (flag) {
         that.setData({
            logArr: data
         })
      } else {
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
  checkboxChange(e){
    var beChecked = e.detail.value;
    var detail = this.data.detail;
    detail.applyDtls.map((obj,index)=>{
      if (beChecked.indexOf(index+"")==-1){
        obj.checked = false
      }else{
        obj.checked = true
      }
    })
    this.setData({
      detail: detail
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
    var index2 = e.target.dataset.index2;
    var num = e.target.dataset.num;
    var obj = this.data.detail.brochure[index];
    num = (num - 50 < 0) ? 0 : num - 50;
    this.setData({
      ["detail.applyDtls[" + index + "].dtl[" + index2 + "].applyNum"]: num
    })

  },
  addNum(e) {
    var index = e.target.dataset.index;
    var index2 = e.target.dataset.index2;
    var num = e.target.dataset.num;
    var obj = this.data.detail.brochure[index];
    // var max = (obj.stockNum < 0) ? 0 : obj.stockNum;
    var min = 0;
    var maxapply = this.data.detail.organizationQuota[index]?this.data.detail.organizationQuota[index].quotanum:999999;
    // var max = max > maxapply ? maxapply : max 

    // var tishi = "不能超过分公司可用数"
    // if (maxapply < max) {
    var max = (maxapply < 0) ? 0 : maxapply
    var tishi = "不能超过最大额度"
    // }

    num = num + 50;
    if (num <= max) {
      // if (num <= maxapply) {
      this.setData({
        ["detail.applyDtls[" + index + "].dtl[" + index2 + "].applyNum"]: num
      })
      // } else {
      //   this.setData({
      //     ["detail.applyDtls[" + index + "].applyNum"]: maxapply
      //   })
      // }
    } else {
      this.setData({
        ["detail.applyDtls[" + index + "].dtl[" + index2 + "].applyNum"]: max
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

    // var tishi = "不能超过分公司可用数"
    // if (maxapply < max) {
    var max = (maxapply < 0) ? 0 : maxapply
    var tishi = "不能超过最大额度"
    // }

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
      } else {
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