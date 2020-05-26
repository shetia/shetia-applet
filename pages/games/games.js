// pages/games/games.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: [
      { name: '2048', url: '/pages/game_2048/game_2048', color: 40, imgUrl:'../../imgs/2048.png'},
      { name: '五子棋', url: '/pages/gobang/gobang', color: 190, imgUrl: '../../imgs/gobang.png' },
      { name: '像素鸟', url: '/pages/bird/bird', color: 80, imgUrl: '../../imgs/bird.png' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goPage (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: item.url
    })
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