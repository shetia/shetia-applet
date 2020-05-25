//index.js
//获取应用实例
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
import {formatTime} from '../../utils/util.js'
import words from './words.js'
Page({
  data: {
    motto: '欢迎来到我的世界!',
    userInfo: {},
    hasUserInfo: false,
    canIUse: '',
    word: '',
    weatherInfo:null,
    bannerbg:0,
    sudoku: [
      {url: '/pages/funtime/funtime', text: '开心一刻', img: '../../imgs/funtime.png'},
      {url: '/pages/mind/mind', text: '脑筋急转弯', img: '../../imgs/mind.png'},
      {url: '/pages/lantern/lantern', text: '猜灯谜', img: '../../imgs/lantern.png'},
    ]
  },
  goPage(e){
    let url = e.currentTarget.dataset.url || ''
    console.log(e)
    wx.navigateTo({
      url
    })
  },
  //事件处理函数
  bindViewTap: function() {

  },
  changeWord () {
    let index = Math.round(Math.random() * words.length)
    let word = words[index]
    this.setData({
      word
    })
  },
  onLoad: function () {
    
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
        key: 'BLZBZ-CPFH3-HIR37-YBUKB-UBQGO-BKFCN'
    })

    this.setData({
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getWeatherInfo()
  },
  onShow: function () {
    this.changeWord()
    this.setData({
      bannerbg: Math.random() * 240 + 20
    })
  },
  //获取天气信息
  getWeatherInfo () {
    try {
      var weather = wx.getStorageSync('weather')
      if (weather) {
        let weatherData = JSON.parse(weather)
        let now = new Date().getTime()
        // 4个小时
        if(now - weatherData.time > 4 * 60 * 60 * 1000){
          this.getSite()
        } else {
          this.setData({
            weatherInfo: weatherData.now
          })
        }
      } else {
        this.getSite()
      }
    } catch (e) {
      this.getSite()
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 获取经纬度
  getLoation () {
    let vm = this
    wx.getLocation({
      type: 'wgs84',
      success(res){
        console.log(res)
      },
      fail(e){
        console.log('失败', e)
      }
    })
  },
  // 获取地点名字
  getSite(e) {
    var _this = this;
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
        // location: {
        //   latitude: 39.984060,
        //   longitude: 116.307520
        // },
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function(res) {//成功后的回调
        var resData = res.result;
        let city = resData.ad_info.city
        _this.getWeather(city)
      },
      fail: function(error) {
        console.error(error, '获取位置信息失败');
      },
      complete: function(res) {
        // console.log(res);
      }
    })
  },
  // 调用天气api
  getWeather (location) {
    let _this = this
    let url = `https://free-api.heweather.net/s6/weather/now?`
    wx.request({
      url: url,
      data: {
        location,
        key: '8721ebd85f64465bb719536cc5c25146'
      },
      success(res){
        // console.log(res, '天气')
        let resData = res.data.HeWeather6[0] || {}
        let info = resData && resData.now || {}
        _this.setData({
          weatherInfo: info
        })
        // 缓存到本地
        let time = new Date().getTime()
        resData.time = time
        wx.setStorage({
          key:"weather",
          data: JSON.stringify(resData)
        })
      },
      fail(e){
        console.log('调用请求失败', e)
      }
    })
  }
})
