# Snack 静态交互 Demo

这是 Snack 本地静态原型的 GitHub 版本。仓库根目录就是可运行入口，不包含 React、Vinext 或服务端工程。

## 本地启动

```bash
python3 -m http.server 8765
```

然后访问 <http://127.0.0.1:8765/>。

## Snack Record 验收路径

1. 进入“应用”，首次点击 Snack Record 的“开始使用”。
2. 完成本地资源检测和默认配置；配置会保存在浏览器 `localStorage`。
3. 配置完成后，应用卡片提供“开始录音”“我的录音”，右上角保留设置入口。
4. 开始并停止一次模拟录音，查看转写与会议纪要并行生成。
5. 在对话中逐项确认或跳过：创建项目、项目群聊、Task Hub 任务、核心指标、会前提醒与简报。

全部内容使用模拟数据，不会读取或上传真实录音。

## 目录

- `index.html`：静态入口
- `snack-entry-refactor-demo.js`：页面状态与交互
- `snack-entry-refactor-demo.css`：布局与视觉样式
- `assets/`、`vendor/`：本地静态资源

## 验证

```bash
node --check snack-entry-refactor-demo.js
```

视觉或交互改动还需要通过本地 HTTP 服务逐状态验收。

## 多人协作

从 `main` 创建主题分支，只暂存本次修改的明确文件，验证后通过 Pull Request 合并。
