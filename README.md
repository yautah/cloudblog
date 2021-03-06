#  云开发微博客

## 项目介绍

> 微信小程序，基于腾讯云开发，旨在完整的展示如何基于TCB cli，Tcb Framework和一键快速部署按钮对云开发项目进行快速的迁移和部署。

### 效果预览

<p align="center">
 <img src="https://github.com/yautah/cloudblog/blob/master/snaps/index.png" width=“100px” height=“100px" style="width:100px;height:100px !important;" />
 
 <img src="https://github.com/yautah/cloudblog/blob/master/snaps/deploy.png" style="width:50%;height:50%" />
 
</p>


## 项目依赖

- 小程序的 MobX [wechat-miniprogram/mobx](https://github.com/wechat-miniprogram/mobx)
- 小程序的 MobX 绑定辅助库 [wechat-miniprogram/mobx-miniprogram-bindings](https://github.com/wechat-miniprogram/mobx-miniprogram-bindings)
- 小程序的接口 Promise [wechat-miniprogram/miniprogram-api-promise](https://github.com/wechat-miniprogram/miniprogram-api-promise)
- 富文本解析 [jin-yufeng/Parser](https://github.com/jin-yufeng/Parser)

## 项目结构

本小程序采用基于云开发的原生开发，用到了云数据库存储数据，使用云函数和小程序端进行数据交互。

小程序端，引入mobx统一对数据进行管理，解耦页面数据与交互逻辑。

云函数端，使用Tcb Router统一中控路由请求，业务处理统一在services层进行。

## 快速部署


[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fyautah%2Fcloudblog&branch=master)


## 本地开发

拉取项目当本地，进入miniprogram目录，npm install， 并在ide中开启“使用npm模块”，工具中“npm 构建”。

修改 miniprogram/utils/env.js，填入自己的环境id进行本地开发调试（此处的envID在一键部署或者本地tcb cli的时候，是通过prehook自动写入的）。

即可愉快的进行本地的开发了。

