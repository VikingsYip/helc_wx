// pages/work/admin/dataAdmin/auth/index.js
const {POST,GET} = require('../../../../../utils/network.js')
const {validate,show,showSuccess} = require('../../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // editShow:false,
    current:1,
    size:10,
    searchName:'',
    records:[],
    cIndex:-1,
    showType:-1,//-1不显示，0显示申请人信息，1显示角色授权
    roleList:[],
    rIndex:-1,
    organization: [],
    organizationIndex:-1,
    multiOrganList:[],
    multiIndex:[0,0],
    multiArray:[],
    currentOrgan:{},
    radioDefaultArr:[{
      name:"0",
      checked:false,
      value:"只显示单品",      
    }, {
      name:"1",
      checked: false,
      value: "只显示套餐",
    },{
      name:"2",
      checked: true,
      value: "单品和套餐都显示",
    }  
  ],
    organId:-1
  },
  radioChangeDefault(e) {
    
    var index = e.detail.value
    var radioDefaultArr = this.data.radioDefaultArr;
    radioDefaultArr.map((obj, idx) => {
      console.log(index);
      console.log(idx);
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
  organizationChange(e){
    // this.setData({
    //   organizationIndex: e.detail.value
    // })
    var organizationIndex =  e.detail.value;
    var orgId = this.data.organization[organizationIndex].id
    this.setData({
      organId: orgId,
      organizationIndex: organizationIndex
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrganization()//获取供应商组织机构
    this.requestToOrganList()//获取非供应商组织机构
    this.requestToList()
    this.requestToRoleList()
  },
  getOrganization() {
    let that = this
    GET('organization/list', { corporateType: "1" }, false, (flag, data, des) => {
      if (flag) {
        that.setData({
          organization: data || []
        })
      } else {
        show(des)
      }
    })
  },
  /*************zzh******** */
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
      organId:organ.id
    })
    console.log(this.data.currentOrgan)
  },
  /*************zzh********* */
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
    this.data.current = 1
    this.requestToList(false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.current = this.data.current + 1
    this.requestToList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  requestToList(isShow = true){
    let that = this
    let list = this.data.records
    GET('permissions/a/user/role/page',{current:this.data.current,size:this.data.size,name:this.data.searchName},isShow,(flag,data,des)=>{
      wx.stopPullDownRefresh()
      if(flag){
        if (that.data.current == 1){
          list = []
        }
        list = list.concat(data.records||[])
        that.setData({
          records:list
        })
      }else{
        show(des)
      }

    })
  },

  clickToDetail(e){
    let index = e.currentTarget.dataset.index
   
    this.setData({
      cIndex:index,
      showType:0
    })
  },

  clickToAuth(e){
    this.requestToList()
    this.requestToRoleList()
    let index = e.currentTarget.dataset.index
    this.setData({
      cIndex:index,
      showType:1
    })
    var roleId = this.data.records[index].roleId
    var idx = -1
    this.data.roleList.map((x,index)=>{
      if (x.code == roleId){
        idx = index
      }
    })
    var datasetId = this.data.records[index].dataset
    console.log(datasetId);
    var radioDefaultArr = this.data.radioDefaultArr.map((i) => {
       if (i.name==datasetId) {
          i.checked = true
          return i
        }else{
          i.checked = false
          return i
        }
    })
    this.setData({
      rIndex: idx,
      radioDefaultArr
    })
  },
  clickToDelete(e){
    let index = e.currentTarget.dataset.index
    let that = this
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: '确认删除该申请人？',
      showCancel: true,
      title: '提醒',
      success: (result) => {
        if (result.confirm) {
          that.requestToDelete(index)
        }
      },
    })
  },

  clickToCloseInfo(){
    this.setData({
      showType:-1
    })
  },

  requestToDelete(index){
    let id = this.data.records[index].id
    let that = this
    POST('permissions/a/delete/user',{userId:id},true,(flag,data,des)=>{
      if(flag){
        showSuccess("删除成功")
        let list = that.data.records
        list.splice(index,1)
        that.setData({
          records:list
        })
      }else{
        show(des)
      }
    })
  },

  requestToRoleList(){
    let that = this
    GET('permissions/a/roleList',{},false,(flag,data,des)=>{
      if(flag){
        that.setData({
          roleList:data||[]
        })
      }
    })
  },

  pickerToChange(e){
    let index = e.detail.value
    this.setData({
      rIndex:index
    })
  },

  clickToBack(e){
    this.setData({
      showType:-1,
      rIndex: -1,
      organizationIndex: -1,
      organId:-1
    })
  },

  clickToSubmit(e){
    let that = this
    let userId = this.data.records[this.data.cIndex].id
    let roleId = this.data.roleList[this.data.rIndex].code
    //let datas= this.data.dataset[this.data.cIndex]
    var canshu = {
      userId: userId, roleId: roleId
    }
    if (roleId == 'ROLE_SUP'  || roleId=='ROLE_DOWN_ADMIN' || roleId=='ROLE_USER'){
      var orgId = this.data.organId
      console.log(orgId)
      if(orgId == -1){
        show("选择组织机构")
        return
      }else{
        canshu.orgId = orgId
        this.setData({
          organId: -1
        })
      }
      // var organizationIndex = this.data.organizationIndex
      // if (organizationIndex == -1){
      //   show("选择组织机构")
      //   return
      // }else{
      //   var orgId = this.data.organization[organizationIndex].id
      //   canshu.orgId = orgId
      // }

    }
    if (roleId=='ROLE_UP_ADMIN' || roleId=='ROLE_DOWN_ADMIN' || roleId=='ROLE_USER'){
      var dataset = this.data.radioDefaultArr;
      var ch = 0;
      //console.log(dataset);
      for(var i=0;i<dataset.length;i++){
        if (dataset[i].checked == true){
           ch = i;
          break;
        }
      }
      console.log(ch);
      canshu.dataset = ch;
    }

    POST('permissions/a/edit/userRole', canshu,true,(flag,data,des)=>{
      if (flag){
        that.setData({
          showType: -1,
        })
        showSuccess('授权成功')
      }else{
        that.setData({
          showType: -1,
        })
        show(des)
      }
    })
  },

  inputToSearch(e){
    this.data.current = 1
    this.requestToList()
  },

  inputToSearchValue(e){
    this.data.searchName = e.detail.value
  }
})