Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    extClass: {
      type: String,
      value: '',
    },
    current: Number,
    tabs: {
      type: Array,
      value: [],
    },
  },

  data: {},

  ready() {},

  methods: {
    tabChange(e) {
      const { index } = e.currentTarget.dataset
      if (index === this.data.current) {
        return
      }
      //this.setData({ current: index })
      const { tabs } = this.data
      wx.switchTab({ url: tabs[index].url })
    },
  },
})
