// pages/register/user/index.js
const {GET,UPLOAD,POST} = require('../../../utils/network.js')
const {show,showSuccess,validate} = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    multiOrganList:[],
    multiIndex:[0,0],
    multiArray:[],
    currentOrgan:{},
    isCanEdit: false,
    btnValue: "提交",
    edit:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = app.globalData.userInfo
    if (options.edit == 1){
       this.setData({
         edit: options.edit,
         isCanEdit: userInfo.roleId == 'ROLE_NO' || userInfo.roleId == 'ROLE_USER' || userInfo.roleId == 'ROLE_USER'?false:true,
         userInfo: userInfo,
         btnValue: "更新",
         ["currentOrgan.corporateName"]: userInfo.organizationName
       })
    }
    this.requestToOrganList()
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
  /**
   * 获取组织机构
   */
  requestToOrganList(){
    let that = this
    GET('organization/list', { corporateType:0},true,(flag,data,des)=>{
      let names = new Set()
      let list = []
      let subNames = []
      if (flag){
        data.forEach((value)=>{
          names.add(value.area||'')
          let current = list.find((v)=>{
            return v.area&&v.area==value.area
          })
          if (current) {
            current.list = current.list.concat([value])
            current.subNames = current.subNames.concat([value.corporateName||''])
          }else{
            list.push({area:value.area,list:[value],subNames:[value.corporateName||'']})
          }
        })
        that.setData({
          multiOrganList:list,
          multiArray:[list.map((v)=>v.area),list[0].subNames]
        })
      }else{
        show(des)
      }
    })
  },
  clickToSubmit(e){
    var that = this;
    let userInfo = this.data.userInfo
    if(validate.isEmpty(userInfo.userName)){
      show('用户名不能为空')
      return
    }else{
      var reg = /^[\u4e00-\u9fa5]{2,4}$/
      if (!reg.test(userInfo.userName)){
        show('用户名只能是2-4位中文')
        return
      }
    }
    if(validate.isEmpty(userInfo.organization)){
      show('请选择组织机构')
      return
    }
    if(!validate.mobilePhone(userInfo.telephoneNum)){
      show('请输入正确的电话号码')
      return
    }
    if (validate.isEmpty(userInfo.jobNum)) {
      show('请输入工号')
      return
    }
    if(validate.isEmpty(userInfo.recipientAddr)){
      show('收货地址不能为空')
      return
    }
    // if(validate.isEmpty(userInfo.wechatNum)){
    //   show('微信号不能为空')
    //   return
    // }
    // if(validate.isEmpty(userInfo.remark)){
    //   show('备注不能为空')
    //   return
    // }
    if(validate.isEmpty(userInfo.workingImg)){
      show('请上传工作照片')
      return
    }
    POST('user/update',userInfo,true,(flag,data,des)=>{
      if (flag){
        if (that.data.edit == 0) {
          show("提交成功")
          that.message()
        } else {
          wx.showModal({
              complete: (res) => {},
              confirmText: '关闭',
              content: '提交成功',
              showCancel: false,
              success: (result) => {
                wx.navigateBack({ })
              },
              title: '提醒',
         })
      }
      }else{
        show(des)
      }
    })
    
  },
  message() {
    wx.requestSubscribeMessage({
      tmplIds: ["kAAZjXhdEYb0aBCz_yalZ6nk2Qf07SGh8rZc5DdIDmU"],
      success: (res) => {
        if (res["kAAZjXhdEYb0aBCz_yalZ6nk2Qf07SGh8rZc5DdIDmU"]=="reject"){
          wx.showModal({
            complete: (res) => { },
            confirmText: '关闭',
            content: '您取消了消息订阅，后续可以在右上角的设置中手动开启',
            showCancel: false,
            success: (result) => {
              wx.navigateBack({})
            },
            title: '提醒',
          })
        }else{
          wx.showModal({
            complete: (res) => { },
            confirmText: '关闭',
            content: '订阅成功',
            showCancel: false,
            success: (result) => {
              wx.navigateBack({})
            },
            title: '提醒',
          })
        }
      },
      fail(err) {
        
      }
    })
  },
  clickToGetUserInfo(e){
    this.setData({
      ['userInfo.userName']:e.detail.userInfo.nickName
    })
  },

  clickToGetPhoneNumber(e){
    console.log(e);
  },

  pickerColumnChange(e){
    console.log(e);
    let column = e.detail.column
    let index = e.detail.value
    let list = this.data.multiOrganList
    if (column == 0) {
      this.setData({
        multiArray:[list.map((v)=>v.area),list[index].subNames],
        multiIndex:[index,0]
      })
    }
  },

  pickerChange(e){
    let section = e.detail.value[0]
    let row = e.detail.value[1]
    let organ = this.data.multiOrganList[section].list[row]
    this.setData({
      currentOrgan:organ,
      ['userInfo.organization']:organ.id
    })
  },

  clickToUploadImage(e){
    let that = this
    wx.chooseImage({
      count: 1,
      fail: (res) => {},
      success: (result) => {
        let path = result.tempFilePaths[0]
        that.requestToUploadImage(path)
      },
    })
  },

  requestToUploadImage(path){
    let that = this
    UPLOAD(path,{parentType:'user'},true,(flag,data,des)=>{
      if(flag){
        let p = data[0].filePath
        that.setData({
          ['userInfo.workingImgPath']: path,
          ['userInfo.image']: path,
          ['userInfo.workingImg']:p
        })
        showSuccess("上传成功")
      }else{
        show(des)
      }
    })
  },

  inputToChange(e){
    let key = e.currentTarget.dataset.key
    this.setData({
      ['userInfo.' + key]:e.detail.value
    })
  },

  clickToReviewImage(e){
    let image = this.data.userInfo.workingImgPath || this.data.userInfo.workingImg||""
    wx.previewImage({
      urls: [image],
      current: 0
    })
  }
})