// pages/bird/brid.js
let windowWidth = wx.getSystemInfoSync().windowWidth
let windowHeight = wx.getSystemInfoSync().windowHeight
let pixelRatio = wx.getSystemInfoSync().pixelRatio
let maxHeight = windowHeight * pixelRatio
let maxWidth = windowWidth * pixelRatio
let pillarList = []
let birds = {
  stepx: 52,
  stepy: 0,
  x: 49,
  y: 130
}
let flying = true
let gameloop = null
let max = 2000
Page({
  /**
   * 页面的初始数据
   */
  data: {
    initloop: null,
    skybg: '',         // 背景
    birdbg: '',       // 小鸟
    isScroll: false,  // 控制背景滚动
    isStart: false,
    end: false,
    bird:null,
    pillarList: pillarList,
    total: 1000,
    max: max,
    score: 0
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
    let pillarup = wx.getFileSystemManager().readFileSync('imgs/pipe2.png', 'base64')
    let pillardown = wx.getFileSystemManager().readFileSync('imgs/pipe1.png', 'base64')
    this.setData({
      skybg: 'data:image/png;base64,' + skybase64,
      birdbg: 'data:image/png;base64,' + birdbase64,
      pillarup: 'data:image/png;base64,' + pillarup,
      pillardown: 'data:image/png;base64,' + pillardown
    })
  },
  init(){
    birds = {
      stepx: 52,
      stepy: 0,
      x: 49,
      y: 130
    }
    flying = true
    pillarList = [
      {x: 200,  randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 400,  randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 600,  randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 800, randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 1000, randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 1200, randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 1400, randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 1600, randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 1800, randomH: 50 + Math.ceil(Math.random() * 120)},
      {x: 2000, randomH: 50 + Math.ceil(Math.random() * 120)},

    ]
    this.setData({
      bird: {
        left: birds.x + '%',
        top: birds.y
      },
      isStart:false,
      end: false,
      pillarList,
      total: max,
      max: max,
      score: 0
    })
  },
  game() {
    let _this = this
    let birdy = 100
    this.setData({
      isStart: true,
      isScroll: true,
      end: false
    })
    let total
    gameloop = setInterval(() => {
      total = this.data.total
      if (flying) {
        birdy += birds.stepy
        birds.stepy += 1
        total -= 5    // 柱子移动
          if(total < -38){
            total = max - 38
        }
      }
      if(birdy < -10 || birdy > maxHeight || this.isCrash(total)){
        flying = false
        clearInterval(gameloop)
        this.over()
        return
      }
      this.setData({
        bird: {
          left: '50rpx',
          top: birdy
        },
        total: total
      })
    }, 30)
  },
  //检测小鸟是否碰柱子
  isCrash (total) {
    let y = this.data.bird.top
    for(let item of pillarList){
      let last = max - item.x
      let left = total - last
      if(left < 80 && left >= 0){
          let up = item.randomH
          if(up >= y || up + 120 <= y){
            return true
          }
          // 统计分数
          if(parseInt(left) <= 0){
            this.setData({
              score: this.data.score + 1
            })
          }
      }
    }
     return false
  },
  over(){
    this.setData({
      end: true,
      isScroll: false
    })
  },
  again () {
    this.init()
  },
  start(e){
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