const cloud = require('wx-server-sdk')

module.exports = {
  async queryCategories(ctx) {
    const db = cloud.database()
    try {
      const res = await db.collection('categories').aggregate().sort({ position: 1 }).limit(100).end()

      ctx.body = { code: 1, data: res.list }
    } catch (e) {
      console.error(e)
      ctx.body = { code: -1, message: e }
    }
  },

  async queryArticles(ctx) {
    const { code, page = 1, page_size = 10 } = ctx.payload
    const db = cloud.database()

    try {
      const countResults = await db
        .collection('articles')
        .aggregate()
        .match({ category_code: code })
        .count('total')
        .end()

      const { total } = countResults.list.length ? countResults.list[0] : 0

      const results = await db
        .collection('articles')
        .aggregate()
        .match({ category_code: code })
        .sort({ created_at: -1 })
        .skip(page_size * (page - 1))
        .limit(10)
        .end()

      ctx.body = {
        code: 1,
        data: {
          total,
          page_size,
          page,
          list: results.list,
        },
      }
    } catch (e) {
      ctx.body = { code: -1, errors: e }
    }
  },

  async searchArticles(ctx) {
    const { search, page = 1, page_size = 10 } = ctx.payload
    const db = cloud.database()
    const _ = db.command

    try {
      const countResults = await db
        .collection('articles')
        .aggregate()
        .match(_.or([{ title: { $regex: `.*${search}.*` } }, { summary: { $regex: `.*${search}.*` } }]))
        .count('total')
        .end()

      const { total } = countResults.list.length ? countResults.list[0] : 0

      const results = await db
        .collection('articles')
        .aggregate()
        .match(_.or([{ title: { $regex: `.*${search}.*` } }, { summary: { $regex: `.*${search}.*` } }]))
        .sort({ created_at: -1 })
        .skip(page_size * (page - 1))
        .limit(10)
        .end()

      ctx.body = {
        code: 1,
        data: {
          total,
          page_size,
          page,
          list: results.list,
        },
      }
    } catch (e) {
      ctx.body = { code: -1, errors: e }
    }
  },

  async queryArticle(ctx) {
    const { id } = ctx.payload
    const db = cloud.database()
    try {
      const res = await db.collection('articles').doc(id).get()
      ctx.body = { code: 1, data: res.data }
    } catch (e) {
      ctx.body = { code: -1, errors: e }
    }
  },
}
