/**
 * Douban API 模块
 * @type {Object}
 */
const douban = require('./utils/douban.js')

App({
  data: {
    name: 'Douban',
    version: '0.1.0',
    currentCity: '宁波'
  },
  /**
   * Douban API
   */
  douban: douban,
})