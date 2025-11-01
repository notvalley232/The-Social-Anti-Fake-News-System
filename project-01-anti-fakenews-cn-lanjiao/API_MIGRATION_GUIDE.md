# API 迁移指南

## 概述

本项目已经准备好从本地 JSON 文件切换到外部 GitHub JSON 服务器。所有 JSON 数据文件已经迁移到 `../api-data/` 目录中。

## 数据迁移完成情况

✅ **已完成的迁移：**
- `mockNews.json` - 新闻数据（来自 src/data，包含更丰富的内容）
- `mockComments.json` - 评论数据（合并了 public/data 和 src/data 的数据）
- `mockVotes.json` - 投票数据（来自 src/data）
- `mockUsers.json` - 用户数据（来自 public/data，转换为对象格式）

## 如何切换到外部 API

### 1. 设置 GitHub JSON 服务器

1. 将 `api-data` 目录推送到 GitHub 仓库
2. 启用 GitHub Pages 或使用其他 JSON 服务器服务
3. 获取 JSON 服务器的基础 URL

### 2. 更新环境变量

编辑项目根目录的 `.env` 文件：

```env
# 启用外部 API
VITE_USE_EXTERNAL_API=true

# 设置外部 API 基础 URL
VITE_API_BASE_URL=https://your-username.github.io/api-data
```

### 3. 数据服务自动切换

`DataService` 类已经配置为：
- 当 `VITE_USE_EXTERNAL_API=true` 时，优先使用外部 API
- 如果外部 API 失败，自动回退到本地 JSON 文件
- 支持运行时切换数据源

### 4. API 端点映射

外部 API 端点对应关系：
- `/news` → `mockNews.json`
- `/comments` → `mockComments.json`
- `/votes` → `mockVotes.json`
- `/users` → `mockUsers.json`

### 5. 数据格式兼容性

DataService 支持两种数据格式：
- 对象格式：`{news: [...], comments: [...], votes: [...], users: [...]}`
- 数组格式：`[...]`

## 测试切换

1. 确保本地开发服务器正在运行
2. 修改 `.env` 文件中的 `VITE_USE_EXTERNAL_API` 值
3. 重启开发服务器以加载新的环境变量
4. 检查浏览器控制台确认数据源

## 故障排除

### 常见问题

1. **外部 API 无法访问**
   - 检查 `VITE_API_BASE_URL` 是否正确
   - 确认 GitHub Pages 或 JSON 服务器正在运行
   - 系统会自动回退到本地 JSON 文件

2. **数据格式错误**
   - 确认外部 JSON 文件格式正确
   - 检查浏览器网络面板查看 API 响应

3. **环境变量未生效**
   - 重启开发服务器
   - 确认 `.env` 文件在项目根目录
   - 检查环境变量名称是否以 `VITE_` 开头

## 开发者工具

可以在运行时通过以下方式检查和切换数据源：

```javascript
// 检查当前数据源
console.log('Using external API:', dataService.isUsingExternalAPI())
console.log('API Base URL:', dataService.getAPIBaseUrl())

// 运行时切换数据源
dataService.setUseExternalAPI(true)
dataService.setAPIBaseUrl('https://your-api-url.com')
```

## 备份说明

- 原始 JSON 文件仍保留在项目中作为备份
- 可以随时通过设置 `VITE_USE_EXTERNAL_API=false` 回退到本地文件
- 建议在生产环境部署前充分测试外部 API 的稳定性