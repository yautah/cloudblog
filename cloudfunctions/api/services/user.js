const cloud = require('wx-server-sdk')

const { User, Setting } = require('../models/index')
const utils = require('../utils/utils')

module.exports = {
  async login(ctx) {
    const wxContext = cloud.getWXContext()
    const db = cloud.database()
    const _ = db.command
    try {
      const [user, created] = await User.findOrCreate({
        where: { open_id: wxContext.OPENID },
        defaults: {
          created_at: db.serverDate(),
          updated_at: db.serverDate(),
          code: utils.randomWord(false, 8),
        },
      })

      const setting = await Setting.findFirst()
      ctx.body = {
        code: 1,
        data: {
          ...user,
          isAdmin: setting.admin == user.open_id,
          new_user: created,
        },
      }
    } catch (e) {
      console.error(e)
      ctx.body = { code: -1, errors: e }
    }
  },

  async updateUser(ctx) {
    const { data } = ctx.payload
    const db = cloud.database()
    const wxContext = cloud.getWXContext()

    try {
      await User.update(
        { ...data, updated_at: db.serverDate() },
        {
          where: { open_id: wxContext.OPENID },
        }
      )
      ctx.body = { code: 1 }
    } catch (e) {
      ctx.body = { code: -1, errors: e }
      console.error(e)
    }
  },
}
