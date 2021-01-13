import Store from './stores/index.js'
import wxp from './utils/wxp.js'
import { EnvID } from './utils/env'

if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    env: EnvID,
    traceUser: true,
  })
}

//初始化 store
wxp.store = new Store()
wxp.store.globalStore.init()

App({
  onLaunch: function () {
    //wx.hideTabBar()
  },

  onHide: function () {},
  globalData: {},
})
