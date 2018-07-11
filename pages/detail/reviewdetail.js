const app = getApp()

Page({

  data: {
    review:{}
  },
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    const {id} = options
    app.douban.findReview(id)
      .then(data => {
        let average = data.rating.value
        data.stars = this.averageToStars(average)
        this.setData({
          review: data
        })
      })
      .catch(err => {
        console.log(err)
      })
    wx.hideNavigationBarLoading()
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