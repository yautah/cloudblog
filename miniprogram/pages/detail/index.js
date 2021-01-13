import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import wxp from '../../utils/wxp.js'

Page({
  behaviors: [storeBindingsBehavior],

  storeBindings: [
    {
      store: wxp.store.homeStore,
      fields: ['article'],
      actions: ['fetchArticle'],
    },
  ],

  data: {},

  onLoad: function (option) {
    const { id } = option

    this.fetchArticle(id)
  },
})
