// pages/bird/brid.js
let birds = {
  stepx: 52,
  stepy: 0,
  x: 500,
  y: 130
}
let flying = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initloop: null,
    skybg: '',
    birdbg: '',
    bgX: 0,
    skyX: 0,
    bird: {
      top: '130', // 垂直位置
      left: '49%'   // 水平位置
    },
    birdy: 0,
    stepy: 0,
    isScroll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.changeBase64()
    this.init()
  },
  changeBase64(){
    let skybase64 = wx.getFileSystemManager().readFileSync('imgs/sky.png', 'base64')
    let birdbase64 = wx.getFileSystemManager().readFileSync('imgs/bird1.png', 'base64')
    this.setData({
      skybg: 'data:image/png;base64,' + skybase64,
      birdbg: 'data:image/png;base64,' + birdbase64
    })
  },
  init(){
    this.setData({
      bgX: 0,
      skyX: 0,
      isScroll: true
    })
    let skyX = this.data.skyX
    birds = {
      stepx: 52,
      stepy: 0,
      x: 500,
      y: 130
    }
  },
  game() {
    this.setData({
      bird: {
        left: '50rpx',
        top: 50
      },
      stepy: 0,
      flying: true
    })
    let _this = this
    let birdy = 0
    setInterval(() => {
      if (this.data.flying) {
        birdy += birds.stepy
        birds.stepy += 1
        this.setData({
          bird: {
            left: '50rpx',
            top: birdy
          }
        })
      }
    }, 30)
  },
  stop () {
    this.setData({
      isScroll: false
    })
  },
  start(){
    this.game()
  },
  jump(){
    birds.stepy = -10
  },
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