# Cloudflare Pages 部署指南

## 快速开始

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **连接 GitHub 仓库**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 Workers & Pages
   - 点击 "Create application" > "Pages" > "Connect to Git"
   - 选择你的 GitHub 仓库 `zero-nav`

2. **配置构建设置**
   ```
   项目名称: zero-nav
   生产分支: main (或你的主分支)
   框架预设: Next.js
   构建命令: npm run build
   构建输出目录: .next
   Node.js 版本: 18 或更高
   ```

3. **创建 KV 命名空间**
   - 在 Cloudflare Dashboard 中，进入 Workers & Pages > KV
   - 创建新的 KV 命名空间，命名为 `BOOKMARKS`
   - 记录生成的命名空间 ID

4. **绑定 KV 到 Pages**
   - 回到你的 Pages 项目
   - 进入 Settings > Functions
   - 在 "KV namespace bindings" 部分点击 "Add binding"
   - Variable name: `BOOKMARKS`
   - KV namespace: 选择刚创建的 `BOOKMARKS`
   - 点击保存

5. **部署**
   - 返回 Deployments 页面
   - Cloudflare 会自动开始构建和部署
   - 等待几分钟，部署完成后会显示 URL

### 方法二：使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **创建 KV 命名空间**
   ```bash
   # 生产环境
   wrangler kv:namespace create "BOOKMARKS"
   # 输出示例: id = "abc123def456"

   # 预览环境
   wrangler kv:namespace create "BOOKMARKS" --preview
   # 输出示例: preview_id = "xyz789uvw012"
   ```

4. **更新 wrangler.toml**
   将上面获取的 ID 填入 `wrangler.toml`：
   ```toml
   [env.production]
   kv_namespaces = [
     { binding = "BOOKMARKS", id = "abc123def456" }
   ]

   [env.preview]
   kv_namespaces = [
     { binding = "BOOKMARKS", id = "xyz789uvw012" }
   ]
   ```

5. **构建项目**
   ```bash
   npm run build
   ```

6. **部署到 Cloudflare Pages**
   ```bash
   npx wrangler pages deploy .next --project-name=zero-nav
   ```

## 初始化数据

部署后，首次访问时会使用默认配置。你可以：

1. **通过管理界面初始化**
   - 访问 `https://your-domain.pages.dev/admin`
   - 手动添加你的书签

2. **通过 Wrangler 导入现有配置**
   ```bash
   # 从 config.yml 导入
   wrangler kv:key put --namespace-id=YOUR_KV_ID "config" --path=config.yml
   ```

## 环境变量（可选）

如果需要添加身份验证等功能，可以在 Cloudflare Pages 设置中添加环境变量：

```
Settings > Environment variables > Add variable
```

常见的环境变量：
- `ADMIN_PASSWORD`: 管理员密码（需要修改代码实现）
- `NODE_ENV`: production

## 自定义域名

1. 进入你的 Pages 项目
2. 点击 "Custom domains"
3. 添加你的域名
4. 按照提示配置 DNS 记录

## 故障排除

### 构建失败

1. 检查 Node.js 版本是否 >= 18
2. 确保 `package-lock.json` 已提交
3. 查看构建日志中的错误信息

### KV 数据无法保存

1. 确认 KV 绑定配置正确
2. 检查变量名是否为 `BOOKMARKS`
3. 确认 KV 命名空间 ID 正确

### 访问管理页面 404

1. 确保部署的是完整的 Next.js 应用（不是静态导出）
2. 检查路由配置

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
# 前端: http://localhost:3000
# 管理: http://localhost:3000/admin
```

本地开发时，数据会保存到 `config.yml` 文件。

## 更新部署

### Git 集成方式
推送到 main 分支会自动触发部署：
```bash
git add .
git commit -m "update"
git push
```

### CLI 方式
```bash
npm run build
npx wrangler pages deploy .next
```

## 安全建议

1. **保护管理界面**: 目前 `/admin` 没有密码保护，建议添加认证
2. **使用 HTTPS**: Cloudflare Pages 默认启用 HTTPS
3. **定期备份**: 定期导出 KV 数据

## 性能优化

1. **启用 CDN**: Cloudflare 自动提供全球 CDN
2. **图片优化**: 使用 Cloudflare Images（可选）
3. **缓存策略**: 在 `_headers` 文件中配置缓存

## 成本

Cloudflare Pages 免费套餐包括：
- 500 次构建/月
- 无限请求
- 100GB 带宽/月

KV 免费套餐：
- 100,000 读取/天
- 1,000 写入/天
- 1GB 存储

对于个人导航页面，免费套餐完全够用。

## 技术支持

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare KV 文档](https://developers.cloudflare.com/kv/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
