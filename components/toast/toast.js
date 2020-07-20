// components/model/model.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    //模态框标题文字
    icon:{
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
      value:'rgba(0,0,0,0.4)'
    },
    value:{
      type:String,
      value:""
    },
    width:{
      type:String,
      value:"60vw"
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

  }
})
