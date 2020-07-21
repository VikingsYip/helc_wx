// pages/work/admin/dataAdmin/index.js
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

  clickToManager(e){
    let index = Number(e.currentTarget.dataset.index)
    switch (index){
      case 0:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/category/index',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/push/index',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/ads/index',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/banner/index',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/auth/index',
        })
        break
      case 5:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/user/index',
        })
        break
      case 6:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/organization/index?type=0',
        })
        break
      case 7:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/setmeal/index',
        })
        break
      case 8:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/organization/index?type=1',
        })
        break
      case 10:
        wx.navigateTo({
          url: '/pages/work/admin/organizationquota/index',
        })
        break
    }
  }
})