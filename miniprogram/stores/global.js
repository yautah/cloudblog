import { observable, action } from 'mobx-miniprogram'
import wxp from '../utils/wxp.js'

export default observable({
  authSetting: null,
  settings: null,
  options: null,
  systemInfo: null,

  get navbarHeight() {
    if (!this.systemInfo) return 0
    return this.systemInfo.platform == 'android'
      ? this.systemInfo.statusBarHeight + 50
      : this.systemInfo.statusBarHeight + 45
  },

  getSystemInfo: action(async function () {
    const res = await wxp.getSystemInfo()
    this.systemInfo = res
  }),

  watchAppShow: action(async function () {
    const that = this
    wxp.onAppShow(function (e) {
      that.options = that.options ? { ...e, old_scene: that.options.scene } : e
    })
  }),

  init: action(async function () {
    this.getSystemInfo()
  }),
})
