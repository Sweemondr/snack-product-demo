# Snack 静态 Demo 协作约定

## 开始修改

先同步 `main`，再为一个明确主题创建分支：

```bash
git fetch origin
git switch -c feat/<topic> origin/main
python3 -m http.server 8765
```

访问 <http://127.0.0.1:8765/> 验收。不要用 `git add .` 混入无关文件；只暂存本次修改的明确路径。

## 文件归属

- 页面结构与资源引用：`index.html`
- 页面路由、状态和交互：`snack-entry-refactor-demo.js`
- 布局与视觉样式：`snack-entry-refactor-demo.css`
- 图片与本地依赖：`assets/`、`vendor/`

修改公共侧栏、状态机或布局骨架时，应检查全部相关页面和连续交互状态。

## 提交与 Pull Request

提交前至少运行：

```bash
node --check snack-entry-refactor-demo.js
```

视觉或交互改动需要通过本地 HTTP 服务逐状态检查，并在 PR 中附上截图或录屏。
