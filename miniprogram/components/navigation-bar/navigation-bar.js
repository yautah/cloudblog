Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: true
    },
    loading: {
      type: Boolean,
      value: false
    },
    animated: {
      // 显示隐藏的时候opacity动画效果
      type: Boolean,
      value: true
    },
    show: {
      // 显示隐藏导航，隐藏的时候navigation-bar的高度占位还在
      type: Boolean,
      value: true,
      observer: '_showChange'
    },
    // back为true的时候，返回的页面深度
    delta: {
      type: Number,
      value: 1
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    displayStyle: ''
  },
  attached() {
    const isSupport = !!wx.getMenuButtonBoundingClientRect
    const rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
    const colorEncoded = escape(this.data.color)
    const backImage = `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E  %3Cpath fill='${
      colorEncoded
    }' fill-opacity='.9' fill-rule='evenodd' d='M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z'/%3E%3C/svg%3E")`

    wx.getSystemInfo({
      success: res => {
        const ios = !!(res.system.toLowerCase().search('ios') + 1)
        this.setData({
          ios,
          statusBarHeight: res.statusBarHeight,
          backImage,
          innerWidth: isSupport ? `width:${rect.left}px` : '',
          innerPaddingRight: isSupport ? `padding-right:${res.windowWidth - rect.left}px` : '',
          leftWidth: isSupport ? `width:${res.windowWidth - rect.left}px` : ''
        })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getHeight() {
      const { ios, statusBarHeight } = this.data
      return statusBarHeight + (ios ? 44 : 48)
    },

    _showChange(show) {
      const animated = this.data.animated
      let displayStyle = ''
      if (animated) {
        displayStyle = `opacity: ${show ? '1' : '0'};-webkit-transition:opacity 0.5s;transition:opacity 0.5s;`
      } else {
        displayStyle = `display: ${show ? '' : 'none'}`
      }

      this.setData({
        displayStyle
      })
    },
    back() {
      const data = this.data
      wx.navigateBack({
        delta: data.delta
      })
      this.triggerEvent('back', { delta: data.delta }, {})
    }
  }
})
