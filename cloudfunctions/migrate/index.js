// 云函数入口文件
const cloud = require('wx-server-sdk')
const seeds = require('./utils/const').seeds

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  throwOnNotFound: false,
})

const log = cloud.logger()

async function migrate1(transaction, migrate) {
  const db = cloud.database()
  log.info({ migrate: 'migrate 1', message: 'migrate 1 开始' })
  log.info({ migrate: 'migrate 1', message: '创建基本设置记录' })

  log.info({ migrate: 'migrate 1', message: '创建默认分类' })
  for (let i = 0; i < seeds.categories.length; i++) {
    const category = seeds.categories[i]
    await transaction.collection('categories').add({ data: category })
  }

  log.info({ migrate: 'migrate 1', message: '创建默认文章记录' })
  for (let i = 0; i < seeds.articles.length; i++) {
    const ad = seeds.articles[i]
    ad.title = `我是测试文章${i}标题~~`
    ad.created_at = db.serverDate({ offset: 1000 + i })
    ad.shares_count = 100 + i * 3
    ad.views_count = 200 + i * 3
    ad.thumbnail = 'https://main.qcloudimg.com/raw/0cc6eb72b8f3cc179a49974d1cd3e121.png'
    await transaction.collection('articles').add({ data: ad })
  }

  log.info({ migrate: 'migrate 1', message: '更新migrate版本为1' })
  await transaction
    .collection('migrates')
    .doc(migrate._id)
    .update({ data: { version: 1 } })

  log.info({ migrate: 'migrate 1', message: 'migrate 1 结束' })
  return { _id: migrate._id, version: 1 }
}

async function doMigrate(ts, migrate) {
  switch (migrate.version) {
    case 0:
      await migrate1(ts, migrate)
    default:
      break
  }
}

async function initMigrate(ts) {
  const res = await ts.collection('migrates').get()
  let migrate = res.data[0]

  if (!migrate) {
    const res = await ts.collection('migrates').add({
      data: { version: 0 },
    })
    log.info({ migrate: 'migrates', message: '无migrate记录，创建默认migrate' })
    return { ...res, version: 0 }
  } else {
    log.info({ migrate: 'migrates', message: '当前migrate的版本为：' + migrate.version })
    return migrate
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()

  try {
    const ts = await db.startTransaction()
    const migrate = await initMigrate(ts)
    log.info({ migrate: 'migrates', message: 'migrates 开始' })
    await doMigrate(ts, migrate)
    await ts.commit()
    log.info({ migrate: 'migrates', message: 'migrates 结束' })
    return { code: 1, message: 'success' }
  } catch (e) {
    log.error({ migrate: 'error', errors: e })
    return { code: -1, errors: e }
  }
}
