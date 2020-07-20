// pages/work/admin/dataAdmin/ads/add/index.js
const {show,showSuccess,validate} = require('../../../../../../utils/util.js')
const {POST,GET,UPLOAD,POSTJSON} = require('../../../../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeId:'',
    detail:{},
    successShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id||''
    if(validate.isEmpty(id)){
      wx.setNavigationBarTitle({
        title: '添加公告',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '修改公告',
      })
      this.data.noticeId = id
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

  requestToDetail(){
    let that = this
    GET('notice/id',{id:this.data.noticeId},true,(flag,data,des)=>{
      if(flag){
        that.setData({
          detail:data||{}
        })
      }else{
        show(des)
      }
    })
  },

  clickToUploadFile(){
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (result) => {
        console.log(result)
        let file = result.tempFiles[0]
        that.requestToUploadFile(file)
      },
    })
  },

  inputToChange(e){
    let key = e.currentTarget.dataset.key
    this.setData({
      [key]:e.detail.value
    })
  },

  pickerToChange(e){
    this.setData({
      ['detail.isTop']:1 - e.detail.value
    })
    
  },

  clickToSave(e){
    let id = this.data.noticeId
    if (validate.isEmpty(id)){
      //添加
      this.requestToAdd()
    }else{
      //修改
      this.requestToChange()
    }
  },

  requestToAdd(){
    let detail = this.data.detail
    var that = this
    if (this.checkParams()) {
      POSTJSON('notice/a/add',detail,true,(flag,data,des)=>{
        if (flag){
          that.setData({
            successShow:true
          })
        }
      })
    }
  },

  requestToChange(){
    let detail = this.data.detail
    if (this.checkParams()) {
      POSTJSON('notice/a/edit',detail,true,(flag,data,des)=>{
        if (flag){
          showSuccess('修改成功')
          setTimeout(function () {
            // let pages = getCurrentPages()
            // let page = pages[pages.length - 2]
            wx.navigateBack(
              // {delta: 1}
            )
            // page.requestToList && page.requestToList()
          }, 1500)
        }
      })
    }
  },

  checkParams(){
    let detail = this.data.detail
    if (validate.isEmpty(detail.title)){
      show('标题不能为空')
      return false
    }
    if (validate.isEmpty(detail.content)){
      show('内容不能为空')
      return false
    }
    return true
  },

  requestToUploadFile(file){
    let that = this
    let list = this.data.detail.appendixs||[]
    UPLOAD(file.path, { parentType: 'notice', fileName: file.name }, true, (flag, data, des) => {
      console.log(data)
      if (flag){
        list = list.concat([{name:file.name,url:data[0].filePath}])
        that.setData({
          ['detail.appendixs']:list
        })
      }else{
        show(des)
      }
    })
  },

  clickToDelete(e){
    let index = e.currentTarget.dataset.index
    let list = this.data.detail.appendixs
    list.splice(index,1)
    this.setData({
      ['detail.appendixs']:list
    })
  },
  successConfirm() {
    let pages = getCurrentPages();
    if (pages.length > 2) {
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        current: 1
      })
      prevPage.requestToList()
    }
    wx.navigateBack({})
  },
})