//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    total: 0,
    list: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    move: {   // 标记滑动方向
      x: 0,
      y: 0
    },
    coord: {  // 记录触摸开始位置
      x: 0,
      y: 0
    },
    timer: Date.now(),
    isReach: false
  },
  onLoad: function () {
    this.randomBase()
  },
  // 重新开始
  renew() {
    let list = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
    this.setData({
      list: list,
      isReach: false,
      total: 0
    })
    this.randomBase()
  },
  // 随机生成2, 4, 加入到list
  randomBase() {
    let arr = [2, 4]
    let num = arr[Math.round(Math.random() * Math.random() + 0.1)]
    let empty = []
    let list = this.data.list
    list.forEach((item, i) => {
      item.forEach((subItem, j) => {
        if (list[i][j] === 0) {
          empty.push([i, j])
        }
      })
    })
    let len = empty.length
    if (len < 1) {
      if (!this.isSame(this.data.list)) {
        let timer = this.data.timer
        if (Date.now() - timer > 3000) {
          wx.showToast({
            title: '游戏结束',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            timer: Date.now()
          })
        }
      }
      return
    }
    let randomNum = Math.floor(Math.random() * len)
    let ij = empty[randomNum]
    list[ij[0]][ij[1]] = num
    this.setData({
      list: list
    })
    let total = list.reduce((a, b) => {
      return a + b.reduce((t, n) => t + n)
    }, 0)
    this.setData({
      total: total
    })
  },
  // 合并
  merge() {
    let list = JSON.parse(JSON.stringify(this.data.list))
    let move = this.data.move
    if (move.x === 1) { // 右  需转两下
      list = this.rotateMatrix(list, 2)
    } else if (move.y === 1) { // 上 需转三下
      list = this.rotateMatrix(list, 3)
    } else if (move.y === -1) { // 下 需转一下
      list = this.rotateMatrix(list, 1)
    }

    for (let x = 0; x < 4; x++) {
      let item = list[x]
      // 把有值得靠边
      for (let i = 0; i < 3; i++) {
        let k = i + 1
        if (!item[i]) {
          while (!list[x][k] && k < 4) {
            k++
          }
          if (k < 4) {
            list[x][i] = list[x][k]
            list[x][k] = 0
          }
        }
      }
      // 把相同的合并
      for (let i = 0; i < 3; i++) {
        let j = i + 1
        if (item[i] === item[j]) {
          item[i] = item[i] * 2
          item[j] = 0
        } else {
          j++
        }
      }
      // 合并完后把有值得靠边
      for (let i = 0; i < 3; i++) {
        let k = i + 1
        if (!item[i]) {
          while (!list[x][k] && k < 4) {
            k++
          }
          if (k < 4) {
            list[x][i] = list[x][k]
            list[x][k] = 0
          }
        }
      }
    }

    // 再转回来
    if (move.x === 1) { // 右  需转两下
      list = this.rotateMatrix(list, 2)
    } else if (move.y === 1) { // 上 需转1下
      list = this.rotateMatrix(list, 1)
    } else if (move.y === -1) { // 下 需转三下
      list = this.rotateMatrix(list, 3)
    }
    this.setData({
      list: list
    })
    if (!this.data.isReach && this.isWin(list) ) {
      wx.showToast({
        title: '达到2048!',
        icon: 'success',
        duration: 5000
      })
      this.setData({
        isReach: true
      })
    }
    setTimeout(() => {
      this.randomBase()
    }, 500)
  },
  // 旋转矩阵
  rotateMatrix(list, num) {
    for (let k = 0; k < num; k++) {
      rotate()
    }
    // 顺时针旋转矩阵90°
    function rotate() {
      for (let i = 0; i < 2; i++) {
        [list[i], list[3 - i]] = [list[3 - i], list[i]]
      }
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < i; j++) {
          [list[i][j], list[j][i]] = [list[j][i], list[i][j]]
        }
      }
    }
    return list
  },
  // 判断矩阵每个元素相邻是否有相等的
  isSame(list) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((i + 1 < 4 && list[i][j] === list[i + 1][j]) || (j + 1 < 4 && list[i][j] === list[i][j + 1])) {
          return true
        }
      }
    }
    return false
  },
  startHandler(e) {
    let x = e.touches[0] && e.touches[0].pageX || 0
    let y = e.touches[0] && e.touches[0].pageY || 0
    this.setData({
      coord: {
        x,
        y
      }
    })
  },
  endHandler(e) {
    let x = e.changedTouches[0] && e.changedTouches[0].pageX || 0
    let y = e.changedTouches[0] && e.changedTouches[0].pageY || 0
    let coord = this.data.coord
    let xDiff = coord.x - x
    let yDiff = coord.y - y
    // 是否水平方向移动
    let isX = Math.abs(xDiff) > Math.abs(yDiff)
    // 是否正方向
    let isJust = (isX && xDiff < 0) || (!isX && yDiff > 0)
    this.setData({
      move: {
        x: isX ? (isJust ? 1 : -1) : 0,
        y: !isX ? (isJust ? 1 : -1) : 0
      }
    })
    this.merge()
  },
  // 最大那个数是否为2048
  isWin (list) {
    let max = 0
    list.forEach(item => {
      let newMax = Math.max(...item)
      max = Math.max(max, newMax)
    })
    return max == 2048
  }
})
