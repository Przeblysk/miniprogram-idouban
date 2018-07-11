// 获取全局应用程序实例对象
const app = getApp()

Page({

  data: {
    subjects: [],
    count: 15,
    page: 1,
    total: 0,
    nomore: false
  },
  onReachBottom() {
    if (this.data.subjects.length * 3 >= this.data.total) {
      wx.showToast({
        title: '没有更多数据了',
      })
      
    } else {
      this.getIntheaters()
    }
  },
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    this.getIntheaters()
    wx.hideNavigationBarLoading()
  },
  getIntheaters() {
    this.setData({
      loading: true
    })
    const page = this.data.page
    const count = this.data.count
    // 获取正在热映
    app.douban.find('coming_soon', page, count)
      .then(data => {
        let subjects = data.subjects
        for (let subject of subjects) {
          let average = subject.rating.average
          subject.start = this.averageToStars(average)
          if (subject.title.length > 5)
            subject.title = subject.title.substring(0, 5) + "..."
        }
        let list = []
        for (let i = 0; i < subjects.length; i += 3) {
          list.push([subjects[i],
            subjects[i + 1] ? subjects[i + 1] : null,
            subjects[i + 2] ? subjects[i + 2] : null
          ])
        }
        this.setData({
          subjects: this.data.subjects.concat(list),
          page: this.data.page + 1,
          total: data.total
        })
        if (this.data.subjects.length * 3 >= this.data.total) {
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
    let start = []
    for (let i = 0; i < 5; i++, average -= 2) {
      if (average >= 2) {
        start[i] = 1
      } else if (average >= 1) {
        start[i] = 2
      } else {
        start[i] = 0
      }
    }
    return start
  },
  toDetail(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  }


})