// pages/work/admin/dataAdmin/organization/index.js
const { GET, POST } = require('../../../../../utils/network.js')
const { show, validate, showSuccess } = require('../../../../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showSave: false,
    current: 1,
    records: [],
    currentIndex: -1,
    editName: '',
    searchValue: '',
    editName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.current = options.type;
    if (this.data.current ==1){
      wx.setNavigationBarTitle({
        title: '供应商管理'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '组织机构管理'
      })
    }
    
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
        let scrollHeight = res.windowHeight - res.windowWidth / 750 * (88 + 80 + 60)
        that.setData({
          scrollHeight: scrollHeight
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

  clickToAdd(e) {
    this.setData({
      showSave: true,
      currentIndex: -1
    })
  },

  clickToHide(e) {
    this.setData({
      editName: "",
      showSave: false,
      currentIndex: -1
    })
  },

  clickToSave(e) {
    let name = this.data.editName.trim()
    if (validate.isEmpty(name)) {
      show('组织机构名称不能为空')
      return
    }
    if (this.data.currentIndex == -1) {//新增
      this.requestToAdd()
    } else {
      this.requestToEdit()
    }
  },
  /**
   * 添加分类
   */
  requestToAdd() {
    let that = this
    let name = this.data.editName.trim()
    POST('organization/a/add', { corporateName: name, corporateType: that.data.current, area: "总部"}, true, (flag, data, des) => {
      if (flag) {
        that.alertSuccess()
      } else {
        show(des)
      }
    })
  },
  /**
   * 修改分类
   */
  requestToEdit() {
    let that = this
    let name = this.data.editName.trim()
    let id = this.data.records[this.data.currentIndex].id
    POST('organization/a/edit', { id: id, corporateName: name, corporateType: that.data.current, area:"总部" }, true, (flag, data, des) => {
      if (!flag) {
        show(des)
        return
      }
      that.alertSuccess()
    })
  },
  /**
   * 删除分类
   */
  requestToDelete() {
    // let id = this.data.records[this.data.currentIndex].id
    // let that = this
    // POST('organization/a/delete', { id: id }, true, (flag, data, des) => {
    //   if (!flag) {
    //     show(des)
    //   } else {
    //     showSuccess("删除成功")
    //     that.requestForList()
    //   }
    // })
  },

  alertSuccess() {
    let that = this
    wx.showToast({
      title: '保存成功',
      duration: 1500,
      icon: 'success',
      mask: true,
      complete: (res) => {
        that.setData({
          showSave: false,
          currentIndex: -1,
          current: that.data.current
        })
        that.requestForList()
      },
    })
  },

  clickToChange(e) {
    let index = e.currentTarget.dataset.index
    let name = this.data.records[index].corporateName
    this.setData({
      editName: name,
      showSave: true,
      currentIndex: index
    })
  },

  clickToDelete(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index
    })
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '确定删除该组织机构？',
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          that.requestToDelete()
        }
      },
      title: '提醒',
    })
  },
  requestForList(isShow = true) {
    let that = this
    var current = this.data.current
    if (current == 1) {
      this.setData({
        records: []
      })
    }
    let records = this.data.records
    GET('organization/list', { corporateType: current, name: this.data.searchValue || ''}, isShow, (flag, data, des) => {
      if (flag) {
        that.setData({
          records: records.concat(data || [])
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
  searchConfirm() {
    this.setData({
      current: this.data.current
    })
    this.requestForList()
  },
  // scrollMore() {
  //   this.requestForList(false)
  // }
})