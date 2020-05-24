// pages/mind/mind.js
import words from './words'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word: {},
    index: 0,
    isShow: false,
    btnWord: '显示答案'
  },
  show () {
    let isShow = this.data.isShow
    this.setData({
      isShow: !isShow,
      btnWord: isShow ? '显示答案' : '隐藏答案'
    })
  },
  pre(){
    let index = this.data.index
    if(words[index - 1]){
      index--
    } else {
      index = words.length - 1
    }
    this.setData({
      word: words[index],
      index,
      isShow: false,
      btnWord: '显示答案'
    })
  },
  next(){
    let index = this.data.index
    if(words[index + 1]){
      index++
    } else {
      index = 0
    }
    this.setData({
      word: words[index],
      index,
      isShow: false,
      btnWord: '显示答案'
    })
  },
  getWord () {
    let index =Math.floor(Math.random() * words.length)
    this.setData({
      word: words[index],
      index,
      isShow: false,
      btnWord: '显示答案'
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWord()
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