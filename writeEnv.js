const fs = require('fs') // 引入fs模块

const args = process.argv.splice(2)

fs.writeFile('./miniprogram/utils/env.js', `export const EnvID = '${args[0]}'`, { flag: 'w' }, function (err) {
  if (err) {
    throw err
  }
})
