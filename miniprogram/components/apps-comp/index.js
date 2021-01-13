Component({
  properties: {
    source: {
      type: String,
      value: 'db',
    },
    dbName: {
      type: String,
      value: 'm-apps',
    },
    apiUrl: {
      type: String,
      value: '',
    },
    style: {
      type: String,
      value: 'v1',
    },
    iconStyle: {
      type: String,
      value: 'round',
    },
    col: {
      type: String,
      value: '4',
    },
    loading: {
      type: Boolean,
      value: true,
    },
    adunitId: String,
  },

  data: {
    apps: [],
  },

  ready() {
    const { source } = this.data
    if (source == 'db') {
      this.fetchAppsFromDb()
    } else {
      this.fetchAppsFromApi()
    }
  },

  methods: {
    fetchAppsFromDb: async function () {
      const { dbName, loading } = this.data

      if (!dbName) {
        console.error('请配置矩阵小程序集合名称')
        return
      }

      if (loading) wx.showLoading({ title: '请稍候' })

      try {
        const db = wx.cloud.database()
        const res = await db.collection(dbName).get()
        console.log('get db apps-----', res.data)
        this.setData({ apps: res.data })
        wx.hideLoading()
      } catch (e) {
        wx.hideLoading()
        console.error(e)
        this.setData({ apps: [] })
      }
    },

    fetchAppsFromApi: async function () {
      const { apiUrl, loading } = this.data

      if (!apiUrl) {
        console.error('请配置矩阵小程序数据接口')
        return
      }

      if (loading) wx.showLoading({ title: '请稍候' })

      try {
        const res = await wx.request({ url: apiUrl })
        console.log('get api apps-----', res.data)
        this.setData({ apps: res.data })
        wx.hideLoading()
      } catch (e) {
        wx.hideLoading()
        console.error(e)
        this.setData({ apps: [] })
      }
    },

    handleNavApp(e) {
      const { appid, path } = e.currentTarget.dataset
      wx.navigateToMiniProgram({
        appId: appid,
        path,
      })
    },
  },
})
