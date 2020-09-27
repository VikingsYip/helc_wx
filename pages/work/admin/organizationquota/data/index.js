
const { GET, POST, POSTJSON } = require('../../../../../utils/network.js')
const { show,user } = require('../../../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    successVisiable: false,
    applyListVisiable:false,
    userInfo:{},
    categoryList: [],
    showList:[],
    categoryIndex: 0,
    categoryCurrent:1,
    nowObj:{},
    nowId:{},
    nowIndex:0,
    isTC:0,
    organizationid:"",
    nowOrgQuotaObj:{}
  },
  scrollMoreL() {
    this.requestToCategory(false)
  },
  scrollMoreR() {
    this.requestToPopsById(true, false)
  },
  isTCHandle(e) {
    this.setData({
      isTC: e.target.dataset.key
    })
    this.pushIntoShowList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.orgName + "额度",
    })
    this.setData({
      userInfo: user.getUser(),
      organizationid: options.id
    })
    this.requestToCategory()
  },
  inpNum(e) {
    var min = 0;
    var num = Number(e.detail.value.toString().trim());
    if ((/^\d{1,}$/.test(num))) {
      this.setData({
        ["nowOrgQuotaObj.quotaNum"]: e.detail.value
      })
    } else {
      show("输入正确格式")
      this.setData({
        ["nowOrgQuotaObj.quotaNum"]: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
          that.setData({
            scrollHeight: res.windowHeight - 80
          })
      }
    })
  },
  requestToCategory(isShow = true) {
    let that = this
    var categoryCurrent = this.data.categoryCurrent
    if (categoryCurrent == 1){
      this.setData({
        categoryList: [],
        categoryIndex: 0
      })
    }
    var categoryList = this.data.categoryList
    GET('brochureType/page', { current: categoryCurrent, name: '', size: 30 }, isShow, (flag, data, des) => {
      if (flag) {
        data.records.map(obj => {
          obj.pageNo = 1;
          obj.isFirst = true;
            obj.arr = []
            categoryList.push(obj)
        })
        that.setData({
          categoryList: categoryList,
          categoryCurrent: Number(categoryCurrent) + 1,
        })
        //that.requestToPopsById()
        console.log(categoryList);
        that.pushIntoShowList();
      } else {
        show(des)
      }
    })
  },
  //动态显示单品&套餐
  pushIntoShowList(){
    let dataList = this.data.categoryList;
    let showList = [];
    for(let item in dataList){
      if (dataList[item].isSet == this.data.isTC){
        showList.push(dataList[item]);
      }
    }
    this.setData({
      showList
    })
    console.log(this.data.showList)
  },
  /**请求宣传品列表 */
  requestToPopsById(more,isShow = true) {
    let that = this
    var index = this.data.categoryIndex
    var id = this.data.categoryList[index].id
    var pageNo = this.data.categoryList[index].pageNo
    var isFirst = this.data.categoryList[index].isFirst
    if (!more) {
      if (!isFirst) {
        return;
      }
    }
    GET('brochure/page', { type: id, current: pageNo, size: 30, userid: this.data.userInfo.id }, isShow, (flag, data, des) => {
      if (flag) {
        pageNo = pageNo + 1;
        var arr = that.data.categoryList[index].arr
        var list = data.records || [];
        list.map(obj => {
            obj.num = 0;
            arr.push(obj)
        })
        that.setData({
          ["categoryList[" + index + "].pageNo"]: pageNo,
          ["categoryList[" + index + "].arr"]: arr,
          ["categoryList[" + index + "].isFirst"]: false,
        })
      } else {
        show(des)
      }
    })
  },
  clickToChangeCategory(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      categoryIndex: index
    })
    this.requestToPopsById()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  clickShow(e){
    let that = this
    let typeId = e.currentTarget.dataset.id
    POST('organizationquota/queryByTypeAndOrg', { organizationid: this.data.organizationid, brochuretypeid: typeId }, false, (flag, data, des) => {
      if (flag) {
        that.setData({
          nowOrgQuotaObj: data ? data : { quotaNum: 0, organizationid: this.data.organizationid, brochuretypeid: typeId},
          applyListVisiable: true
        })
      } else {
        show(des)
      }
    })
  },
  applyConfirm(isShow = true){
    var that = this;
    var nowOrgQuotaObj = that.data.nowOrgQuotaObj;
    POSTJSON('organizationquota/a/edit', nowOrgQuotaObj, isShow, (flag, data, des) => {
      console.log(flag, data, des)
      if (flag) {
         that.setData({
           successVisiable: true
         })
      }else{
        show(des)
      }
    })
  },
  successConfirm(){
    wx.navigateBack({
      
    })
    //  this.setData({
    //    successVisiable:false
    //  })
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