// pages/work/admin/dataAdmin/category/index.js
const {GET,POST} = require('../../../../../utils/network.js')
const {show,validate,showSuccess} = require('../../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSave:false,
    current:1,
    records:[],
    currentIndex:-1,
    editName:'',
    searchValue:'',
    editName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestForList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        let scrollHeight = res.windowHeight - res.windowWidth/750 * (88 + 80 + 60)
        that.setData({
          scrollHeight:scrollHeight
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

  clickToAdd(e){
    this.setData({
      showSave:true,
      currentIndex:-1
    })
  },

  clickToHide(e){
    this.setData({
      editName: "",
      showSave:false,
      currentIndex:-1
    })
  },

  clickToSave(e){
    let name = this.data.editName.trim()
    if (validate.isEmpty(name)){
      show('分类名称不能为空')
      return
    }
    if (this.data.currentIndex == -1) {//新增
      this.requestToAdd()
    }else{
      this.requestToEdit()
    }
  },
  /**
   * 添加分类
   */
  requestToAdd(){
    let that = this
    let name = this.data.editName.trim()
    POST('brochureType/a/add',{name:name},true,(flag,data,des)=>{
      if (flag){
        that.alertSuccess()
      }else{
        show(des)
      }
    })
  },
  /**
   * 修改分类
   */
  requestToEdit(){
    let that = this
    let name = this.data.editName.trim()
    let id = this.data.records[this.data.currentIndex].id
    POST('brochureType/a/edit',{id:id,name:name},true,(flag,data,des)=>{
      if (!flag){
        show(des)
        return
      }
      that.alertSuccess()
    })
  },
  /**
   * 删除分类
   */
  requestToDelete(){
    let id = this.data.records[this.data.currentIndex].id
    let that = this
    POST('brochureType/a/delete',{id:id},true,(flag,data,des)=>{
      if (!flag){
        show(des)
      }else{
        showSuccess("删除成功")
        that.requestForList()
      }
    })
  },

  alertSuccess(){
    let that = this
    wx.showToast({
      title: '保存成功',
      duration: 1500,
      icon: 'success',
      mask: true,
      complete: (res) => {
        that.setData({
          showSave:false,
          currentIndex:-1,
          current:1
        })
        that.requestForList()
      },
    })
  },

  clickToChange(e){
    let index = e.currentTarget.dataset.index
    let name = this.data.records[index].name
    this.setData({
      editName: name,
      showSave:true,
      currentIndex:index
    })
  },

  clickToDelete(e){
    let that = this
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex:index
    })
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '确定删除该类别？',
      showCancel: true,
      success: (result) => {
        if (result.confirm){
          that.requestToDelete()
        }
      },
      title: '提醒',
    })
  },
  requestForList(isShow = true){
    let that = this
    
    var current = this.data.current
    if (current == 1) {
      this.setData({
        records: []
      })
    }
    let list = this.data.records
    GET('brochureType/page', { current: current, name: this.data.searchValue || '', size: 30},isShow,(flag,data,des)=>{
      if (flag){
        that.setData({
          current: Number(current) + 1,
          records: list.concat(data.records || [])
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
  searchConfirm(){
    this.setData({
      current : 1
    })
    this.requestForList()
  },
  scrollMore(){
    this.requestForList(false)
  }
})