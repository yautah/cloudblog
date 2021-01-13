import { callFn } from './base'

//查询当前任务
export async function queryCategories() {
  return await callFn('api', '/categories')
}

//查询coupons
export async function queryArticles(code, page, page_size) {
  return await callFn('api', '/articles', { code, page, page_size })
}

//查询coupons
export async function searchArticles(search, page, page_size) {
  return await callFn('api', '/articles/search', { search, page, page_size })
}

export async function queryArticle(id) {
  return await callFn('api', '/articles/detail', { id })
}

//查询apps
export async function testFn() {
  return await callFn('migrate')
}
