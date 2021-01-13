import wxp from '../utils/wxp'

const Errors = {
  ERROR_FUNCTION: { code: -1, message: '云函数内部异常' },
  ERROR_NETWORK: { code: -2, message: '调用云函数发生错误' },
  ERROR_NULL: { code: -3, message: '云函数忘记返回值了？' },
  ERROR_RECORD_NOT_FOUND: { code: -10001, message: '记录不存在' },
  ERROR_BIND_FAILED: { code: -1001, message: '授权码错误' },
  ERROR_SUBSCRIPTION_CONFIG: { code: -2001, message: '订阅消息模板未配置好' },

  ERROR_OUT_OF_PERIOD: { code: -2001, message: '当前活动已结束' },
  ERROR_TODAY_CHECKIN: { code: -2002, message: '今日已打卡~' },
}

export async function callFn(name, url, payload) {
  let data = {}
  if (url) data['$url'] = url
  if (payload && typeof payload == 'object') data.payload = payload

  try {
    const { result } = await wxp.cloud.callFunction({ name, data })

    if (result) {
      if (result.code == 1) {
        console.log(`[Function] ${name}${url}: `, data, result)
        return result
      } else {
        console.error(`[Function] ${name}${url}: `, data, result)
        return Promise.reject(result)
      }
    } else {
      console.error(`[Function] ${name}${url}: `, data, result)
      return Promise.reject(Errors.ERROR_NULL)
    }
  } catch (e) {
    const result = { ...Errors.ERROR_NETWORK, errors: e }
    console.error(`[Functiopn] ${name}${url}: `, data, result)
    return result
  }
}

export async function checkImage(image) {
  return callFn('service', '/image/check', { image: image.toString() })
}

export async function uploadImage() {
  let timestamp = Date.now()
  const res = await wxp.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
  })

  const filePath = res.tempFilePaths[0]

  wx.showLoading({ title: '图片检测中..' })
  const buffer = wxp.getFileSystemManager().readFileSync(filePath)
  const checkResult = await checkImage(buffer)

  if (checkResult.code != 1) {
    return wx.showToast({
      title: '请不要上传敏感图片！',
      icon: 'none',
    })
  }

  wxp.showLoading({ title: '上传中', mask: true })
  const todo = await wxp.cloud.uploadFile({
    cloudPath: timestamp + '.png',
    filePath: res.tempFilePaths[0],
  })
  wxp.hideLoading()
  return todo.fileID
}
