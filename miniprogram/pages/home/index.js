import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import wxp from '../../utils/wxp.js'

Page({
  behaviors: [storeBindingsBehavior],

  storeBindings: [
    {
      store: wxp.store.homeStore,
      fields: ['allCategories', 'articles', 'pagination', 'status', 'showPagination'],
      actions: ['init', 'fetchArticles'],
    },
    {
      store: wxp.store.globalStore,
      fields: ['navbarHeight', 'systemInfo'],
    },
  ],

  data: {
    currentTab: 0,

    navbarHeight: 0,
    showNavbar: false,
    errorImages: {},
  },

  onLoad() {
    this.init()
  },

  onReady() {
    const jn = wxp.getMenuButtonBoundingClientRect()
    this.setData({ menuInfo: jn })
  },

  onReachBottom() {
    const {
      status,
      pagination: { page, total_page },
    } = this.data
    if (page < total_page) {
      //const { allCategories, currentTab } = this.data
      //this.fetchArticles(allCategories[currentTab].code, page + 1)
      this.fetchArticles()
    }
  },

  onUnload() {},

  onShow() {},

  onShareAppMessage() {},

  handleSwitchTab(e) {
    const { index } = e.detail
    const { currentTab, allCategories } = this.data

    if (index == currentTab) return

    console.log(e)

    this.setData({ currentTab: index })
    this.fetchArticles(allCategories[index].code)
  },

  onShareTimeline() {},

  onImageError(e) {
    console.log(e)
    const { id } = e.currentTarget.dataset
    this.setData({
      [`errorImages[${id}]`]: true,
    })
  },
})
