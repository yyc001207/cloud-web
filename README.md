# Cloud Web

基于 Vue 3 + TypeScript + Vite 构建的现代化前端项目。

## 技术栈

- **构建工具**: Vite 6.x
- **前端框架**: Vue 3.5.x
- **开发语言**: TypeScript 5.x
- **UI 组件库**: Element Plus 2.x
- **状态管理**: Pinia 3.x
- **路由管理**: Vue Router 4.x
- **样式预处理器**: Sass
- **HTTP 客户端**: Axios
- **农历计算**: lunar-javascript

## 项目结构

```
├── public/              # 静态资源
├── src/
│   ├── api/             # API 接口封装
│   │   ├── modules/     # 按模块划分的 API
│   │   ├── index.ts     # API 入口
│   │   └── request.ts   # Axios 请求封装
│   ├── assets/          # 项目资源文件
│   ├── components/      # 通用组件
│   ├── data/            # 静态数据
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── styles/          # 全局样式
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

## 功能模块

### 已对接功能

| 模块         | 功能                       | 对接状态 |
| ------------ | -------------------------- | -------- |
| **认证模块** | 用户登录                   | 已对接   |
|              | 用户注册                   | 已对接   |
| **用户模块** | 获取用户信息               | 已对接   |
|              | 更新用户信息               | 已对接   |
| **导航管理** | 标签管理（增删改查）       | 已对接   |
|              | 网站管理（增删改查、排序） | 已对接   |
| **系统管理** | 菜单管理（增删改查）       | 已对接   |
| **OpenList** | 全局配置管理               | 已对接   |
|              | 任务配置管理               | 已对接   |
| **中转站**   | 文本中转（增删改查）       | 已对接   |
|              | 文件中转（分片上传）       | 已对接   |
| **代理服务** | 天气服务                   | 已对接   |
|              | 节假日管理                 | 已对接   |
| **文件上传** | 单文件上传                 | 已对接   |
|              | 多文件上传                 | 已对接   |

### 前端页面功能

| 页面             | 功能描述                                        | 状态   |
| ---------------- | ----------------------------------------------- | ------ |
| **登录页**       | 用户登录、表单验证、自动跳转                    | 已完成 |
| **首页**         | 资源导航展示、内外网切换、视图切换（图标/卡片） | 已完成 |
| **天气组件**     | 实时天气展示、位置显示                          | 已完成 |
| **日期时间组件** | 实时时间、公历/农历日期显示                     | 已完成 |

## 功能特性

- 使用 Vue 3 Composition API + `<script setup>` 语法
- 完整的 TypeScript 类型支持
- 基于 Element Plus 的 UI 组件
- Pinia 状态管理，按功能模块划分 store
- Axios 请求封装，支持拦截器
- 模块化 API 管理
- 路由守卫和动态路由支持
- 响应式设计，支持移动端适配
- Material Design 3 设计语言

## API 模块说明

### 认证模块 (auth)

- `POST /user/login` - 用户登录
- `POST /user/register` - 用户注册

### 用户模块 (user)

- `POST /user/userInfo` - 获取用户信息
- `POST /user/update` - 更新用户信息

### 导航模块 (nav)

- `POST /nav/tabs` - 获取标签列表
- `POST /nav/tab/add` - 创建标签
- `POST /nav/tab/update` - 更新标签
- `POST /nav/tab/delete` - 删除标签
- `POST /nav/websites` - 获取网站列表
- `POST /nav/website/add` - 创建网站
- `POST /nav/website/update` - 更新网站
- `POST /nav/website/delete` - 删除网站
- `POST /nav/website/order` - 更新网站排序

### 系统模块 (system)

- `POST /system/menus` - 获取菜单列表
- `POST /system/menu/add` - 创建菜单
- `POST /system/menu/update` - 更新菜单
- `POST /system/menu/delete` - 删除菜单

### OpenList 模块 (openlist)

- `POST /openlist/global-config` - 获取全局配置列表
- `POST /openlist/global-config/add` - 创建全局配置
- `POST /openlist/global-config/update` - 更新全局配置
- `POST /openlist/global-config/delete` - 删除全局配置
- `POST /openlist/task-config/list` - 获取任务配置列表
- `POST /openlist/task-config/add` - 创建任务配置
- `POST /openlist/task-config/update` - 更新任务配置
- `POST /openlist/task-config/delete` - 删除任务配置

### 中转站模块 (transfer)

- `POST /transfer/text/list` - 获取文本列表
- `POST /transfer/text/add` - 创建文本
- `POST /transfer/text/update` - 更新文本
- `POST /transfer/text/delete` - 删除文本
- `POST /transfer/file/list` - 获取文件列表
- `POST /transfer/file/create` - 创建文件上传任务
- `POST /transfer/file/chunk` - 上传文件分片
- `POST /transfer/file/complete` - 完成文件上传
- `POST /transfer/file/delete` - 删除文件

### 代理服务模块 (proxy)

- `POST /proxy/weather` - 获取天气信息
- `POST /proxy/holidays` - 获取节假日列表
- `POST /proxy/holiday/add` - 创建节假日
- `POST /proxy/holiday/delete` - 删除节假日

### 文件上传模块 (upload)

- `POST /upload/file` - 单文件上传
- `POST /upload/files` - 多文件上传

## 开发环境要求

- Node.js >= 18
- Yarn 或 npm

## 安装依赖

```bash
yarn install
```

## 开发命令

```bash
# 启动开发服务器
yarn dev

# 构建生产环境
yarn build

# 预览生产构建
yarn preview
```

## 代码规范

- 2 个空格缩进
- 单引号优先
- 行尾不加分号
- 组件使用组合式 API
- Props 和 Emit 使用 TypeScript 类型定义

## 浏览器支持

- Chrome >= 88
- Firefox >= 78
- Safari >= 14
- Edge >= 88
