# bilibili-valkyrie 哔哩哔哩-瓦尔基里

> **Warning**  
> Deprecated. Please use [bilibili_subscriber](https://github.com/lixiang810/bilibili_subscriber) instead.

---

Bilibili 自搭建（第三方）哔哩哔哩关注服务

> In memory of my 6-digit UID account which was permanently banned by bilibili at 2021-06-11  
> 谨以此纪念我在 2021 年 6 月 11 日被 B 站永久封禁的 6 位数 UID 大号

## 功能简介

该项目旨在提供一个第三方的关注 / 订阅功能，以在被封号的情况下对自己希望关注的用户进行关注 / 订阅。

## 名称来源

valkyrie，音译“瓦尔基里”，意译“女武神”。瓦尔基里是挪威和日耳曼神话中奥丁的侍女们的名字。她们骑着马与“狂猎”一道出巡，或者化作天鹅飞向战场，为瓦尔哈拉殿堂（Valhalla）收集阵亡的武士。

为项目取这个名字，一是因为《命运石之门》系列中冈部伦太郎的抵抗组织是这个名字，石头门为“瓦尔基里”附上了反抗的意味，这与我想表达的内容不谋而合。二是因为其本来的面貌：为瓦尔哈拉殿堂收集英灵，就像“订阅 / 关注”一样（笑）。当然，我的中二情结也是原因之一——上一个项目叫“诸神黄昏”（Rangarok），上上个项目叫“纳吉尔法”（Naglfar），都是北欧神话中的事物。

## 如何使用

```bash
yarn
yarn start
```

## 如何开发

### 开发参考

熟悉 TypeScript 的可以看 [API 示例](https://github.com/bilibili-valkyrie/bilibili-valkyrie-frontend-webpage-react/tree/main/src/api)，里面有各接口从输入到返回的完整的类型定义。至于如何与后端通信可以看[请求模块示例](https://github.com/bilibili-valkyrie/bilibili-valkyrie-frontend-webpage-react/blob/main/src/controller/request.ts)。虽然这两个都是我的 react 版前端的一部分，但它们并不依赖 react，你可以将它们原封不动地搬到自己的项目中。

如果不熟悉 TypeScript，[请看此](https://github.com/bilibili-valkyrie/bilibili-valkyrie/wiki)，但文档仍在施工中，且部分过时。

```bash
yarn
yarn dev
```

### 文件结构

```tree
src
├── api .............................. BiliBili 的 API
│   ├── getUperInfo.ts ............... 获取 up 主基本信息
│   └── getUperSpace.ts .............. 获取 up 主空间页面
├── app.ts ........................... express实例
├── controllers ...................... 控制器，存放较复杂的操作
│   ├── addVideos.ts ................. 获取并更新 up 主上传的视频
│   └── deleteSubscribe.ts ........... 删除订阅
├── errors ........................... 定义错误类型
│   ├── ConflictError.ts ............. 资源冲突
│   ├── InvalidMidError.ts ........... up 主 UID 不合法
│   ├── NotAllowedToSignUpError.ts ... 不允许注册
│   └── NotFoundError.ts ............. 未找到资源
├── index.ts ......................... 入口
├── middlewares ...................... 自定义中间件
│   └── errorHandler.ts .............. 错误处理中间件
├── models ........................... 存放 mongoose 模型
│   ├── Uper.ts ...................... Uper 模型
│   ├── User.ts ...................... User 模型
│   └── Video.ts ..................... Video 模型
├── routers .......................... 路由器
│   ├── biliAPIRouter.ts ............. 对 BiliBili API 进行去 CORS 暴露
│   ├── loginRouter.ts ............... 负责登录路由
│   ├── subscribeAddRemoveRouter.ts .. 负责订阅增删
│   ├── subscribeGetRouter.ts ........ 负责订阅查询
│   ├── subscribeUpdateRouter.ts ..... 负责订阅更新 / 查询更新
│   └── usersRouter.ts ............... 负责用户增改删查
├── tests ............................ 测试
│   ├── helper
│   │   ├── apiInstance.ts
│   │   ├── data
│   │   │   ├── upers.json
│   │   │   ├── users.json
│   │   │   └── videos.json
│   │   ├── dbRWhelper.ts
│   │   ├── initUsers.ts
│   │   ├── testdb_init.ts
│   │   ├── tokenStorage.ts
│   │   └── userUsedForTest.ts
│   ├── simulate_test.test.ts
│   ├── subscribe_add.test.ts
│   ├── subscribe_update.test.ts
│   └── user.test.ts
└── utils ............................ 杂项
    ├── expressJwtConstructor.ts ..... 构造 express-jwt 选项
    ├── getTokenFrom.ts .............. 从请求头中获取 Token
    ├── logger.ts .................... 记录器
    ├── rmDB.ts ...................... 一键删库
    └── wait.ts ...................... Promisify 的 setTimeout() 函数
```

## 如何测试

```bash
yarn test
```

也可以单独运行仿真测试，该测试以模拟服务过程的思路设计，覆盖面更广。

```bash
yarn test:sim
```
