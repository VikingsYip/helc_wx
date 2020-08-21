// pages/work/toApply/index.js
const { GET, POST, POSTJSON } = require('../../../utils/network.js')
const { show, user, formatYMD } = require('../../../utils/util.js')
// const { dateTimePicker } = require('../../../utils/dateTimePicker.js')
const app = getApp()
const defaultAddress=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    againId:"",
    detailShow:false,
    warnShow:false,
    toastVisiable:false,
    applyListVisiable: false,
    successVisiable: false,
    userInfo:{},
    categoryList: [],
    categoryIndex: 0,
    categoryCurrent:1,
    detail:{},
    applyList:[],
    againArr:[],
    allPrice: 0,
    allNum: 0,
    applyObj:{},
    againDetail: {},
    currentTime:'',
    radioArr:[{
      name:"1",
      checked:true,
      value:"普通物流(年度预算场数范围内，请选此处)",      
    }, {
      name:"2",
      checked: false,
      value: "其他物流(年度预算场数范围外，请选此处)",
      }],
    radioDefaultArr:[{
      name:"1",
      checked:true,
      value:"是",      
    }, {
      name:"0",
      checked: false,
      value: "否",
      }],
    isTC: 0,
    otherAddress: "",
    showPopup: false,
    showScale: false,
    minDate: new Date().getTime(),
    eventTime: '',
    eventNumberPeople:'',
    eventAddress:'',
    defaultArr: '',
    columns:[]
  },

  onHandleShowPopup() {
    this.setData({
      showPopup:true
    })
  },
  onHandleShowScale() {
    this.setData({
      showScale:true
    })
  },

  onChange(event) {
    this.setData({
      eventNumberPeople:event.detail.value.text
    })

  },

  onHandleClose() {
    this.setData({
      showPopup: false,
      showScale:false
    })
  },
  onInputScale(event) {
    this.setData({
      eventNumberPeople:event.detail.value.text
    })
  },
  onInput(event) {
    this.setData({
      eventTime: formatYMD(new Date(event.detail)),
    });
  },


  scrollMoreL() {
    this.requestToCategory(false)
  },
  scrollMoreR() {
    this.requestToPopsById(true, false)
  },
  isTCHandle(e){
    var categoryIndex = 0
    var flag = true;
    var id = "";
    this.data.categoryList.map((obj, index) => {
      if (flag && obj.isSet == e.target.dataset.key) {
        categoryIndex = index
        flag = false
        if (obj.isFirst){
          id = obj.id
        }
      }
    })

    this.setData({
      categoryIndex: categoryIndex,
      isTC: e.target.dataset.key
    })
    if(id){
      this.requestToPopsById()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var DATE = formatYMD(new Date()); 
      this.setData({
        isTC:options.isSet||0,
        userInfo: user.getUser(),
        againId: options.againId,
        currentTime:DATE
      })
      if (this.data.againId){
        this.getDetail()
      }else{
        this.requestToCategory()
    }
  },
  getDetail() {
    var that = this;
    var id = this.data.againId;
    GET("apply/id", { id: id }, true, (flag, data, des) => {
      if (flag) {
        that.setData({
          againDetail: data
        })
        that.requestToCategory()
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
  radioChange(e){
    var index = e.detail.value
    var radioArr = this.data.radioArr;
    radioArr.map((obj,idx)=>{
       if(index == idx){
         obj.checked = true
       }else{
         obj.checked = false
       }
    })
    this.setData({
      radioArr: radioArr
    })
  },
  radioChangeDefault(e) {
    
    var index = e.detail.value
    var radioDefaultArr = this.data.radioDefaultArr;
    radioDefaultArr.map((obj, idx) => {
       if (index==1) {
         this.setData({
            otherAddress:''
         })
       } else {
        this.setData({
          otherAddress:this.defaultAddress
       })
       }
       if(index == idx){
         obj.checked = true
       }else{
         obj.checked = false
       }
    })
    this.setData({
      radioDefaultArr: radioDefaultArr
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        var query = wx.createSelectorQuery()
        query.select("#isTC").boundingClientRect()
        query.select("#bottom").boundingClientRect()
        // query.select("#isTC").boundingClientRect()
        query.exec(function (res1) {
          that.setData({
            //计算scroll需要的高度
            scrollHeight: res1[1].top - res1[0].bottom - (res.screenWidth/750) * 60,
          })
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
    GET('brochureType/page', { current: categoryCurrent, name: '', size: 1000 }, isShow, (flag, data, des) => {
      if (flag) {
        var againArr = []
        var categoryIndex = 0
        var flag = true;
        data.records.map((obj,index) => {
          obj.pageNo = 1;
          obj.isFirst = true;
          obj.num = 0;
          var arr = []
          if(that.data.againId){
            that.data.againDetail.brochure.map((obj2, index2) => {
              if (obj2.type == obj.id) {
                if(obj2.isSet==1){
                  obj2.isSet=2
                  // obj2.num2 = obj2.num;
                  obj2.num = 0
                  obj.num = 0
                }
                againArr.push(obj2.id)
                obj.hasAgain = true
                obj2.hasAgain = true
                obj2.organizationQuota = that.data.againDetail.organizationQuota[index2]
                obj2.num = that.data.againDetail.applyDtls[index2].applyNum
                arr.push(obj2)
              }
            })
          }
          if (flag && obj.isSet==that.data.isTC){
            categoryIndex = index
            flag = false
          }
            obj.arr = arr
            categoryList.push(obj)
        })

        that.setData({
          categoryIndex: categoryIndex,
          againArr: againArr,
          categoryList: categoryList,
          categoryCurrent: Number(categoryCurrent) + 1,
        })
        that.requestToPopsById()
      } else {
        show(des)
      }
    })
  },
  /**请求宣传品列表 */
  requestToPopsById(more,isShow = true) {
    let that = this
    var index = this.data.categoryIndex
    var id = this.data.categoryList[index].id
    var pageNo = this.data.categoryList[index].pageNo
    var isFirst = this.data.categoryList[index].isFirst
    var againArr = this.data.againArr
    if (!more) {
      if (!isFirst) {
        return;
      }
    }
    GET('brochure/page', { type: id, current: pageNo, size: 1000, userid: this.data.userInfo.id }, isShow, (flag, data, des) => {
      if (flag) {
        pageNo = pageNo + 1;
        var arr = that.data.categoryList[index].arr
        var list = data.records || [];
        list.map(obj => {

          if(obj.isSet==1){
            obj.isSet=2
          }
          if(againArr.indexOf(obj.id) == -1){
            obj.num = 0;
            arr.push(obj)
          }
        })
        that.setData({
          ["categoryList[" + index + "].pageNo"]: pageNo,
          ["categoryList[" + index + "].arr"]: arr,
          ["categoryList[" + index + "].isFirst"]: false,
        })
        that.getTCDetail(id,index)
      } else {
        show(des)
      }
    })
  },
  getTCDetail(id,index){
    var categoryList = this.data.categoryList[index]
    var categoryListArr = categoryList.arr
    GET('brochure/detailpage', { type: id, userid: this.data.userInfo.id }, true, (flag, data, des) => {
      if (flag) {
        
        var num = 0
        data.records.forEach(function(obj){
          var detailcount = obj.detailcount;
          var flag = false
          categoryListArr.forEach(function(obj2){
             if(obj2.isSet==2){
               if (obj2.id==obj.id){
                 flag = true
                 obj2.detailcount = detailcount
                 obj2.isSet = 1
               }
             }
          })
          if (flag==false){
            obj.isSet=1
            obj.num=0
            categoryListArr.push(obj)
          }
        })
       
        this.setData({
          ["categoryList["+index+"].arr"]: categoryListArr
        })  

      } else {
        show(des)
      }
    })
  },
  clickToChangeCategory(e) {
    let index = e.currentTarget.dataset.index
    console.log(index);
    console.log(this.data.categoryList);
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
  successConfirm(){
    if (this.data.againId) {
      let pages = getCurrentPages();
      if (pages.length > 2) {
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          againBack: true
        })
      }
    }
    wx.navigateBack({

    })
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

  clickToApply(e) {
    var allPrice = 0;
    var allNum = 0;
    var applyList = [];
    var applyObj = {}
    var arr = this.data.categoryList;
    
    arr.map(x=>{
      x.arr.map(y=>{
        if(y.isSet!=2){
          if (y.num != 0) {
            // console.log(y);
            // if(y.isSet==1){
            if (y.isSet == 1 && y.isSet == this.data.isTC) {

              allNum = Number(allNum) + Number(y.num) * Number(y.detailcount);
              allPrice = (Number(allPrice) + (y.num * y.detailcount * y.costPrice)).toFixed(2);
              // console.log(y);
              applyList.push(y)
              if (applyObj[y.verifySupplierName]) {
                applyObj[y.verifySupplierName].arr.push(y)
              } else {
                applyObj[y.verifySupplierName] = {
                  name: y.verifySupplierName,
                  arr: [y]
                }
              }
            } else if (y.isSet == 0 && y.isSet == this.data.isTC) {

              allNum = Number(allNum) + Number(y.num);
              allPrice = (Number(allPrice) + (y.num * y.costPrice)).toFixed(2);

              applyList.push(y)
              if (applyObj[y.verifySupplierName]) {
                applyObj[y.verifySupplierName].arr.push(y)
              } else {
                applyObj[y.verifySupplierName] = {
                  name: y.verifySupplierName,
                  arr: [y]
                }
              }
            }
            
          }
        }
      })
    })  
    if (allNum==0){
      show("请先选择申领内容")
    } else {
      if (this.data.isTC==1) {
        GET("dropdown/pcode", { pcode: 'HDGM' }, true, (flag, data, des) => {
          if (flag) {
            let columns=JSON.parse(JSON.stringify(data).replace(/name/g,"text"));
            this.setData({
              columns
            })
          } else {
            show(des)
          }
        })
      }
      this.setData({
        allNum: allNum,
        allPrice: Number(allPrice).toLocaleString(),
        applyList: applyList,
        applyObj: applyObj,
        applyListVisiable: true,
        otherAddress:this.data.userInfo.recipientAddr
      })
    }
    this.defaultAddress=this.data.otherAddress
  },
  applyConfirm(){
    var that = this
    var radioArr = this.data.radioArr;
    var radioDefaultArr = this.data.radioDefaultArr;

    var check = ""
    var checkDefault = ""
    var logisticsType=''
    radioArr.map((obj) => {
      if (obj.checked) {
        check = obj.name
        logisticsType=obj.name
      }
    })
    radioDefaultArr.map((obj) => {
      if (obj.checked) {
        checkDefault = obj.name
      }
    })
    if(check){
      var applyDtls = []
      this.data.applyList.map(obj=>{
        applyDtls.push({
          brochureId: obj.id,
          applyNum: (obj.isSet == 1) ? obj.num * obj.detailcount : obj.num
        })
      })
      
      var canshu = {
        logisticsType,
        checkDefault,
        applyDtls: applyDtls,
        id: this.data.againId,
        remark: this.data.applyRemark
      }

      if (this.data.isTC==1) {
        // var eventNumberPeople = this.data.eventNumberPeople
        // if (eventNumberPeople) {
        //   this.data.columns.map((item) => {
        //     if (item.text == this.data.eventNumberPeople) {
        //       canshu.eventNumberPeople = item.code;
        //     }
        //   })
        // } else {
        //   show("请输入活动规模")
        //   return;
        // }
        var eventTime = this.data.eventTime
        if (eventTime) {
          canshu.eventTime=this.data.eventTime
        } else {
          show("请选活动时间")
          return;
        }

        var eventAddress = this.data.eventAddress
        if (eventAddress) {
          canshu.eventAddress=this.data.eventAddress
        } else {
          show("请选活动地址")
          return;
        }
      }

      var otherAddress = this.data.otherAddress
      if (otherAddress) {
        canshu.otherAddress = this.data.otherAddress
      } else {
        show("请输入地址")
        return;
      }      

      if(this.data.againId){
        POSTJSON('apply/u/edit', canshu , true, (flag, data, des) => {
          if (flag) {

            that.setData({
              applyListVisiable: false,
              
              successVisiable: true
            })
          } else {
            show(des)
          }
        })
        return false;
      }else{
        POSTJSON('apply/u/add', canshu , true, (flag, data, des) => {
          if (flag) {
            that.setData({
              applyListVisiable: false,
              successVisiable: true
            })
            wx.requestSubscribeMessage({
              tmplIds: ["kAAZjXhdEYb0aBCz_yalZ6nk2Qf07SGh8rZc5DdIDmU"],
              success: (res) => {
                if (res["kAAZjXhdEYb0aBCz_yalZ6nk2Qf07SGh8rZc5DdIDmU"] == "reject") {
                  wx.showModal({
                    complete: (res) => { },
                    confirmText: '关闭',
                    content: '您取消了消息订阅，后续可以在个人中心中手动开启',
                    showCancel: false,
                    success: (result) => {
                      wx.navigateBack({})
                    },
                    title: '提醒',
                  })
                } else {
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
          } else {
            show(des)
          }
        })
        return false;
      }
      
    }else{
      show("请先选择物流方式")
      return false;
    }
  },
  clickToDetail(e){
    var index = e.currentTarget.dataset.index;
    var obj = this.data.categoryList[this.data.categoryIndex].arr[index];
    this.setData({
      detail: obj,
      detailShow: true
    })
  },
  clickToShowWarn(e){
    this.setData({
      warnShow:true
    })
  },
  reduceNum(e){
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.num;
    var obj = this.data.categoryList[this.data.categoryIndex].arr[index];
    num = (num - 50 < 0) ? 0 : num - 50;
       this.setData({
         ["categoryList[" + this.data.categoryIndex +"].arr["+ index +"].num"] : num
       })
  },
  addNum(e) {
    
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.num;
    var obj = this.data.categoryList[this.data.categoryIndex].arr[index];

    var min = 0;
    var maxapply = obj.maxApplyNum || 0;
    
    var max = (maxapply < 0) ? 0 : maxapply
    var tishi = "不能超过最大额度"

    num = num + 50;
    if (num <= max) {
        this.setData({
          ["categoryList[" + this.data.categoryIndex + "].arr[" + index + "].num"]: num
        })

    } else {
        this.setData({
          ["categoryList[" + this.data.categoryIndex + "].arr[" + index + "].num"]: max
        })
        show(tishi)
    }
  },
  inpNum(e){
    var index = e.currentTarget.dataset.index;
    var obj = this.data.categoryList[this.data.categoryIndex].arr[index];
    var min = 0;
    var maxapply = obj.organizationQuota[0].quotanum || 0;
    var num = Number(e.detail.value);
    var max = (maxapply < 0) ? 0 : maxapply
    var tishi = "不能超过最大额度"

    if ((/^\d{1,}$/.test(num))){
      if (num <= max) {
          this.setData({
            ["categoryList[" + this.data.categoryIndex + "].arr[" + index + "].num"]: num
          })
      } else {
        this.setData({
          ["categoryList[" + this.data.categoryIndex + "].arr[" + index + "].num"]: max
        })
        show(tishi)
      }
    }else{
      show("输入正确格式")
      this.setData({
        ["categoryList[" + this.data.categoryIndex + "].arr[" + index + "].num"]: 0
      })
      return
    }
    
  },
  reduceCategoryList(e){
    var index = e.currentTarget.dataset.index;
    var min = 0;
    var num = Number(e.currentTarget.dataset.num);
    num = (num-5)<0 ? 0 : num-5
    var list = this.data.categoryList[index].arr
    list.forEach(function(obj){
      if(obj.isSet==1){
        obj.num = num
        obj.setmeal=index
      }
    })
    this.setData({
      ["categoryList[" + index + "].num"]: num,
      ["categoryList[" + index + "].arr"]: list
    })
  },
  inpCategoryList(e) {
    var index = e.currentTarget.dataset.index;
    var num = Number(e.detail.value);
    if ((/^\d{1,}$/.test(num))) {
      
    } else {
      num = 0
      show("输入正确格式")
    }
    var list = this.data.categoryList[index].arr
    list.forEach(function (obj) {
      if (obj.isSet == 1) {
        obj.num = num
      }
    })
    this.setData({
      ["categoryList[" + index + "].num"]: num,
      ["categoryList[" + index + "].arr"]: list
    })
   },
  addCategoryList(e) {
    var index = e.currentTarget.dataset.index;
    var min = 0;
    var num = Number(e.currentTarget.dataset.num);
    num = num + 5
    var obj = this.data.categoryList[index]
    var list = obj.arr
    var max = (obj.quotaNum < 0) ? 0 : obj.quotaNum
    console.log(this.data.categoryList[index])
    if(num>max){
      this.setData({
        ["categoryList[" + this.data.categoryIndex + "].arr[" + index + "].num"]: max
      })
      show("不能超过最大额度")
      return
    }
    list.forEach(function (obj) {
      if (obj.isSet == 1) {
        obj.num = num
        obj.setmeal=index
      }
    })
    this.setData({
      ["categoryList[" + index + "].num"]: num,
      ["categoryList[" + index + "].arr"]: list
    })
   },
})