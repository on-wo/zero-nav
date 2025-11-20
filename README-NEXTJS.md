# Zero Nav - Next.js 版本

这是 zero-nav 的 Next.js 版本，支持通过 /admin 页面在线管理书签。

## 功能特性

- ✅ 保留原有简洁设计
- ✅ Next.js 15 + React 18 + TypeScript
- ✅ 后端 API 支持书签管理
- ✅ /admin 管理界面
- ✅ Lucide React 图标库
- ✅ 支持 Cloudflare Pages 部署
- ✅ Cloudflare KV 存储（生产环境）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
open http://localhost:3000

# 访问管理后台
open http://localhost:3000/admin
```

## 部署到 Cloudflare Pages

### 1. 创建 KV 命名空间

```bash
# 创建生产环境 KV
npx wrangler kv:namespace create "BOOKMARKS"

# 创建预览环境 KV
npx wrangler kv:namespace create "BOOKMARKS" --preview
```

### 2. 更新 wrangler.toml

将上一步得到的 KV ID 填入 `wrangler.toml` 文件中。

### 3. 构建项目

```bash
npm run build
```

### 4. 部署到 Cloudflare Pages

有两种方式：

**方式一：通过 Git 集成（推荐）**

1. 将代码推送到 GitHub
2. 在 Cloudflare Dashboard 中创建 Pages 项目
3. 连接 GitHub 仓库
4. 配置构建设置：
   - 构建命令: `npm run build`
   - 构建输出目录: `.next`
   - 环境变量: 添加 KV 绑定

**方式二：使用 Wrangler CLI**

```bash
npx wrangler pages deploy .next
```

### 5. 绑定 KV 命名空间

在 Cloudflare Pages 项目设置中：
- 进入 Settings > Functions
- 添加 KV namespace binding
- Binding name: `BOOKMARKS`
- KV namespace: 选择之前创建的 KV

## 使用 KV 存储

在生产环境中，数据会自动保存到 Cloudflare KV。在开发环境中，数据保存到本地的 `config.yml` 文件。

### 初始化 KV 数据

如果是首次部署，可以通过 API 或管理界面上传初始配置：

```bash
# 使用 wrangler 命令行
npx wrangler kv:key put --namespace-id=<YOUR_KV_ID> "config" "$(cat config.yml)"
```

## 管理界面

访问 `/admin` 可以：
- 添加/编辑/删除书签
- 添加/删除分类
- 选择图标（支持 Lucide 图标库）
- 自定义 SVG 图标

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **UI**: React 18
- **图标**: Lucide React
- **部署**: Cloudflare Pages
- **存储**: Cloudflare KV
- **样式**: CSS (保留原设计)

## 项目结构

```
zero-nav/
├── app/
│   ├── api/
│   │   └── bookmarks/
│   │       └── route.ts          # API 路由
│   ├── admin/
│   │   └── page.tsx              # 管理界面
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── lib/
│   ├── types.ts                  # TypeScript 类型定义
│   └── kv.ts                     # KV 存储逻辑
├── public/                       # 静态资源
├── config.yml                    # 本地配置文件
├── wrangler.toml                 # Cloudflare 配置
├── next.config.js                # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

## 注意事项

1. 管理界面 `/admin` 目前没有密码保护，建议部署后添加认证
2. 图标可以使用 SVG 代码或从 Lucide 图标库选择
3. KV 存储有免费额度限制，超出需付费

## License

MIT
