// pages/work/admin/dataAdmin/push/add/index.js
const { validate, show, showSuccess} = require('../../../../../../utils/util.js')
const { GET, UPLOAD, POST, POSTJSON } = require('../../../../../../utils/network.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    successShow: false,
    detail:{},
    isTCList: ['否', '是'],
    isTCDetailList: [0,1],
    gysList:["供应商1","供应商2"],
    gysdetailList: ["asd123","asd666"],
    lbList:["类别1","类别2"],
    lbdetailList:["lb001","lb666"],
    stockNumShow:false
  },
  requestToCategory() {
    let that = this
    GET('brochureType/page', { current: 1, name: '', size: 1000 }, true, (flag, data, des) => {
      if (flag) {
        var lbList = []
        var lbdetailList = []
        data.records.map(obj => {
          //只有单品能选类别
          if(obj.isSet==0){
            lbList.push(obj.name)
            lbdetailList.push(obj.id)
          }
        })
        that.setData({
          lbList,
          lbdetailList
        })
        that.getGYS()
      } else {
        show(des)
      }
    })
  },
  getGYS(){
    POST('organization/list', { corporateType:1 }, true, (flag, data, des) => {
      if (flag) {
        var gysList = [], gysdetailList = [];
        data.map((obj)=>{
          gysdetailList.push(obj.id)
          gysList.push(obj.corporateName)
        })
        this.setData({
          gysList, gysdetailList
        })
      } else {
        show(des)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id||''
    if (validate.isEmpty(id)){
      //新增
      wx.setNavigationBarTitle({
        title: '添加宣传品',
      })
      this.setData({
        stockNumShow: true
      })
    }else{
      // obj = JSON.parse(decodeURIComponent(obj))
      wx.setNavigationBarTitle({
        title: '修改宣传品',
      })
      this.requestToDetail(id)
    }
    this.requestToCategory()
    console.log(options);
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

  clickToSave(e){
    var obj = this.data.detail
    if (!obj.name){ show("名称不能为空"); return; }
    if (!obj.typeName) { show("所属类型不能为空"); return; }
    if (!obj.verifySupplierName) { show("供应商审核不能为空"); return; }
    if (!obj.costPrice) { show("成本价格不能为空"); return; }
    if (!obj.warningNum) { show("库存预警不能为空"); return; }
    //if (!obj.stockNum) { show("库存数量不能为空"); return; }
    if (!obj.latestVersion) { show("最新版本号不能为空"); return; }
    if (!obj.coverImgPath) { show("封面不能为空"); return; }
    
    if(this.data.detail.id){
      // 更新
      POST('brochure/a/edit', this.data.detail , true, (flag, data, des) => {
        if (flag) {
          this.setData({
            successShow: true
          })
        } else {
          show(des)
        }
      })
    }else{
      // 添加
      POST('brochure/a/add', this.data.detail , true, (flag, data, des) => {
        if (flag) {
          this.setData({
            successShow: true
          })
        } else {
          show(des)
        }
      })
    }
  },
  successConfirm(){
    let pages = getCurrentPages();
    if (pages.length > 2){
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        categoryCurrent: 1
      })
      prevPage.requestToCategory()
    }
     wx.navigateBack({ })
  },
  requestToDetail(id){
    let that = this
    GET('brochure/id',{id:id},true,(flag,data,des)=>{
      if (flag){
        that.setData({
          detail:data
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

  bindPickerChange(e){
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    if (key == "detail.isSet"){
       this.setData({
         ["detail.isSet"]: value
       })
    } else if (key == "detail.typeName") {
      this.setData({
        ["detail.type"]: this.data.lbdetailList[value],
        ["detail.typeName"]: this.data.lbList[value]
      })
    } else if (key == "detail.verifySupplierName") {
      this.setData({
        ["detail.verifySupplierName"]: this.data.gysList[value],
        ["detail.verifySupplier"]: this.data.gysdetailList[value]
      })
    }
  },

  clickToUploadImage(e) {
    let that = this
    wx.chooseImage({
      count: 1,
      fail: (res) => { },
      success: (result) => {
        let path = result.tempFilePaths[0]
        that.requestToUploadImage(path)
      },
    })
  },

  requestToUploadImage(path) {
    let that = this
    UPLOAD(path, { parentType: 'user' }, true, (flag, data, des) => {
      if (flag) {
        let filePath = data[0].filePath
        let fullPath = data[0].fullPath
        that.setData({
          ['detail.coverImg']: filePath,
          ['detail.coverImgPath']: fullPath
        })
        showSuccess("上传成功")
      } else {
        show(des)
      }
    })
  },
  clickToReviewImage(e) {
    let image = this.data.detail.coverImgPath || ""
    wx.previewImage({
      urls: [image],
      current: 0
    })
  }
})