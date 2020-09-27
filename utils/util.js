const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatWeek = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]

  return [year, month, day].map(formatNumber).join('-') + ' 星期' + week
}

const formatYMD = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-') 
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getToken = () => {
  return wx.getStorageSync('app_token')
}

const setToken = token => {
  wx.setStorageSync('app_token', token)
}

const setWxCode = code => {
  wx.setStorageSync('wx_code', code)
}

const getWxCode = () => {
  return wx.getStorageSync('wx_code')
}

const show = function (msg) {
  wx.showToast({
    title: msg,
    duration: 1500,
    icon: 'none',
    mask: true
  })
}

const showSuccess = function (msg) {
  wx.showToast({
    title: msg,
    duration: 1500,
    icon: 'success',
    mask: true
  })
}

const isEmpty = str => {
  let value = str || ''
  if (value.length == 0) {
    return true
  } else {
    return false
  }
}

const isNotEmpty = str => {
  let value = str || ''
  if (value.length == 0) {
    return false
  } else {
    return true
  }
}

//验证移动电话
const mobilePhone = str => {
  const reg = /1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
  return reg.test(str);
};

//验证字母开头，6-30位账号
const account = str => {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/;
  return reg.test(str);
};
//验证邮箱
const email = str => {
  const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  return reg.test(str)
}
//验证固定电话
const telephone = str => {
  const reg = /^0\d{2,3}-?\d{7,8}$/;
  return reg.test(str);
}
//验证身份证号码
const idNumber = str => {
  const myreg = /[0-9]{17}([0-9]|X)|[0-9]{15}([0-9]|X)/;
  return myreg.test(str);
};

//判断是否银行卡号 公司的帐号银行不准如华夏的
const bankNumber = cardNo => {
  if (isNaN(cardNo))
    return false;
  if (cardNo.length < 12) {
    return false;
  }
  var nums = cardNo.split("");
  var sum = 0;
  var index = 1;
  for (var i = 0; i < nums.length; i++) {
    if ((i + 1) % 2 == 0) {
      var tmp = Number(nums[nums.length - index]) * 2;
      if (tmp >= 10) {
        var t = tmp + "".split("");
        tmp = Number(t[0]) + Number(t[1]);
      }
      sum += tmp;
    } else {
      sum += Number(nums[nums.length - index]);
    }
    index++;
  }
  if (sum % 10 != 0) {
    return false;
  }
  return true;
}

//银行卡增加空格，4个显示的
const addSpan = str => {
  if (!str)
    return '';
  else
    return str.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
}
//删除空格
const delSpan = str => {
  if (!str)
    return '';
  else
    return str.replace(/\s|\xA0/g, "");
}

//判断是否为图片
const image = str => {
  let imageTypes = ["jpg", "jpeg", "png", "gif"]
  if (!str) {
    return;
  }
  let suffix = str.substr(str.lastIndexOf(".") + 1);
  if (imageTypes.indexOf(suffix.toLowerCase()) !== -1) {
    return true;
  } else {
    return false;
  }

}

const validate = {
  mobilePhone: mobilePhone,
  telephone: telephone,
  image: image,
  account: account,
  email: email,
  isEmpty: isEmpty,
  isNotEmpty: isNotEmpty
}


//社会信用代码或纳税人识别码检测
function validateCompanyCode(code) {
  if (!code || code.length != 18) {
    //alert("社会信用代码长度错误！");
    return false;
  }
  code = code.trim();
  var reg = /^\d{6}[A-Za-z0-9]{12}$/;///^[0-9]{6}[0-9a-zA-Z]{12}$/;
  if (!reg.test(code)) {
    //alert("社会信用代码校验错误！");
    return false;
  }
  return true;

}

const user = {
  getName : () => {
    return wx.getStorageSync('save_user').userName || ''
  },
  getOrganizationName : () => {
    return wx.getStorageSync('save_user').userName || ''
  },
  save : (u) => {
    wx.setStorageSync('save_user', u)
  },
  getUser : () => {
    return wx.getStorageSync('save_user')
  }
}

module.exports = {
  formatWeek,
  formatTime: formatTime,
  formatYMD,
  getToken,
  setToken,
  setWxCode,
  getWxCode,
  show,
  showSuccess,
  validate,
  user
}
