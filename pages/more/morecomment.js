const app = getApp()

Page({
  data: {
    id: "",
    comments: [],
    start: 0,
    count: 20,
    total: 0,
    nomore: false
  },
  onReachBottom() {
    if (this.data.start >= this.data.total) {
      wx.showToast({
        title: '没有更多数据了',
      })
    } else {
      this.getComments()
    }
  },
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this.setData({
      id: options.id
    })
    this.getComments()
    wx.hideNavigationBarLoading()
  },
  getComments(){
    const { id, start, count } = this.data
    app.douban.findComments(id, start, count)
      .then(data => {
        let comments = data.comments
        for (let comment of comments) {
          let average = comment.rating.value
          comment.stars = this.averageToStars(average)
        }
        this.setData({
          comments: this.data.comments.concat(comments),
          start: data.next_start,
          count: data.count,
          total: data.total
        })
        if (this.data.start >= this.data.total) {
          this.setData({
            nomore: true
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  averageToStars(average) {
    let stars = []
    for (let i = 0; i < 5; i++ , average -= 1) {
      if (average >= 1) {
        stars[i] = 1
      } else if (average >= 0.5) {
        stars[i] = 2
      } else {
        stars[i] = 0
      }
    }
    return stars
  }

})