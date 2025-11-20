# zero-nav-next

基于 Next.js + OpenNext 的 Cloudflare Workers 导航站，支持在线管理书签。

## ✨ 功能特性

- 🚀 运行在 Cloudflare Workers，全球 CDN 加速
- 💾 使用 Cloudflare KV 存储数据
- 🎨 保留 zero-nav 简洁设计风格
- 🔐 管理后台 Token 认证
- ✏️ 在线 CRUD 书签管理
- 📦 支持数据导入/导出 (JSON)
- 🔄 自动备份历史版本
- 📱 响应式设计，支持移动端

## 🏗️ 技术栈

- **前端**: Next.js 15 (App Router) + React 18 + TailwindCSS
- **后端**: Cloudflare Workers
- **数据库**: Cloudflare Workers KV
- **构建**: OpenNext (Cloudflare adapter)
- **语言**: TypeScript

## 📁 项目结构

```
zero-nav-next/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 首页导航
│   │   ├── admin/page.tsx              # 管理后台
│   │   └── api/
│   │       ├── bookmarks/route.ts      # 公开API
│   │       └── admin/bookmarks/route.ts # 管理API
│   ├── lib/
│   │   ├── types.ts                    # 类型定义
│   │   ├── kv.ts                       # KV 存储封装
│   │   └── auth.ts                     # 认证逻辑
│   └── types/cloudflare.d.ts           # CF Workers 类型
├── wrangler.toml                       # Cloudflare 配置
├── open-next.config.ts                 # OpenNext 配置
└── tailwind.config.js                  # Tailwind 配置
```

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
open http://localhost:3000
```

### 构建

```bash
# 构建 Next.js
npm run build

# 构建 Worker
npm run build:worker

# 或一起构建
npm run build:all
```

## 📊 数据结构

KV 存储使用 key: `site:bookmarks`

```json
{
  "version": 3,
  "updatedAt": "2025-11-20T00:00:00Z",
  "bookmarks": [
    {
      "id": "b_1",
      "title": "Google",
      "url": "https://google.com",
      "tags": ["search"],
      "order": 1
    }
  ],
  "meta": {
    "customElements": {
      "headerText": "在线服务",
      "footerText": "Powered by zero-nav-next"
    }
  }
}
```

### 自动备份

每次修改都会自动备份到:
`site:bookmarks:history:<timestamp>`

备份保留 30 天。

## 🔐 管理认证

管理接口需要 Token 认证:

```bash
# 请求头
x-admin-token: your-secret-token
```

Token 在 `wrangler.toml` 中配置:

```toml
[vars]
ADMIN_TOKEN = "your-secret-token"
```

## 📡 API 接口

### 公开接口

#### `GET /api/bookmarks`
获取所有书签（无需认证）

### 管理接口（需要 Token）

#### `GET /api/admin/bookmarks`
获取完整配置

#### `POST /api/admin/bookmarks`
添加/更新书签

```json
{
  "action": "upsert",
  "item": {
    "id": "b_new",
    "title": "New Site",
    "url": "https://example.com",
    "tags": ["tool"],
    "order": 1
  }
}
```

或导入全部数据:

```json
{
  "action": "replace",
  "data": { ... 完整数据结构 ... }
}
```

#### `DELETE /api/admin/bookmarks?id=xxx`
删除指定书签

## 🌐 部署到 Cloudflare

### 方式一：GitHub Actions 自动部署（推荐）

使用 GitHub Actions 实现 CI/CD 自动部署。

#### 1. 配置 GitHub Secrets

前往仓库 **Settings > Secrets and variables > Actions**，添加以下 secrets：

| Secret Name | 说明 | 获取方式 |
|-------------|------|---------|
| `CLOUDFLARE_API_TOKEN` | CF API Token | [创建 Token](https://dash.cloudflare.com/profile/api-tokens) |
| `CLOUDFLARE_ACCOUNT_ID` | CF Account ID | Dashboard 右侧边栏 |
| `ADMIN_TOKEN` | 管理后台密码 | 自己设置强密码 |

详细配置指南见 [.github/SECRETS.md](.github/SECRETS.md)

#### 2. 创建 KV Namespace

```bash
# 登录 Cloudflare
npx wrangler login

# 创建生产环境 KV
npx wrangler kv:namespace create "BOOKMARKS"
# 输出: id = "xxxxxxxx"

# 创建预览环境 KV
npx wrangler kv:namespace create "BOOKMARKS" --preview
# 输出: preview_id = "yyyyyyyy"
```

#### 3. 更新 wrangler.toml

```toml
[[kv_namespaces]]
binding = "BOOKMARKS_KV"
id = "xxxxxxxx"              # 替换为上一步的 ID
preview_id = "yyyyyyyy"      # 替换为上一步的 preview_id
```

#### 4. 推送代码触发部署

```bash
git add .
git commit -m "Configure deployment"
git push origin main
```

GitHub Actions 会自动构建并部署到 Cloudflare Workers。

---

### 方式二：本地手动部署

#### 1. 创建 KV 命名空间

```bash
# 生产环境
npx wrangler kv:namespace create "BOOKMARKS"

# 预览环境
npx wrangler kv:namespace create "BOOKMARKS" --preview
```

记录输出的 namespace ID。

#### 2. 更新 wrangler.toml

```toml
[[kv_namespaces]]
binding = "BOOKMARKS_KV"
id = "你的KV_ID"
preview_id = "你的预览KV_ID"

[vars]
ADMIN_TOKEN = "设置一个强密码"
```

#### 3. 部署

```bash
npm run deploy
```

#### 4. 初始化数据（可选）

```bash
# 通过 wrangler 导入初始数据
npx wrangler kv:key put --namespace-id=你的KV_ID "site:bookmarks" '{
  "version": 1,
  "updatedAt": "'$(date -Iseconds)'",
  "bookmarks": [],
  "meta": {
    "customElements": {
      "headerText": "在线服务",
      "footerText": "Powered by zero-nav-next"
    }
  }
}'
```

或访问 `/admin` 手动添加。

## 🎯 使用管理后台

1. 访问 `https://your-domain.workers.dev/admin`
2. 输入 `ADMIN_TOKEN`
3. 开始管理书签：
   - ✏️ 添加/编辑/删除书签
   - 🔢 调整排序
   - 📥 导入 JSON 数据
   - 📤 导出备份

## 🔧 自定义

### 修改样式

编辑 `src/app/globals.css`:

```css
:root {
  --color-primary: #774cb2;    /* 主题色 */
  --color-text-primary: #070a13;
}
```

### 修改默认文案

编辑 `src/lib/types.ts` 中的 `DEFAULT_SITE_DATA`。

## 📝 脚本命令

```bash
npm run dev          # 开发服务器
npm run build        # 构建 Next.js
npm run build:worker # 构建 Cloudflare Worker
npm run build:all    # 完整构建
npm run deploy       # 构建并部署
npm run preview      # 本地预览 Worker
```

## 🛠️ 故障排除

### 构建失败

确保使用 Node.js 18+:

```bash
node --version  # 应该 >= 18.0.0
```

### KV 数据无法保存

1. 检查 KV 绑定是否正确
2. 确认 `binding` 名称为 `BOOKMARKS_KV`
3. 验证 namespace ID 正确

### 管理后台 401

检查 Token 是否正确设置在 `wrangler.toml` 和请求头中。

## 📜 License

MIT

## 🙏 致谢

- UI 设计灵感来自 [hahabye/zero-nav](https://github.com/hahabye/zero-nav)
- 基于 [OpenNext](https://opennext.js.org/) 构建
