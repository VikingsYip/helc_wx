// pages/tabBar/work/work.js
const {GET,POST} = require('../../../utils/network.js')
const {user,show,setToken,getWxCode,setWxCode,validate,formatWeek} = require('../../../utils/util.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    roleType: -1,// 0 申请人，1 总公司管理员，2供应商  -1 未审核，
    proposerOptions:[
      {
        id:"1",
        image:"/static/images/icon_work_wysq.png",
        name:'我要申领'
      },
      {
        id:'2',
        image:"/static/images/icon_work_wdsqlb.png",
        name:'申领单'
      },
      {
        id:'3',
        image:"/static/images/icon_work_shfk.png",
        name:'订单/收货'
      },
      {
        id:'4',
        image:"/static/images/icon_work_ggxx.png",
        name:'公告信息'
      },
      {
        id:'5',
        image:"/static/images/icon_work_yjfk.png",
        name:'意见和建议'
      },
      {
        id:'6',
        image:"/static/images/icon_work_report.png",
        name:'查看报表'
      }
    ],
    adminOptions:[
      {
        id:"7",
        image:"/static/images/icon_work_splb.png",
        name:'审批列表'
      },
      {
        id:'8',
        image:"/static/images/icon_work_rkdlb.png",
        name:'入库单列表'
      },
      {
        id:'9',
        image:"/static/images/icon_work_kcgl.png",
        name:'管理库存'
      },
      {
        id:'10',
        image:"/static/images/icon_work_sjgl.png",
        name:'数据管理'
      },
      {
        id:'11',
        image:"/static/images/icon_work_ggxx.png",
        name:'公告信息'
      },
      {
        id:'12',
        image:"/static/images/icon_work_report.png",
        name:'查看报表'
      }
    ],
    supplierOptions:[
      {
        id:"13",
        image:"/static/images/icon_work_ckdlb.png",
        name:'出库工作单'
      },
      {
        id:'14',
        image:"/static/images/icon_work_stockinlist.png",
        name:'入库工作单'
      },
      {
        id:'15',
        image:"/static/images/icon_work_kcjl.png",
        name:'库存记录'
      },
      {
        id:'16',
        image:"/static/images/icon_work_ggxx.png",
        name:'公告信息'
      },
      {
        id:'17',
        image:"/static/images/icon_work_yjfk.png",
        name:'意见和建议'
      },
      {
        id:'18',
        image:"/static/images/icon_work_report.png",
        name:'查看报表'
      }
    ],
    adminDownOptions: [
      {
        id: "70",
        image: "/static/images/icon_work_splb.png",
        name: '审批列表（分）'
      },
      {
        id: '11',
        image: "/static/images/icon_work_ggxx.png",
        name: '公告信息'
      },
      {
        id: '12',
        image: "/static/images/icon_work_report.png",
        name: '查看报表'
      }
    ],
    adminUpOptions: [
      {
        id: "700",
        image: "/static/images/icon_work_splb.png",
        name: '审批列表（经理）'
      },
      {
        id: '11',
        image: "/static/images/icon_work_ggxx.png",
        name: '公告信息'
      },
      {
        id: '12',
        image: "/static/images/icon_work_report.png",
        name: '查看报表'
      }
    ],
    banners:[],
    date:'',
    noticeList: [],
    records:[]
  },
  onLoad: function (options) {
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        setWxCode(res.code)
        this.userLogin()
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    this.setData({
      date:formatWeek(new Date())
    })
    this.requestToOrganList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSetting({
      success(settingdata) {
        console.log(settingdata)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.requestToBannerList()
    this.getNoticeList()
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
  toMessage(){
    var id = this.data.noticeList[0].id
    if(id){
      wx.navigateTo({
        url: '/pages/work/message/message?id=' + id,
      })
    }
  },
  //首页各点击事件
  optionClick(e){
    let index = Number(e.currentTarget.dataset.index)
    switch (index){
      case 1:
        wx.navigateTo({
          url: '/pages/work/toApply/index',
        })
        break
      case 2:
        wx.navigateTo({
          url: '/pages/work/applyList/index',
        })
        break
      case 3:
        wx.navigateTo({
          url: '/pages/work/receive/index',
        })
        break
      case 4:
      case 11:
      case 16:
        wx.navigateTo({
          url: '/pages/work/messageList/index',
        })
        break
      case 5:
      case 17:
        wx.navigateTo({
          url: '/pages/work/feedback/feedbackList/index'
        })
        break
      case 6:
      case 12:
      case 18:
        wx.navigateTo({
          url: '/pages/work/report/index',
        })
        break
      case 7:
        wx.navigateTo({
          url: '/pages/work/admin/approval/index?flag=3',
        })
        break
      case 8:
        wx.navigateTo({
          url: '/pages/work/admin/stockList/index',
        })
        break
      case 9:
        wx.navigateTo({
          url: '/pages/work/admin/stockAdmin/index',
        })
        break
      case 10:
        wx.navigateTo({
          url: '/pages/work/admin/dataAdmin/index',
        })
        break
      case 13:
        wx.navigateTo({
          url: '/pages/work/supplier/stockOut/index',
        })
        break
      case 14:
        wx.navigateTo({
          url: '/pages/work/supplier/stockIn/index',
        })
        break
      case 15:
        wx.navigateTo({
          url: '/pages/work/supplier/stockHistory/index',
        })
        break
      case 70:
        wx.navigateTo({
          url: '/pages/work/admin/approval/index',
        })
        break
      case 700:
        wx.navigateTo({
          url: '/pages/work/admin/approval/index',
        })
        break
    }
  },
  getNoticeList() {
    let that = this
    GET('notice/page', { current: 1, size: 1 }, false, (flag, data, des) => {
      if (flag) {
        var list = data.records
        if(list.length==0){
          list = [{
            title: "暂无公告",
            content: "暂无公告",
          }]
        }
        that.setData({
          noticeList: list
        })
      } else {
        show(des)
      }
    })
  },
  //登录
  userLogin(){
    let that = this
    POST('user/login',{code:getWxCode()},true,(flag,data,des)=>{
      if (flag && data.roleId) {
        user.save(data)
        setToken(data.token)
        app.globalData.userInfo = data;
        //data.roleId = "ROLE_ADMIN";
        switch (data.roleId){
          case 'ROLE_NO':
            that.setData({
              roleType:-1
            })
            if (validate.isEmpty(data.organization)) {
              wx.showModal({
                confirmText: '前往',
                content: '您还未获得授权，是否前往申请',
                title: '提醒',
                complete: (res) => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/register/user/index',
                    })
                  }
                },
              })
            }
            break
          case 'ROLE_SUP':
            that.setData({
              roleType: 2
            })
            break
          case 'ROLE_ADMIN':
            // 总公司管理员
            that.setData({
              roleType: 1
            })
            break  
          case 'ROLE_USER':
            that.setData({
              roleType:0
            })
            break
          case 'ROLE_DOWN_ADMIN':
            // 分公司领导
            that.setData({
              roleType: 3
            })
            break
          case 'ROLE_UP_ADMIN':
            // 总公司领导
            that.setData({
              roleType: 4
            })
            break
        }
        
      }else{
        show(des)
      }
      
    })
  },

  clickToChange(e){
  //  return;
    let value = this.data.roleType
    value++
    this.setData({
      roleType:value%5
    })
  },

  requestToBannerList(){
    let that = this
    GET('banner/list',{},true,(flag,data,des)=>{
      if (flag){
        that.setData({
          banners:data||[]
        })
      }else{
        show(des)
      }
    })
  },

  requestToOrganList(){
    let that = this;
    GET('user/adminUser', {} ,true,(flag,data,des)=>{
      if (flag) {
        console.log(data);
      
        that.setData({
          records:data
        })
      }else{
        show(des)
      }
    })
  },
})