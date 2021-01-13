# 部署流程


## 云函数部署

### 配置文件
> fn.json，目前配置文件中的codeSecret似乎不起作用，需要在deploy的时候指定--code-secret。

### 云函数部署

```bash
tcb fn deploy --mode xxx --config-file fn.json --code-secret abc123456
```

### 初始化数据

```bash
tcb fn invoke service --mode xxx --config-file fn.json
```

### 更新云函数

```bash
tcb fn code update xxx --config-file fn.json --code-secret abc123456
```


## 小程序部署

### 配置文件
> mp.json，注意相关env配置中的version和deploy_mode。

### 部署小程序

```bash
tcb framework deploy --mode xxx --config-file mp.json
```


[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fyautah%2Fwaimai&branch=main)
