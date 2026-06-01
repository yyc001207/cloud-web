# Cloud Web

基于 Vue 3 + TypeScript + Vite 构建的现代化前端项目，采用 Material Design 3 深色主题设计语言，为 Cloud Server 后端服务提供友好的用户界面。

## 项目信息

| 项目     | 值                      |
| -------- | ----------------------- |
| 版本     | 0.0.0                   |
| Node.js  | >= 18                   |
| 包管理器 | Yarn / npm              |

---

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [功能模块](#功能模块)
- [功能特性](#功能特性)
- [API 模块说明](#api-模块说明)
- [开发指南](#开发指南)
- [代码规范](#代码规范)
- [浏览器支持](#浏览器支持)

---

## 技术栈

| 类别            | 技术                    | 版本        | 用途                |
| --------------- | ----------------------- | ----------- | ------------------- |
| 构建工具        | Vite                    | 8.x         | 快速构建工具        |
| 前端框架        | Vue                     | 3.5.x       | 渐进式 JavaScript 框架 |
| 开发语言        | TypeScript              | 6.x         | 类型安全 JavaScript |
| UI 组件库       | Element Plus            | 2.x         | Vue 3 组件库       |
| 状态管理        | Pinia                   | 3.x         | Vue 状态管理       |
| 路由管理        | Vue Router              | 4.x         | Vue 官方路由       |
| HTTP 客户端     | Axios                   | 1.x         | HTTP 请求库        |
| 样式预处理器    | Sass                    | 1.x         | CSS 预处理器       |
| 农历计算        | lunar-javascript        | 1.7.x       | 农历日期计算       |

---

## 项目结构

```
cloud-web/
├── public/                  # 静态资源
│   ├── favicon.svg          # 网站图标
│   └── icons.svg            # 图标资源
├── src/
│   ├── api/                 # API 接口封装
│   │   ├── auth.ts          # 认证相关接口
│   │   ├── holiday.ts       # 节假日接口
│   │   ├── openlist.ts      # OpenList 接口
│   │   ├── tab.ts           # 标签管理接口
│   │   ├── transfer.ts      # 中转站接口
│   │   ├── upload.ts        # 文件上传接口
│   │   ├── weather.ts       # 天气接口
│   │   └── website.ts       # 网站管理接口
│   ├── assets/              # 项目资源文件
│   ├── components/           # 通用组件
│   │   ├── header/           # 头部组件
│   │   │   └── HeaderCore.vue
│   │   ├── AdminLayout.vue   # 管理后台布局
│   │   ├── AppHeader.vue    # 应用头部
│   │   ├── CalendarModal.vue    # 日历弹窗
│   │   ├── DateTimeWidget.vue   # 日期时间组件
│   │   ├── ResourceDetailCard.vue # 资源详情卡片
│   │   ├── ResourceIconCard.vue  # 资源图标卡片
│   │   ├── WeatherDetailModal.vue  # 天气详情弹窗
│   │   └── WeatherWidget.vue    # 天气组件
│   ├── composables/          # 组合式函数（Hooks）
│   │   ├── useHoliday.ts     # 节假日数据
│   │   ├── useHomeData.ts    # 首页数据
│   │   └── useWeather.ts     # 天气数据
│   ├── data/                 # 静态数据
│   │   └── resources.ts       # 资源数据
│   ├── router/               # 路由配置
│   │   └── index.ts
│   ├── stores/               # Pinia 状态管理
│   │   ├── app.ts            # 应用状态
│   │   └── auth.ts           # 认证状态
│   ├── styles/               # 全局样式
│   │   ├── design-system.scss # 设计系统（CSS 变量、滚动条等）
│   │   ├── element-dark.css   # Element Plus 深色主题覆盖
│   │   └── element-dark.scss
│   ├── types/                # TypeScript 类型定义
│   │   ├── auth.ts           # 认证类型
│   │   ├── holiday.ts        # 节假日类型
│   │   ├── openlist.ts       # OpenList 类型
│   │   ├── tab.ts            # 标签类型
│   │   ├── transfer.ts       # 中转站类型
│   │   ├── upload.ts         # 上传类型
│   │   ├── weather.ts        # 天气类型
│   │   └── website.ts        # 网站类型
│   ├── utils/                # 工具函数
│   │   ├── lunar.ts          # 农历工具
│   │   ├── request.ts        # Axios 请求封装
│   │   └── routeConfig.ts    # 路由与菜单统一配置
│   ├── views/                # 页面组件
│   │   ├── admin/            # 管理后台页面
│   │   │   ├── HolidayView.vue    # 节假日管理
│   │   │   ├── OpenListView.vue  # OpenList 管理
│   │   │   ├── TabView.vue        # 标签管理
│   │   │   ├── TransferView.vue   # 中转站
│   │   │   └── WebsiteView.vue    # 网站管理
│   │   ├── HomeView.vue      # 首页
│   │   └── LoginView.vue     # 登录页
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
│   └── style.css             # 全局样式
├── .env.development          # 开发环境配置
├── .env.production           # 生产环境配置
├── index.html                # HTML 入口
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
├── tsconfig.app.json         # TypeScript 应用配置
├── tsconfig.node.json        # TypeScript Node 配置
├── vite.config.ts            # Vite 配置
└── yarn.lock                 # Yarn 锁定文件
```

---

## 功能模块

### 已对接功能

| 模块           | 功能                         | 对接状态 |
| -------------- | ---------------------------- | -------- |
| **认证模块**   | 用户登录                     | 已完成   |
| **用户模块**   | 获取/更新用户信息            | 已完成   |
| **导航管理**   | 标签管理（增删改查）          | 已完成   |
|                | 网站管理（增删改查、排序）    | 已完成   |
| **系统管理**   | 菜单管理（增删改查）          | 已完成   |
| **OpenList**   | 全局配置管理                 | 已完成   |
|                | 任务配置管理（增删改查）      | 已完成   |
|                | 任务执行与取消               | 已完成   |
|                | 运行中任务监控               | 已完成   |
|                | 任务历史查看与详情           | 已完成   |
|                | 实时日志（WebSocket）         | 已完成   |
| **中转站**     | 文本中转（增删改查）          | 已完成   |
|                | 文件中转（分片上传、下载、删除） | 已完成 |
| **代理服务**   | 天气服务（自动定位）          | 已完成   |
|                | 节假日管理                   | 已完成   |
| **文件上传**   | 单文件/多文件上传             | 已完成   |

### 前端页面功能

| 页面               | 功能描述                                           | 状态   |
| ------------------ | -------------------------------------------------- | ------ |
| **登录页**         | 用户登录、表单验证、自动跳转                       | 已完成 |
| **首页**           | 资源导航展示、内外网切换、视图切换（图标/卡片）    | 已完成 |
| **天气组件**       | 实时天气展示、浏览器定位、天气详情弹窗              | 已完成 |
| **日期时间组件**   | 实时时间、公历/农历日期、节假日显示                | 已完成 |
| **标签页管理**     | 标签页增删改查、分页、搜索排序                     | 已完成 |
| **网站管理**       | 网站增删改查、排序、搜索                           | 已完成 |
| **节假日管理**     | 节假日增删查、日历弹窗                             | 已完成 |
| **OpenList管理**   | 全局配置、任务配置、执行管理、任务历史、实时日志   | 已完成 |
| **中转站**         | 文本气泡式消息、文件分片上传下载、批量删除          | 已完成 |

---

## 功能特性

- Vue 3 Composition API + `<script setup>` 语法
- 完整的 TypeScript 类型支持（API 原始类型与 UI 类型分离）
- Element Plus 深色主题定制（CSS 变量覆盖）
- Material Design 3 设计语言
- Pinia 状态管理，按功能模块划分 store
- Axios 请求封装，统一拦截器与错误处理
- 路由与菜单统一配置（`routeConfig.ts`），新增页面只需修改一处
- 组合式函数（composables）封装共享逻辑
- 浏览器 Geolocation API 自动定位
- WebSocket 实时日志连接
- 文件分片上传（5MB 分片）
- 响应式设计，支持移动端适配
- 深色主题加载蒙层优化

---

## API 模块说明

### 认证模块 (auth)

| 接口                      | 方法 | 功能     |
| ------------------------- | ---- | -------- |
| POST /api/user/login      | POST | 用户登录 |

### 用户模块 (user)

| 接口                       | 方法 | 功能         |
| -------------------------- | ---- | ------------ |
| POST /api/user/userInfo    | POST | 获取用户信息 |
| POST /api/user/update      | POST | 更新用户信息 |

### 导航模块 (nav)

| 接口                           | 方法 | 功能               |
| ------------------------------ | ---- | ------------------ |
| POST /api/nav/tabs             | POST | 获取标签列表       |
| POST /api/nav/tab/add          | POST | 创建标签           |
| POST /api/nav/tab/update       | POST | 更新标签           |
| POST /api/nav/tab/delete       | POST | 删除标签           |
| POST /api/nav/websites         | POST | 获取网站列表       |
| POST /api/nav/website/add      | POST | 创建网站           |
| POST /api/nav/website/update   | POST | 更新网站           |
| POST /api/nav/website/delete   | POST | 删除网站           |
| POST /api/nav/website/order    | POST | 更新网站排序       |

### OpenList 模块 (openlist)

| 接口                                 | 方法 | 功能                 |
| ------------------------------------ | ---- | -------------------- |
| POST /api/openlist/global-config     | POST | 获取全局配置         |
| POST /api/openlist/global-config/add | POST | 创建全局配置         |
| POST /api/openlist/global-config/update | POST | 更新全局配置     |
| POST /api/openlist/global-config/delete | POST | 删除全局配置     |
| POST /api/openlist/task-config/list | POST | 获取任务配置列表       |
| POST /api/openlist/task-config/add  | POST | 创建任务配置         |
| POST /api/openlist/task-config/update | POST | 更新任务配置       |
| POST /api/openlist/task-config/delete | POST | 删除任务配置       |
| POST /api/openlist/execute          | POST | 执行任务             |
| POST /api/openlist/cancel           | POST | 取消任务             |
| POST /api/openlist/tasks/running     | POST | 获取运行中任务       |
| POST /api/openlist/task/latest-results | POST | 获取最新执行结果   |
| POST /api/openlist/task/history      | POST | 获取任务历史详情     |
| WS /api/openlist/ws/logs            | WS   | 实时日志 WebSocket   |

### 中转站模块 (transfer)

| 接口                                | 方法 | 功能               |
| ----------------------------------- | ---- | ------------------ |
| POST /api/transfer/text/list        | POST | 获取文本列表       |
| POST /api/transfer/text/add         | POST | 创建文本           |
| POST /api/transfer/text/update      | POST | 更新文本           |
| POST /api/transfer/text/delete      | POST | 删除文本           |
| POST /api/transfer/file/list        | POST | 获取文件列表       |
| POST /api/transfer/file/create      | POST | 创建文件上传任务   |
| POST /api/transfer/file/chunk       | POST | 上传文件分片       |
| POST /api/transfer/file/complete     | POST | 完成文件上传       |
| POST /api/transfer/file/delete      | POST | 删除文件           |
| POST /api/transfer/file/download    | POST | 下载文件           |

### 代理服务模块 (proxy)

| 接口                           | 方法 | 功能             |
| ------------------------------ | ---- | ---------------- |
| POST /api/proxy/weather        | POST | 获取天气信息     |
| POST /api/proxy/holidays       | POST | 获取节假日列表   |
| POST /api/proxy/holiday/query  | POST | 查询节假日       |
| POST /api/proxy/holiday/add    | POST | 创建节假日       |
| POST /api/proxy/holiday/delete | POST | 删除节假日       |

### 文件上传模块 (upload)

| 接口                  | 方法 | 功能           |
| --------------------- | ---- | -------------- |
| POST /api/upload/file | POST | 单文件上传     |
| POST /api/upload/files | POST | 多文件上传     |

---

## 开发指南

### 环境要求

- Node.js >= 18
- Yarn 或 npm

### 安装依赖

```bash
yarn install
```

### 开发命令

```bash
# 启动开发服务器
yarn dev

# 以生产环境配置启动开发服务器
yarn dev:prod

# 构建生产环境（含 TypeScript 类型检查）
yarn build

# 预览生产构建
yarn preview
```

### 环境变量配置

**开发环境 (.env.development)**

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**生产环境 (.env.production)**

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## 代码规范

- 2 个空格缩进
- 单引号优先
- 行尾不加分号
- 组件使用 Composition API + `<script setup lang="ts">`
- Props 和 Emit 使用 TypeScript 类型定义
- 路由与菜单配置统一管理于 `src/utils/routeConfig.ts`
- API 类型定义与 UI 类型分离

---

## 浏览器支持

| 浏览器  | 最低版本 |
| ------- | -------- |
| Chrome  | >= 88    |
| Firefox | >= 78    |
| Safari  | >= 14    |
| Edge    | >= 88    |
