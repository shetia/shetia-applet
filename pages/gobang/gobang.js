// pages/gobang/gobang.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    list1: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    num: 0,
    isWin: false,
    who: 0,
    myWin: [],
    computerWin: [],
    wins: [],
    count: 0,
    winList: [],
    isMM: true  // 是否人机
  },
  // 初始化
  init() {
    let list = []
    let wins = []
    for (let i = 0; i < 15; i++) {
      list[i] = [];
      wins[i] = [];
      for (let j = 0; j < 15; j++) {
        list[i][j] = 0;
        wins[i][j] = [];
      }
    }
    let count = 0; //总共赢的数量572种
    //横向
    for (let a = 0; a < 15; a++) {
      for (let b = 0; b < 11; b++) {
        for (let c = 0; c < 5; c++) {
          wins[a][b + c][count] = 1
        }
        count++;
      }
    }
    //纵向
    for (let a = 0; a < 15; a++) {
      for (let b = 0; b < 11; b++) {
        for (let c = 0; c < 5; c++) {
          wins[b + c][a][count] = 1
        }
        count++;
      }
    }
    //斜 '\'
    for (let a = 0; a < 11; a++) {
      for (let b = 0; b < 11; b++) {
        for (let c = 0; c < 5; c++) {
          wins[a + c][b + c][count] = 1
        }
        count++;
      }
    }
    //反斜 '/'
    for (let a = 0; a < 11; a++) {
      for (let b = 4; b < 15; b++) {
        for (let c = 0; c < 5; c++) {
          wins[a + c][b - c][count] = 1
        }
        count++;
      }
    }
    //我方、计算机方总共可以赢的数量，每在某一方式上可以赢的位置下一颗子，myWin[i]++
    //当myWin[i] == 5,说明我方在这个方式上赢的落子已经达到5颗，说明我方已经赢了
    let myWin = []; //
    let computerWin = [];
    for (let i = 0; i < count; i++) {
      myWin[i] = 0;
      computerWin[i] = 0;
    }

    this.setData({
      list,
      wins,
      count,
      myWin,
      computerWin,
      isWin: false,
      num: 0,
      winList: []
    })
  },
  // 点击
  cellHandler (e) {
    let isMM = this.data.isMM  // 是否人机
    if (this.data.isWin) {
      let str = this.data.who % 2 === 0 ? '白棋' : '黑棋'
      wx.showToast({
        title: `游戏结束! ${str}获胜`,
        icon: 'none',
        duration: 2000
      })
      return
    }
    let item = e.currentTarget.dataset || {}
    let x = item.index || 0
    let y = item.subIndex || 0
    let list = this.data.list
    let num = this.data.num
    let count = this.data.count
    let wins = this.data.wins
    let myWin = this.data.myWin
    let computerWin = this.data.computerWin
    if (list[x][y]) { // 已经下了就不能再点了
      return
    }
    list[x][y] = ++num
    let k = 0
    while (k < count && isMM){
      //第几种赢法
      if (wins[x][y][k] === 1) {
        myWin[k]++;
        computerWin[k] = 6; //因为我方在这个点上已经落子，所以计算机不可能在这个点上赢，
      }
      if (myWin[k] === 5) {
        this.setData({
          list,
          num,
          computerWin,
          myWin, 
          isWin: true,
          who: 1
        })
        this.checkWin(list)  // 检测哪5个连珠
        wx.showToast({
          title: '游戏结束! 黑棋获胜',
          icon: 'none',
          duration: 2000
        })
        return
      }
      k++
    }

    this.setData({
      list,
      num,
      computerWin,
      myWin
    })
    if (isMM) {
      setTimeout(()=>{
        this.computerAI()
      })
    } else {
      // 如果不是人机, 就
      if (this.checkWin(list)) {
        let str = this.data.who % 2 === 0 ? '白棋' : '黑棋'
        wx.showToast({
          title: `游戏结束! ${str}获胜`,
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isWin: true
        })
      }
    }
  },
  // 机器人下
  computerAI() {
    let myScore = []; //我方分数
    let computerScore = []; //计算机分数
    let max = 0; //最大分数
    let x = 0, y = 0; //最大分数点
    let count = this.data.count
    let wins = this.data.wins
    let myWin = this.data.myWin
    let list = this.data.list
    let num = this.data.num
    let computerWin = this.data.computerWin
    for (let i = 0; i < 15; i++) {
      myScore[i] = []
      computerScore[i] = []
      for (let j = 0; j < 15; j++) {
        myScore[i][j] = 0;
        computerScore[i][j] = 0;
      }
    }
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (list[i][j] == 0) { //每个空闲点上进行计算分数
          for (let k = 0; k < count; k++) { //遍历所有可以赢的，数量
            if (wins[i][j][k]) { //可以赢的点进行算分

              if (myWin[k] == 1) {
                myScore[i][j] += 200;
              } else if (myWin[k] == 2) {
                myScore[i][j] += 400;
              } else if (myWin[k] == 3) {
                myScore[i][j] += 2000;
              } else if (myWin[k] == 4) {
                myScore[i][j] += 10000;
              }

              if (computerWin[k] == 1) {
                computerScore[i][j] += 220;
              } else if (computerWin[k] == 2) {
                computerScore[i][j] += 420;
              } else if (computerWin[k] == 3) {
                computerScore[i][j] += 2100;
              } else if (computerWin[k] == 4) {
                computerScore[i][j] += 20000;
              }
            }
          }

          //得出最大分数的点，并赋给x y
          if (myScore[i][j] > max) {
            max = myScore[i][j];
            x = i;
            y = j;
          } else if (myScore[i][j] == max) {
            if (computerScore[i][j] > computerScore[x][y]) {
              x = i;
              y = j;
            }
          }

          if (computerScore[i][j] > max) {
            max = computerScore[i][j];
            x = i;
            y = j;
          } else if (computerScore[i][j] == max) {
            if (myScore[i][j] > myScore[x][y]) {
              x = i;
              y = j;
            }
          }

        }//所有空闲点上进行计算分数
      }
    }
    list[x][y] = ++num
    for (var k = 0; k < count; k++) {
      //第几种赢法
      if (wins[x][y][k]) {
        computerWin[k]++
        myWin[k] = 6
        if (computerWin[k] === 5) {
          this.setData({
            list,
            num,
            computerWin,
            myWin, 
            isWin: true,
            who: 2
          })
          this.checkWin(list)  // 检测哪5个连珠
          wx.showToast({
            title: '游戏结束! 白棋获胜',
            icon: 'none',
            duration: 2000
          })
          return
        }
      }
    }
    this.setData({
      list,
      num,
      computerWin,
      myWin
    })
  },
  // 检测是否连五珠, 顺便获取赢的数组, 也可用于判断双人对战哪方胜利
  checkWin(list) {
    let total = 0
    let winList = []
    // 水平
    for (let i = 0; i < 15; i++) {  // 行
      for (let j = 0; j < 11; j++) { // 列
        total = 0
        let k = j
        let who = list[i][k] && list[i][k] % 2
        winList = []
        while (list[i] && list[i][k] && list[i][k] % 2 === who && k - j < 5) { // 检查五个
          winList.push(list[i][k])
          total++
          k++
        }
        if (total >= 5) {
          this.setData({
            winList,
            who
          })
          return true
        }
      }
    }
    // 垂直
    for (let i = 0; i < 15; i++) {  // 列
      for (let j = 0; j < 11; j++) { // 行
        total = 0
        let k = j
        let who = list[k][i] && list[k][i] % 2
        winList = []
        while (list[k] && list[k][i] && list[k][i] % 2 === who && k - j < 5) { // 检查五个
          winList.push(list[k][i])
          total++
          k++
        }
        if (total >= 5) {
          this.setData({
            winList,
            who
          })
          return true
        }
      }
    }
    // 左斜
    for (let i = 0; i < 11; i++) {  // 列
      for (let j = 0; j < 11; j++) { // 行
        total = 0
        let k = 0
        let who = list[i + k][j + k] && list[i + k][j + k] % 2
        winList = []
        while (list[i + k]&&list[i + k][j + k] && list[i + k][j + k] % 2 === who && k <= 5) { // 检查五个
          winList.push(list[i + k][j + k])
          total++
          k++
        }
        if (total >= 5) {
          this.setData({
            winList,
            who
          })
          return true
        }
      }
    }
    // 右斜
    for (let i = 4; i < 15; i++) {  // 列
      for (let j = 0; j < 11; j++) { // 行
        total = 0
        let k = 0
        let who = list[i - k][j + k] && list[i - k][j + k] % 2
        winList = []
        while (list[i - k] && list[i - k][j + k] && list[i - k][j + k] % 2 === who && k <= 5) { // 检查五个
          winList.push(list[i - k][j + k])
          total++
          k++
        }
        if (total >= 5) {
          this.setData({
            winList,
            who
          })
          return true
        }
      }
    }
    return false
  },
  // 切换 人机 双人
  radioChange (e) {
    let isMM = e.detail.value === '1'
    this.setData({
      isMM
    })
    this.init()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
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