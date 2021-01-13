import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import wxp from '../../utils/wxp.js'
Page({
  behaviors: [storeBindingsBehavior],

  storeBindings: [
    {
      store: wxp.store.homeStore,
      fields: ['searchArticles', 'searchPagination', 'showSearchPagination'],
      actions: ['handleSearch', 'resetSearch'],
    },
  ],
  data: {},

  onLoad: function () {},

  onReachBottom() {
    const {
      search,
      searchPagination: { page, total_page },
    } = this.data
    if (page < total_page) {
      this.handleSearch(search, page + 1)
    }
  },

  onUnload() {
    this.resetSearch()
  },

  onTapSearch(e) {
    const { search } = e.detail
    this.setData({ search })
    this.handleSearch(search)
  },

  handleNavBack() {
    wxp.navigateBack()
  },
})
