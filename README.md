# Snack 产品全景协作 Demo

这是一个独立于原 Demo 的 Snack 高保真交互原型，统一复刻当前用户侧产品页面，并补齐从会议录音、转写、纪要到项目持续跟踪的完整闭环。

## 页面清单

通过 `?view=` 切换页面，也可以直接使用左侧导航：

| 页面 | 地址参数 |
| --- | --- |
| 新会话首页 | `?view=home` |
| 任务工作台 | `?view=taskhub` |
| 我的待办 | `?view=todos` |
| 项目看板 | `?view=project` |
| 任务详情 | `?view=task-detail` |
| 智能体员工 | `?view=employees` |
| 技能与工具 | `?view=skills` |
| 定时任务 | `?view=tasks` |
| 知识库 | `?view=wiki` |
| 应用 | `?view=apps` |
| Snack Record 录音库 | `?view=record-library` |
| Snack Record 设置 | `?view=record-settings` |
| 生成会议纪要 | `?view=record-summary` |
| 录音到项目闭环 | `?view=record` |

录音闭环支持 `?view=record&step=1` 到 `step=6` 直接进入指定阶段。

## 本地运行

```bash
npm install
npm run dev
```

默认地址是 `http://localhost:3000`。

## 验证

```bash
npm run lint
npm run build
```

页面按照 1440 × 1024 桌面视口逐页验收，并检查运行时错误和横向溢出。

## 多人协作方式

建议每个人从 `main` 创建自己的功能分支，不直接覆盖别人的工作：

```bash
git fetch github
git switch -c feat/<your-topic> github/main
# 修改并验证
git add <明确的文件>
git commit -m "feat: describe the change"
git push -u github feat/<your-topic>
```

在 GitHub 发 Pull Request 合并；页面结构、视觉修正和交互逻辑尽量拆成独立 PR。合并前至少运行 `npm run lint && npm run build`。

## 设计与交互依据

- Figma：Snack 最新迭代中的首页、员工、技能、应用和 Task Hub Section 7/8。
- Web 录音交互：`h-snack-website` 的 `feat_snack_record` 分支。
- Desktop 边界：桌面端负责录音、转写和回传；Web 负责应用入口、录音库、设置与会议纪要会话。

当前 Figma 文件对连接账号是只读权限，因此本轮高保真页面已落到代码与云端，尚未反写 Figma 源文件。
