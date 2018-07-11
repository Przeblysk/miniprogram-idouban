const app = getApp()

Page({
  data: {
    id: "",
    reviews: [],
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
      this.getReviews()
    }
  },
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this.setData({
      id: options.id
    })
    this.getReviews()
    wx.hideNavigationBarLoading()
  },
  getReviews() {
    const { id, start, count } = this.data
    app.douban.findReviews(id, start, count)
      .then(data => {
        let reviews = data.reviews
        for (let review of reviews) {
          let average = review.rating.value
          review.stars = this.averageToStars(average)
        }
        this.setData({
          reviews: this.data.reviews.concat(reviews),
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