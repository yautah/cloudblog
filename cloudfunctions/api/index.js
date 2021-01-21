// 云函数入口文件

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  throwOnNotFound: false,
})

const TcbRouter = require('tcb-router')

const articleService = require('./services/article')

exports.main = async (event, context) => {
  console.log(event)
  const app = new TcbRouter({ event })

  app.use(async (ctx, next) => {
    ctx.payload = ctx._req.event ? ctx._req.event.payload : {}
    ctx.action = ctx._req.url
    await next()
  })

  app.router('/categories', articleService.queryCategories)
  app.router('/articles', articleService.queryArticles)
  app.router('/articles/search', articleService.searchArticles)
  app.router('/articles/detail', articleService.queryArticle)

  const registedRoutes = Object.keys(app._routerMiddlewares)

  if (registedRoutes.findIndex((r) => r == app._req.url) == -1) {
    return { code: -3, message: '请求错误，请求的路由不存在' }
  }

  return app.serve()
}
