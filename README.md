# Cloud Web

基于 Vue 3 + TypeScript + Vite 构建的现代化前端项目，采用 Material Design 3 深色主题设计语言。

## 技术栈

- **构建工具**: Vite 8.x
- **前端框架**: Vue 3.5.x（Composition API + `<script setup>`）
- **开发语言**: TypeScript 6.x
- **UI 组件库**: Element Plus 2.x（深色主题定制）
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
│   │   ├── auth.ts      # 认证接口
│   │   ├── holiday.ts   # 节假日接口
│   │   ├── openlist.ts  # OpenList 接口
│   │   ├── tab.ts       # 标签管理接口
│   │   ├── transfer.ts  # 中转站接口
│   │   ├── upload.ts    # 文件上传接口
│   │   ├── weather.ts   # 天气接口
│   │   └── website.ts   # 网站管理接口
│   ├── assets/          # 项目资源文件
│   ├── components/      # 通用组件
│   │   ├── header/      # 头部组件
│   │   ├── AdminLayout.vue       # 管理后台布局
│   │   ├── CalendarModal.vue     # 日历弹窗
│   │   ├── DateTimeWidget.vue    # 日期时间组件
│   │   ├── WeatherWidget.vue     # 天气组件
│   │   └── WeatherDetailModal.vue # 天气详情弹窗
│   ├── composables/     # 组合式函数
│   │   ├── useHoliday.ts # 节假日数据
│   │   ├── useHomeData.ts # 首页数据
│   │   └── useWeather.ts # 天气数据
│   ├── data/            # 静态数据
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── styles/          # 全局样式
│   │   ├── design-system.scss  # 设计系统（CSS 变量、滚动条等）
│   │   └── element-dark.scss   # Element Plus 深色主题覆盖
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   │   ├── lunar.ts         # 农历工具
│   │   ├── request.ts       # Axios 请求封装
│   │   └── routeConfig.ts   # 路由与菜单统一配置
│   ├── views/           # 页面组件
│   │   ├── admin/       # 管理后台页面
│   │   ├── HomeView.vue # 首页
│   │   └── LoginView.vue # 登录页
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── openapi.json         # 后端 API 规范文件
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

## 功能模块

### 已对接功能

| 模块 | 功能 | 对接状态 |
| --- | --- | --- |
| **认证模块** | 用户登录 | 已对接 |
| **用户模块** | 获取/更新用户信息 | 已对接 |
| **导航管理** | 标签管理（增删改查） | 已对接 |
| | 网站管理（增删改查、排序） | 已对接 |
| **系统管理** | 菜单管理（增删改查） | 已对接 |
| **OpenList** | 全局配置管理 | 已对接 |
| | 任务配置管理（增删改查） | 已对接 |
| | 任务执行与取消 | 已对接 |
| | 运行中任务监控 | 已对接 |
| | 任务历史查看与详情 | 已对接 |
| | 实时日志（WebSocket） | 已对接 |
| **中转站** | 文本中转（增删改查） | 已对接 |
| | 文件中转（分片上传、下载、删除） | 已对接 |
| **代理服务** | 天气服务（自动定位） | 已对接 |
| | 节假日管理 | 已对接 |
| **文件上传** | 单文件/多文件上传 | 已对接 |

### 前端页面功能

| 页面 | 功能描述 | 状态 |
| --- | --- | --- |
| **登录页** | 用户登录、表单验证、自动跳转 | 已完成 |
| **首页** | 资源导航展示、内外网切换、视图切换（图标/卡片） | 已完成 |
| **天气组件** | 实时天气展示、浏览器定位、天气详情弹窗 | 已完成 |
| **日期时间组件** | 实时时间、公历/农历日期、节假日显示 | 已完成 |
| **标签页管理** | 标签页增删改查、分页、搜索排序 | 已完成 |
| **网站管理** | 网站增删改查、排序、搜索 | 已完成 |
| **节假日管理** | 节假日增删查、日历弹窗 | 已完成 |
| **OpenList管理** | 全局配置、任务配置、执行管理、任务历史、实时日志 | 已完成 |
| **中转站** | 文本气泡式消息、文件分片上传下载、批量删除 | 已完成 |

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

## API 模块说明

### 认证模块 (auth)

- `POST /api/user/login` - 用户登录

### 用户模块 (user)

- `POST /api/user/userInfo` - 获取用户信息
- `POST /api/user/update` - 更新用户信息

### 导航模块 (nav)

- `POST /api/nav/tabs` - 获取标签列表
- `POST /api/nav/tab/add` - 创建标签
- `POST /api/nav/tab/update` - 更新标签
- `POST /api/nav/tab/delete` - 删除标签
- `POST /api/nav/websites` - 获取网站列表
- `POST /api/nav/website/add` - 创建网站
- `POST /api/nav/website/update` - 更新网站
- `POST /api/nav/website/delete` - 删除网站
- `POST /api/nav/website/order` - 更新网站排序

### OpenList 模块 (openlist)

- `POST /api/openlist/global-config` - 获取全局配置
- `POST /api/openlist/global-config/add` - 创建全局配置
- `POST /api/openlist/global-config/update` - 更新全局配置
- `POST /api/openlist/global-config/delete` - 删除全局配置
- `POST /api/openlist/task-config/list` - 获取任务配置列表
- `POST /api/openlist/task-config/add` - 创建任务配置
- `POST /api/openlist/task-config/update` - 更新任务配置
- `POST /api/openlist/task-config/delete` - 删除任务配置
- `POST /api/openlist/execute` - 执行任务
- `POST /api/openlist/cancel` - 取消任务
- `POST /api/openlist/tasks/running` - 获取运行中任务
- `POST /api/openlist/task/latest-results` - 获取最新执行结果
- `POST /api/openlist/task/history` - 获取任务历史详情
- `WS /api/ws/logs` - 实时日志 WebSocket

### 中转站模块 (transfer)

- `POST /api/transfer/text/list` - 获取文本列表
- `POST /api/transfer/text/add` - 创建文本
- `POST /api/transfer/text/update` - 更新文本
- `POST /api/transfer/text/delete` - 删除文本
- `POST /api/transfer/file/list` - 获取文件列表
- `POST /api/transfer/file/create` - 创建文件上传任务
- `POST /api/transfer/file/chunk` - 上传文件分片
- `POST /api/transfer/file/complete` - 完成文件上传
- `POST /api/transfer/file/delete` - 删除文件
- `POST /api/transfer/file/download` - 下载文件

### 代理服务模块 (proxy)

- `POST /api/proxy/weather` - 获取天气信息
- `POST /api/proxy/holidays` - 获取节假日列表
- `POST /api/proxy/holiday/query` - 查询节假日
- `POST /api/proxy/holiday/add` - 创建节假日
- `POST /api/proxy/holiday/delete` - 删除节假日

### 文件上传模块 (upload)

- `POST /api/upload/file` - 单文件上传
- `POST /api/upload/files` - 多文件上传

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

# 以生产环境配置启动开发服务器
yarn dev:prod

# 构建生产环境（含 TypeScript 类型检查）
yarn build

# 预览生产构建
yarn preview
```

## 代码规范

- 2 个空格缩进
- 单引号优先
- 行尾不加分号
- 组件使用 Composition API + `<script setup lang="ts">`
- Props 和 Emit 使用 TypeScript 类型定义
- 路由与菜单配置统一管理于 `src/utils/routeConfig.ts`
- API 类型定义与 UI 类型分离

## 浏览器支持

- Chrome >= 88
- Firefox >= 78
- Safari >= 14
- Edge >= 88
