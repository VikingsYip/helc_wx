// components/model/model.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    confirmBtnText:{
      //确定按钮文字
      type:String,
      value:""
    },
    visiable: {
      //是否显示模态框
      type:Boolean,
      value:false,
    },
    bgc:{
      type: String,
      value:'rgba(255,255,255,0.4)'
    },
    icon:{
      type: String,
      value: 'success'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handleConfirm(){
      var flag = this.triggerEvent("confirm", {}, {})
      if(flag){
        this.setData({
          visiable: false,
        })
      }
    },
    _toggleShow(){
     this.triggerEvent("outside", {}, {})
      this.setData({
        visiable: false,
      })
    },
    
  }
})
