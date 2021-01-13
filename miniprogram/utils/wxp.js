import { promisifyAll, promisify } from 'miniprogram-api-promise'


/* globals wx, getApp, getCurrentPages */
const wxp = {
  // 原始wx对象
  wx: wx,

  rootStore: {},

  // getApp() 优雅的封装
  get app() {
    return getApp()
  },

  // getCurrentPages() 优雅的封装
  get currentPages() {
    return getCurrentPages()
  },

  get currentPage() {
    return getCurrentPages()[0]
  },

  get store() {
    return this.rootStore
  },

  set store(store){
    this.rootStore = store
  },

  getPage(pageId) {
    const pages = getApp()._instances
    return pages ? pages[pageId] : null
  }
}

promisifyAll(wx, wxp)

export default wxp
