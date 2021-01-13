// pages/about/index.js
import wxp from '../../utils/wxp'
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'

import { testFn } from '../../services/api'

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: [
    {
      store: wxp.store.globalStore,
      fields: [],
      actions: [],
    },
  ],

  data: {},

  onLoad: function () {},

  onShow() {},

  async handleTapTest() {
    try {
      const res = await testFn()
      console.log(res)
    } catch (e) {
      console.error(e)
    }
  },
})
