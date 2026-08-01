# Snack Demo 协作约定

## 开始修改

先同步 `main`，再为一个明确主题创建一个分支：

```bash
git fetch github
git switch -c feat/<topic> github/main
npm ci
npm run dev
```

不要在 `main` 上直接开发，也不要用 `git add .` 混入其他人的文件。提交前只暂存本次修改的明确路径。

## 页面归属

- 页面路由和状态切换：`app/page.tsx`
- Snack 产品页面：`app/product-pages.tsx`
- 产品页面样式：`app/product-pages.css`
- 录音到项目六步流程：`app/page.tsx` 与 `app/globals.css`
- 页面清单与入口参数：`README.md`
- SSR 页面覆盖：`tests/rendered-html.test.mjs`

修改公共侧栏、颜色变量或布局骨架时，应检查全部页面。只修改单页时，尽量把样式限定在该页面根类名下，避免覆盖录音流程和其他人的页面。

## 提交与 Pull Request

一次 PR 只解决一个主题，例如：

- `feat/record-library-filter`
- `fix/task-detail-spacing`
- `style/home-card-fidelity`

提交前运行：

```bash
npm run lint
npm test
```

视觉改动需要在 1440 × 1024 下检查对应页面，并在 PR 中附截图或录屏。PR 合并后，其他协作者再从最新 `main` 创建新分支，避免多人直接覆盖同一条分支。
