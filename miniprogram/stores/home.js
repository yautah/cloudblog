import { autorun, toJS, observable, action } from 'mobx-miniprogram'
import wxp from '../utils/wxp.js'
import { queryCategories, queryArticles, searchArticles, queryArticle } from '../services/api'

export default observable({
  categories: null,

  articles: null,
  showPagination: false,
  pagination: {},

  searchArticles: null,
  searchShowPagination: false,
  searchPagination: {},

  article: null,

  get allCategories() {
    if (!this.categories) return null
    return this.categories.map((c) => {
      c.title = c.name
      return c
    })
  },

  setPagination: action(function (pagination) {
    const { page, total, page_size } = pagination
    this.pagination = {
      page,
      page_size,
      total,
      total_page: Math.ceil(total / page_size),
    }
  }),

  setSearchPagination: action(function (pagination) {
    const { page, total, page_size } = pagination
    this.searchPagination = {
      page,
      page_size,
      total,
      total_page: Math.ceil(total / page_size),
    }
  }),

  init: action(async function () {
    wxp.showLoading({ title: '请稍候', mask: true })
    this.fetchCategories()
    this.fetchArticles()
  }),

  fetchCategories: action(async function () {
    try {
      const res = await queryCategories()
      this.categories = res.data
      this.fetchArticles(this.categories[0].code)
    } catch (e) {
      wxp.hideLoading()
    }
  }),

  fetchArticles: action(async function (code, page = 1, page_size = 10) {
    if (page > 1) {
      this.showPagination = true
    } else {
      wxp.showLoading({ title: '请稍候', mask: true })
    }

    try {
      const res = await queryArticles(code, page, page_size)
      const { list, ...pagination } = res.data
      this.articles = page == 1 ? list : [...this.articles, ...list]
      this.setPagination(pagination)
      this.showPagination = false
      wxp.hideLoading()
    } catch (e) {
      wxp.hideLoading()
      console.error(e)
    }
  }),

  handleSearch: action(async function (search, page = 1, page_size = 10) {
    if (page > 1) {
      this.showSearchPagination = true
    } else {
      wxp.showLoading({ title: '请稍候', mask: true })
    }

    try {
      const res = await searchArticles(search, page, page_size)
      const { list, ...pagination } = res.data
      this.searchArticles = page == 1 ? list : [...this.searchArticles, ...list]
      this.setSearchPagination(pagination)
      this.showSearchPagination = false
      wxp.hideLoading()
    } catch (e) {
      wxp.hideLoading()
      console.error(e)
    }
  }),

  resetSearch: action(function () {
    this.searchArticles = null
    this.searchPagination = {}
  }),

  fetchArticle: action(async function (id) {
    wxp.showLoading({ title: '请稍候', mask: true })
    try {
      const res = await queryArticle(id)
      this.article = res.data
      wxp.hideLoading()
    } catch (e) {
      wxp.hideLoading()
      console.error(e)
    }
  }),
})
