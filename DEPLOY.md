# 博客上线指南（GitHub Pages）

这是一个静态网站（`index.html` + `style.css` + `script.js`），已配置自动部署文件：

- `.github/workflows/deploy-pages.yml`

## 1. 推送到 GitHub 仓库

在项目目录执行：

```bash
git init
git add .
git commit -m "init blog"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

## 2. 打开 GitHub Pages

1. 进入仓库 `Settings`
2. 找到 `Pages`
3. `Source` 选择 `GitHub Actions`

## 3. 等待自动部署完成

推送后会自动运行 `Deploy Static Site to GitHub Pages` 工作流。

部署成功后，访问：

- `https://<你的用户名>.github.io/<仓库名>/`

## 4. 每次更新的发布方式

本地修改后执行：

```bash
git add .
git commit -m "update blog"
git push
```

几分钟后新内容会自动上线。

## 可选：绑定自定义域名

1. 在仓库根目录创建 `CNAME` 文件，内容写你的域名（如 `blog.example.com`）
2. 在域名 DNS 服务商处添加 `CNAME` 记录指向 `<你的用户名>.github.io`
3. 在仓库 `Settings > Pages` 中确认域名与 HTTPS
