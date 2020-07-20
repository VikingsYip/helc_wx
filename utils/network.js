const {getToken} = require('../utils/util.js')
const baseUrl = 'http://localhost:8083/'
//const baseUrl = 'https://hitachirdc.gzunicorn.com/'
const baseRequest = (method = 'POST', url = '', params = {}, isJson = false,isShow = false, complete) => {
  if (isShow) {
    wx.showLoading({
      title: '请求中...',
      mask: true
    })
  }
  return wx.request({
    url: baseUrl + url,
    data: params,
    header: {
      'token': getToken(),
      // 'token': "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDc1NjgyNDcsInVzZXJJZCI6ImZmMTQ5MDI0OWNmNjQ3OTRiMDk2ZGI4YTFkNTkzMTg4IiwiY3JlYXRlZCI6MTU5MTc1NzA0NzY4OX0.svwhfWDoQrCEa5WW61pyySuEKBVqEDehxjU2nMx2CPA",
      'content-type': isJson ? "application/json" : "application/x-www-form-urlencoded"
    },
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      if (isShow) {
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        let data = res.data
        if (data.code == 200) {
          complete&&complete(true, data.data, data.description ? data.description : data.msg)
        } else {
          complete&&complete(false, data.data, data.description ? data.description : data.msg)
        }
      } else {
        complete&&complete(false, -1, res.data.msg || "网络请求错误，请稍后重试")
      }
    },
    fail: function (res) {
      if (isShow) {
        wx.hideLoading()
      }
      complete&&complete(false, -1, "网络请求错误，请稍后重试")
    }
  })
}

const GET = (url = '', params = {}, isShow = false, complete = function (flag, code, description) { }) => {
  return baseRequest(
    'GET',
    url,
    params,
    false,
    isShow,
    complete
  )
}


const POST = (url = '', params = {}, isShow = false,complete = function(flag,code,description){}) => {
  return baseRequest(
    'POST',
    url,
    params,
    false,
    isShow,
    complete
  )
}

const POSTJSON = (url = '', params = {}, isShow = false,complete = function(flag,code,description){}) => {
  return baseRequest(
    'POST',
    url,
    params,
    true,
    isShow,
    complete
  )
}



const UPLOAD = (path,params = {}, isShow = false,complete = function(flag,code,description){}) => {
  if (isShow) {
    wx.showLoading({
      title: '请求中...',
      mask: true
    })
  }
  wx.uploadFile({
    filePath: path,
    name: 'file',
    url: baseUrl + 'upload/file',
    formData: params,
    dataType: 'json',
    responseType: 'text',
    header: {
      'token': getToken(),
      'content-type': "multipart/form-data"
    },
    success: (res) => {
      wx.hideLoading()
      if (res.statusCode == 200) {
        let data = JSON.parse(res.data)
        res.data = data
        console.log(res);
        if (data.code == 200) {
          complete&&complete(true, data.data, data.description ? data.description : data.msg)
        } else {
          complete&&complete(false, data.data, data.description ? data.description : data.msg)
        }
      } else {
        complete&&complete(false, -1, "网络请求错误，请稍后重试")
      }
      
    },
    fail: (res) => {
      wx.hideLoading()
      complete&&complete(false, -1, "网络请求错误，请稍后重试")
    },
  })
}

module.exports = {
  GET,POST,UPLOAD,POSTJSON
}