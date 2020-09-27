
const {show,showSuccess,user} = require('../../../../../../utils/util.js')
const {GET,POST,POSTJSON} = require('../../../../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:[],
    typeId:undefined,
    recordDetail:[],
    brochureDetailList:[],
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      this.setData({
        typeId:options.type,
        userInfo: user.getUser(),
      })
    }
    if(options.typeName){
      wx.setNavigationBarTitle({
        title: '添加单品至' + options.typeName + "套餐"
      })
    }
    if(options.brochureIn){
      let recordDetail =JSON.parse(options.brochureIn)
      this.setData({
        recordDetail:recordDetail
      })
    }
  },
  scrollMoreL(){
    this.requestToCategory(false)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getSystemInfo({
      complete: (res) => {
        that.setData({
          scrollHeight:res.windowHeight - (res.windowWidth/750) * (80 + 90) -30
        })
        that.requestToCategory()
      },
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

  /**请求类别列表 */
  requestToCategory(isShow = true){
    let that = this
    GET('brochure/page', { current: 1, size: 999 }, isShow,(flag,data,des)=>{
      if(flag){
        data.records.map( obj=>{
          obj.detailCount = 0
          if(that.isSelect(obj.id)){
            obj.selected = 1
          }else{
            obj.selected = 0
          }
        })
        that.setData({
          record:data.records
        })
        that.getTCDetail();
      }else{
        show(des)
      }
    })
  },

  // /**请求详情列表 */
  // requestToDetailPage(isShow = false){
  //   let that = this
  //   GET('brochure/page', { current: 1, size: 999 }, isShow,(flag,data,des)=>{
  //     if(flag){
  //       that.setData({
  //         record:data.records
  //       })
  //     }else{
  //       show(des)
  //     }
  //   })
  // },

  getTCDetail(){
    let that = this
    GET('brochure/detailpage', { type: this.data.typeId, userid: this.data.userInfo.id }, true, (flag, data, des) => {
      if (flag) {
        let list = [];
        let newRecord = that.data.record
        newRecord.map(obj=>{
          for(let item of data.records){
            if(item.brochureid == obj.id){
              obj.detailCount = item.detailcount
            }
          }
        })
        this.setData({
          record:newRecord
        })  
      } else {
        show(des)
      }
    })
  },

  saveDetailCount(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let num = e.detail.value
    let req = {}
    req.typeId = this.data.typeId
    req.brochureId = this.data.record[index].id
    req.detailcount = this.data.record[index].detailCount
    if(num){
      this.setData({
        ["record[" + index + "].detailCount"]: num,
        ["record[" + index + "].selected"]: 1
      })
    }else{
      this.setData({
        ["record[" + index + "].detailCount"]: 0,
        ["record[" + index + "].selected"]: 0
      })
    }
    // if(this.isSelect(req.brochureId)&&num){
    //   POSTJSON('brochureDetail/a/edit', req, true,(flag,data,des)=>{
    //     if(flag){
    //       return;
    //     }else{
    //       show(des)
    //     }
    //   })
    // }
  },

  clickToChangeCategory(e){
    let index = e.currentTarget.dataset.index
    let newRecord = this.data.record
    newRecord[index].selected = newRecord[index].selected==1?0:1
    this.setData({
      record:newRecord
    })
  },

  clickToAdd(){
    let that = this
    let brochureList = []
    console.log(this.data.record)
    for(let item of this.data.record){
      if(item.selected==1){
        let broItem = {}
        broItem.name = item.name
        broItem.id = item.id
        broItem.detailcount = item.detailCount?item.detailCount:0
        brochureList.push(broItem)
      }
    }
    POSTJSON('brochureDetail/a/editOrAdd', {type:that.data.typeId,brochureList:brochureList}, true,(flag,data,des)=>{
      if(flag){
        wx.showModal({
          complete: (res) => { },
          confirmText: '关闭',
          content: '修改成功',
          showCancel: false,
          success: (result) => {
            wx.navigateTo({
              url: '/pages/work/admin/dataAdmin/push/index?sds=1',
            })
          },
          title: '提醒',
        })
      }else{
        show(des)
      }
    })
  },

  //是否已选
  isSelect(id){
    for(let item of this.data.recordDetail){
      if(item.id == id){
        return true
      }
    }
    return false
  }

})