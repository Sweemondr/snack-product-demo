"use client";

import { useMemo, useState } from "react";

export type ProductView =
  | "home"
  | "taskhub"
  | "todos"
  | "project"
  | "task-detail"
  | "employees"
  | "skills"
  | "tasks"
  | "wiki"
  | "apps"
  | "record-library"
  | "record-settings"
  | "record-summary";

type Navigate = (view: ProductView | "record") => void;
type IconName =
  | "plus" | "chat" | "task" | "bot" | "clock" | "apps" | "book" | "search"
  | "folder" | "chevron" | "mic" | "sparkle" | "check" | "arrow" | "users"
  | "target" | "calendar" | "more" | "settings" | "filter" | "board" | "list"
  | "send" | "paperclip" | "globe" | "code" | "chart" | "file" | "trash"
  | "upload" | "music" | "back" | "refresh" | "download" | "bell" | "link";

function SIcon({ name, size = 18, width = 1.8 }: { name: IconName; size?: number; width?: number }) {
  const shapes: Record<IconName, React.ReactNode> = {
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chat: <><path d="M4 5.5h16v11H9l-5 3v-14Z" /></>,
    task: <><path d="M6 4h12v16H6z" /><path d="m9 10 1.5 1.5L14 8M9 15h6" /></>,
    bot: <><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    apps: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    book: <><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" /><path d="M8 8h7M8 12h7" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    folder: <><path d="M3.5 6.5h6l2-2H20a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8A1.5 1.5 0 0 1 4 6.5Z" /></>,
    chevron: <><path d="m9 7 5 5-5 5" /></>,
    mic: <><rect x="8" y="3" width="8" height="13" rx="4" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>,
    sparkle: <><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    check: <><path d="m5 12 4 4 10-10" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    users: <><path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M17 11a4 4 0 0 1 4 4v2" /></>,
    target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 15.4 21 17l-4 4-1.6-2a8 8 0 0 1-3.4.8L11 22H6l-.4-2.7a8 8 0 0 1-2.2-2.1L1 17l1.2-4A8 8 0 0 1 2 10L1 7l4-4 2.8 1A8 8 0 0 1 11 3l1-2h5l.4 2.6A8 8 0 0 1 20 6l3 1v5l-2.5 1a8 8 0 0 1-1.5 2.4Z" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    board: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="5" cy="6" r="1" /><circle cx="5" cy="12" r="1" /><circle cx="5" cy="18" r="1" /></>,
    send: <><path d="m3 11 18-8-8 18-2-8-8-2Z" /><path d="m11 13 10-10" /></>,
    paperclip: <><path d="m8 12 6.5-6.5a3 3 0 0 1 4.2 4.2L10 18.5a5 5 0 0 1-7-7L12 2.5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    code: <><path d="m9 7-5 5 5 5M15 7l5 5-5 5" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20V7" /></>,
    file: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h4M9 13h6M9 17h6" /></>,
    trash: <><path d="M4 7h16M9 3h6l1 4H8l1-4ZM7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></>,
    music: <><path d="M9 18V5l10-2v13M9 9l10-2" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    back: <><path d="M19 12H5M10 7l-5 5 5 5" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 8a7 7 0 0 1 11.4-2.2L20 8M4 16l2.5 2.2A7 7 0 0 0 18 16" /></>,
    download: <><path d="M12 4v12M7 11l5 5 5-5M5 20h14" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{shapes[name]}</svg>;
}

const nav: Array<[IconName, string, ProductView]> = [
  ["task", "任务工作台", "taskhub"],
  ["bot", "智能体员工", "employees"],
  ["clock", "定时任务", "tasks"],
  ["book", "知识库", "wiki"],
  ["apps", "应用", "apps"],
];

const labels: Record<ProductView, string> = {
  home: "新会话", taskhub: "任务工作台", todos: "我的待办", project: "项目看板",
  "task-detail": "任务详情", employees: "智能体员工", skills: "技能与工具", tasks: "定时任务",
  wiki: "知识库", apps: "应用", "record-library": "我的录音", "record-settings": "Snack Record 设置",
  "record-summary": "生成会议纪要",
};

function Avatar({ text, color = "#fe720a", small = false }: { text: string; color?: string; small?: boolean }) {
  return <span className={`pd-avatar ${small ? "small" : ""}`} style={{ backgroundColor: color }}>{text}</span>;
}

function ProductSidebar({ view, go }: { view: ProductView; go: Navigate }) {
  const active = view === "todos" || view === "project" || view === "task-detail" ? "taskhub" : view === "skills" ? "employees" : view;
  return <aside className="pd-sidebar">
    <button className="pd-logo" onClick={() => go("home")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/snack-logo.png" alt="Snack" />
    </button>
    <button className="pd-new" onClick={() => go("home")}><SIcon name="plus" size={19} />新会话</button>
    <button className="pd-group"><SIcon name="users" size={17} />发起群聊 <em>实验中</em></button>
    <div className="pd-divider" />
    <nav className="pd-nav">
      {nav.map(([icon, title, target]) => <button key={target} className={active === target ? "active" : ""} onClick={() => go(target)}><SIcon name={icon} />{title}</button>)}
    </nav>
    <div className="pd-divider" />
    <label className="pd-search"><SIcon name="search" size={16} /><input aria-label="搜索会话" placeholder="搜索会话..." /></label>
    <div className="pd-side-title">项目</div>
    <button className={`pd-project ${view === "project" || view === "task-detail" ? "active" : ""}`} onClick={() => go("project")}><SIcon name="folder" /><span>AI 营销增长系统</span><SIcon name="chevron" size={14} /></button>
    <button className="pd-tree-child" onClick={() => go("project")}>项目看板</button>
    <button className="pd-tree-child"><span>项目群聊</span><span className="pd-stacked"><Avatar small text="高" /><Avatar small text="陆" color="#5b8def" /></span></button>
    <button className="pd-tree-child" onClick={() => go("todos")}>目标与执行</button>
    <button className="pd-project"><SIcon name="folder" /><span>东南亚渠道拓展</span><SIcon name="chevron" size={14} /></button>
    <div className="pd-side-title pd-conversations">对话</div>
    <button className="pd-plain">落地页转化率复盘</button>
    <button className="pd-plain">产品周报自动生成</button>
    <div className="pd-account"><Avatar text="高" /><span><b>高翔</b><small>在线</small></span><SIcon name="settings" size={17} /></div>
  </aside>;
}

function ProductTopbar({ view }: { view: ProductView }) {
  return <header className="pd-topbar"><div className="pd-crumb"><span>Snack</span><SIcon name="chevron" size={13} /><b>{labels[view]}</b></div><div className="pd-top-actions"><button><SIcon name="search" /></button><button><SIcon name="bell" /></button><Avatar text="高" /></div></header>;
}

export function ProductPages({ view, go }: { view: ProductView; go: Navigate }) {
  return <main className="pd-shell"><ProductSidebar view={view} go={go} /><section className="pd-main"><ProductTopbar view={view} /><div className={`pd-page pd-view-${view}`}>{renderView(view, go)}</div></section></main>;
}

function renderView(view: ProductView, go: Navigate) {
  if (view === "home") return <HomeView go={go} />;
  if (view === "taskhub") return <TaskHubView go={go} />;
  if (view === "todos") return <TodosView go={go} />;
  if (view === "project") return <ProjectView go={go} />;
  if (view === "task-detail") return <TaskDetailView go={go} />;
  if (view === "employees") return <EmployeesView go={go} />;
  if (view === "skills") return <SkillsView />;
  if (view === "tasks") return <ScheduledTasksView />;
  if (view === "wiki") return <WikiView />;
  if (view === "apps") return <AppsView go={go} />;
  if (view === "record-library") return <RecordLibrary go={go} />;
  if (view === "record-settings") return <RecordSettings go={go} />;
  return <RecordSummary go={go} />;
}

function PageHeading({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return <div className="pd-heading"><div>{eyebrow && <span className="pd-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="pd-heading-actions">{actions}</div>}</div>;
}

function HomeView({ go }: { go: Navigate }) {
  const [message, setMessage] = useState("");
  return <div className="pd-home-wrap">
    <div className="pd-home-orb">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/snack-logo.png" alt="" />
    </div>
    <h1>和 Snack 一起开始工作</h1><p>提问、创建任务，或者把正在发生的工作交给我。</p>
    <div className="pd-composer"><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="给 Snack 发消息..." /><div><span><button><SIcon name="plus" /></button><button><SIcon name="globe" size={17} />所有来源</button></span><button className="pd-send" onClick={() => setMessage("")}><SIcon name="send" size={17} /></button></div></div>
    <div className="pd-home-actions">
      <button onClick={() => go("record")}><span className="orange"><SIcon name="mic" /></span><b>记录一场会议</b><small>录音、转写并创建跟踪项目</small></button>
      <button onClick={() => go("taskhub")}><span className="blue"><SIcon name="board" /></span><b>查看任务进展</b><small>进入任务工作台看板</small></button>
      <button onClick={() => go("employees")}><span className="green"><SIcon name="bot" /></span><b>找智能体员工协作</b><small>把重复工作交给 AI 员工</small></button>
    </div>
    <div className="pd-recents"><div><b>最近对话</b><button>查看全部</button></div>{["新用户激活路径复盘", "产品周报自动生成", "东南亚市场竞品整理"].map((x, i) => <button key={x}><span className={`pd-recent-icon c${i}`}><SIcon name={i === 1 ? "chart" : i === 2 ? "globe" : "chat"} /></span><span><b>{x}</b><small>{["今天 16:34", "昨天 18:12", "7 月 30 日"][i]}</small></span><SIcon name="chevron" size={14} /></button>)}</div>
  </div>;
}

const columnData = [
  { title: "待开始", count: 4, color: "#94a3b8", cards: [["明确新版 onboarding 信息架构", "AI 营销增长系统", "8 月 4 日", "陆"], ["整理东南亚竞品定价", "东南亚渠道拓展", "8 月 6 日", "周"], ["补齐品牌素材授权清单", "官网增长", "8 月 8 日", "林"]] },
  { title: "进行中", count: 3, color: "#5b8def", cards: [["完成 onboarding 引导稿", "AI 营销增长系统", "8 月 5 日", "陆"], ["补齐激活率口径与历史基线", "AI 营销增长系统", "8 月 6 日", "林"], ["搭建投放素材自动归档", "官网增长", "8 月 7 日", "高"]] },
  { title: "待验收", count: 2, color: "#a46be8", cards: [["确认首轮实验分流策略", "AI 营销增长系统", "今天", "高"], ["生成渠道招募落地页", "东南亚渠道拓展", "8 月 4 日", "周"]] },
  { title: "已完成", count: 12, color: "#20af75", cards: [["确定首日完成率目标", "AI 营销增长系统", "已完成", "高"], ["归档产品周会会议纪要", "AI 营销增长系统", "已完成", "林"], ["同步第二季度客户反馈", "客户成功", "已完成", "陆"]] },
];

function ViewTabs({ active, go }: { active: "board" | "todos"; go: Navigate }) {
  return <div className="pd-view-tabs"><button className={active === "board" ? "active" : ""} onClick={() => go("taskhub")}><SIcon name="board" size={16} />状态看板</button><button className={active === "todos" ? "active" : ""} onClick={() => go("todos")}><SIcon name="list" size={16} />我的待办 <em>5</em></button></div>;
}

function TaskHubView({ go }: { go: Navigate }) {
  const [modal, setModal] = useState(false);
  return <div className="pd-taskhub-wrap"><PageHeading eyebrow="TASK HUB" title="任务工作台" description="跨项目查看进展，把需要你关注的工作放在同一个视图。" actions={<><button className="pd-outline"><SIcon name="filter" size={16} />筛选</button><button className="pd-primary" onClick={() => setModal(true)}><SIcon name="plus" size={16} />新建项目</button></>} />
    <div className="pd-toolbar"><ViewTabs active="board" go={go} /><div className="pd-board-meta"><span>21 项任务</span><span>最后更新：刚刚</span></div></div>
    <div className="pd-kanban wide">{columnData.map((column) => <section key={column.title}><header><span style={{ background: column.color }} /><b>{column.title}</b><em>{column.count}</em><button><SIcon name="more" size={16} /></button></header><div className="pd-kanban-list">{column.cards.map(([title, project, date, who], index) => <button className="pd-task-card" key={title} onClick={() => go("task-detail")}><div className="pd-card-label"><span className={index === 0 && column.title !== "已完成" ? "priority" : ""}>{index === 0 && column.title !== "已完成" ? "高优先级" : "任务"}</span><SIcon name="more" size={14} /></div><h3>{title}</h3><p><SIcon name="folder" size={13} />{project}</p><footer><span className={date === "今天" ? "due" : ""}><SIcon name="calendar" size={13} />{date}</span><Avatar small text={who} color={who === "陆" ? "#5b8def" : who === "林" ? "#18a87b" : "#fe720a"} /></footer></button>)}</div><button className="pd-add-task"><SIcon name="plus" size={15} />添加任务</button></section>)}</div>
    {modal && <ProjectModal close={() => setModal(false)} go={go} />}
  </div>;
}

function ProjectModal({ close, go }: { close: () => void; go: Navigate }) {
  return <div className="pd-modal-layer" onMouseDown={close}><div className="pd-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><span><SIcon name="folder" /></span><div><h2>新建项目</h2><p>建立项目上下文、成员与任务看板</p></div></div><button onClick={close}>×</button></header><div className="pd-modal-body"><label>项目名称<input defaultValue="AI 营销增长系统" /></label><label>项目目标<textarea defaultValue="提升新用户激活与留存，通过持续实验把首日完成率提升至 65%。" /></label><div className="pd-modal-row"><label>项目负责人<div className="pd-picker"><Avatar small text="高" />高翔<SIcon name="chevron" size={13} /></div></label><label>项目周期<input defaultValue="2026.08.01 — 2026.09.30" /></label></div><label>协作说明<textarea placeholder="说明团队如何推进和同步这个项目..." /></label></div><footer><button className="pd-outline" onClick={close}>取消</button><button className="pd-primary" onClick={() => go("project")}>创建项目</button></footer></div></div>;
}

function ProjectView({ go }: { go: Navigate }) {
  const projectColumns = columnData.slice(0, 4).map((item, index) => ({ ...item, cards: item.cards.filter((card) => card[1] === "AI 营销增长系统").concat(index === 0 ? [["设置下次会前自动简报", "AI 营销增长系统", "8 月 7 日", "高"]] : []) }));
  return <div className="pd-project-page"><div className="pd-project-hero"><div className="pd-project-mark"><SIcon name="chart" size={25} /></div><div><div className="pd-project-breadcrumb"><button onClick={() => go("taskhub")}>任务工作台</button><SIcon name="chevron" size={13} /><span>AI 营销增长系统</span></div><h1>AI 营销增长系统</h1><p>提升新用户激活与留存，通过持续实验把首日完成率提升至 65%。</p></div><div className="pd-project-actions"><span className="pd-stacked big"><Avatar small text="高" /><Avatar small text="陆" color="#5b8def" /><Avatar small text="林" color="#18a87b" /><Avatar small text="周" color="#a46be8" /></span><button className="pd-outline"><SIcon name="users" size={16} />项目成员</button><button className="pd-outline"><SIcon name="settings" size={16} />项目设置</button></div></div>
    <div className="pd-project-info"><div><span><SIcon name="target" /></span><p><small>核心目标</small><b>首日关键路径完成率</b></p><strong>65%</strong></div><div><span><SIcon name="calendar" /></span><p><small>下次项目会议</small><b>产品周会 · 智能协作</b></p><strong>8 月 8 日</strong></div><div><span><SIcon name="sparkle" /></span><p><small>项目快照</small><b>7 个来源已同步</b></p><strong className="ok">刚刚更新</strong></div></div>
    <div className="pd-project-toolbar"><div><button className="active"><SIcon name="board" size={16} />项目看板</button><button><SIcon name="file" size={16} />协作说明</button><button><SIcon name="chart" size={16} />指标</button></div><button className="pd-primary"><SIcon name="plus" size={16} />创建任务</button></div>
    <div className="pd-kanban project">{projectColumns.map((column) => <section key={column.title}><header><span style={{ background: column.color }} /><b>{column.title}</b><em>{column.cards.length}</em><button><SIcon name="plus" size={15} /></button></header><div className="pd-kanban-list">{column.cards.map(([title, , date, who]) => <button className="pd-task-card" key={title} onClick={() => go("task-detail")}><div className="pd-card-label"><span>增长实验</span><SIcon name="more" size={14} /></div><h3>{title}</h3><p className="pd-progress-copy"><span>进度</span><b>{column.title === "已完成" ? "100%" : column.title === "进行中" ? "45%" : "0%"}</b></p><div className="pd-mini-progress"><i style={{ width: column.title === "已完成" ? "100%" : column.title === "进行中" ? "45%" : "0%" }} /></div><footer><span><SIcon name="calendar" size={13} />{date}</span><Avatar small text={who} /></footer></button>)}</div><button className="pd-add-task"><SIcon name="plus" size={15} />添加任务</button></section>)}</div>
  </div>;
}

function TodosView({ go }: { go: Navigate }) {
  const items = ["确认首轮实验分流策略", "完成 onboarding 引导稿", "补齐激活率口径与历史基线", "复盘实验转化和次日留存", "设置下次会前自动简报"];
  const [selected, setSelected] = useState(0);
  return <div className="pd-todos-wrap"><PageHeading eyebrow="TASK HUB" title="任务工作台" description="集中处理分配给我、等待我确认和即将到期的事项。" /><div className="pd-toolbar"><ViewTabs active="todos" go={go} /><button className="pd-outline"><SIcon name="filter" size={16} />筛选</button></div><div className="pd-todo-layout"><aside><header><b>我的待办</b><em>5</em></header><div className="pd-todo-filters"><button className="active">全部</button><button>今天</button><button>本周</button></div>{items.map((item, index) => <button className={`pd-todo-item ${selected === index ? "active" : ""}`} onClick={() => setSelected(index)} key={item}><span className={`pd-todo-check ${index === 0 ? "urgent" : ""}`} /><div><b>{item}</b><p>AI 营销增长系统</p><small>{index === 0 ? "今天到期" : `8 月 ${index + 4} 日`}</small></div><Avatar small text={index % 2 ? "陆" : "高"} color={index % 2 ? "#5b8def" : "#fe720a"} /></button>)}</aside><TaskDetailPanel title={items[selected]} go={go} compact /></div></div>;
}

function TaskDetailView({ go }: { go: Navigate }) { return <div className="pd-detail-page"><button className="pd-back" onClick={() => go("project")}><SIcon name="back" size={17} />返回项目看板</button><TaskDetailPanel title="完成 onboarding 引导稿" go={go} /></div>; }

function TaskDetailPanel({ title, compact = false }: { title: string; go: Navigate; compact?: boolean }) {
  const [tab, setTab] = useState<"progress" | "log">("progress");
  return <section className={`pd-task-detail-panel ${compact ? "compact" : ""}`}><main><div className="pd-detail-head"><div><span className="pd-status-pill">进行中</span><h1>{title}</h1><p><SIcon name="folder" size={14} />AI 营销增长系统 <span>·</span> 增长实验</p></div><button className="pd-outline"><SIcon name="more" /></button></div><div className="pd-detail-tabs"><button className={tab === "progress" ? "active" : ""} onClick={() => setTab("progress")}>任务进展</button><button className={tab === "log" ? "active" : ""} onClick={() => setTab("log")}>活动记录</button></div>{tab === "progress" ? <div className="pd-progress-feed"><article className="pd-ai-update"><span><SIcon name="sparkle" /></span><div><small>Snack 项目跟踪 · 今天 15:42</small><h3>当前进展摘要</h3><p>引导稿结构已经完成，正在补齐关键路径中的空状态与错误提示。按当前节奏可以在周三前进入评审。</p><div className="pd-update-metrics"><span><b>45%</b>当前进度</span><span><b>2</b>已完成节点</span><span><b>1</b>待确认风险</span></div></div></article>{["梳理首日关键路径与触达节点", "完成引导稿信息架构", "补齐空状态与错误提示", "发起产品与研发评审"].map((x, i) => <div className="pd-progress-node" key={x}><span className={i < 2 ? "done" : i === 2 ? "current" : ""}>{i < 2 ? <SIcon name="check" size={13} /> : i + 1}</span><div><b>{x}</b><p>{i < 2 ? "已完成" : i === 2 ? "正在进行 · 陆铭" : "计划 8 月 5 日"}</p>{i === 2 && <div className="pd-note">已覆盖登录后首页、关键动作引导与完成反馈，错误态文案待研发确认。</div>}</div></div>)}</div> : <div className="pd-log-list">{["陆铭将任务进度更新为 45%", "高翔补充了验收标准", "Snack 从产品周会中创建了该任务"].map((x, i) => <div key={x}><span><SIcon name={i === 2 ? "sparkle" : i === 1 ? "file" : "chart"} /></span><p><b>{x}</b><small>{["今天 15:42", "今天 11:20", "8 月 1 日 16:34"][i]}</small></p></div>)}</div>}</main><aside><div className="pd-attr-head"><b>任务属性</b><button><SIcon name="settings" size={15} /></button></div><dl><div><dt>状态</dt><dd><span className="blue-dot" />进行中</dd></div><div><dt>负责人</dt><dd><Avatar small text="陆" color="#5b8def" />陆铭</dd></div><div><dt>优先级</dt><dd><span className="priority-dot" />高</dd></div><div><dt>截止时间</dt><dd>2026 年 8 月 5 日</dd></div><div><dt>目标进度</dt><dd>45%</dd></div></dl><div className="pd-attr-section"><b>验收标准</b><p>覆盖完整新用户路径；关键引导文案通过产品评审；包含空状态与失败状态。</p></div><div className="pd-attr-section"><b>关联资料</b><button className="pd-file-link"><span>F</span><p>Onboarding 流程稿.fig<small>Figma · 刚刚同步</small></p></button><button className="pd-file-link"><span className="wiki">W</span><p>增长实验 Wiki<small>云端知识库</small></p></button></div><button className="pd-comment"><SIcon name="chat" size={16} />添加进展或评论</button></aside></section>;
}

const employees = [
  { name: "运营周报助手", role: "内容运营员工", icon: "周", color: "#5b8def", desc: "汇总多平台数据和项目进度，每周自动生成可直接发送的运营周报。", skills: ["周报生成", "数据汇总", "飞书文档"], state: "使用中" },
  { name: "市场研究员", role: "行业研究员工", icon: "研", color: "#a46be8", desc: "持续跟踪竞品、行业信息和关键公司动态，输出结构化研究结论。", skills: ["网页研究", "竞品分析", "报告生成"], state: "添加员工" },
  { name: "招聘协调员", role: "人力资源员工", icon: "招", color: "#18a87b", desc: "整理候选人信息、推进面试安排，并在关键节点提醒相关负责人。", skills: ["简历筛选", "日程协调", "候选人跟进"], state: "添加员工" },
];

function EmployeesView({ go }: { go: Navigate }) {
  return <div className="pd-employees-wrap"><div className="pd-product-tabs"><button className="active">员工广场</button><button onClick={() => go("skills")}>技能与工具</button></div><PageHeading title="智能体员工" description="选择适合团队的 AI 员工，让重复工作持续自动完成。" actions={<button className="pd-primary"><SIcon name="plus" size={16} />创建员工</button>} /><div className="pd-employee-hero"><div><span className="pd-eyebrow light">AGENT EMPLOYEES</span><h2>组建你的 AI 工作团队</h2><p>员工会带着固定角色、技能和工作方式，持续参与真实业务流程。</p><button>查看使用指南<SIcon name="arrow" size={16} /></button></div><div className="pd-agent-orbit"><span className="core"><SIcon name="bot" size={29} /></span>{["研", "写", "数"].map((x, i) => <span className={`sat s${i}`} key={x}>{x}</span>)}</div></div><div className="pd-section-row"><div><h2>推荐员工</h2><p>根据团队常见工作场景精选</p></div><div className="pd-pill-filter"><button className="active">全部</button><button>运营</button><button>研究</button><button>协作</button></div></div><div className="pd-employee-grid">{employees.map((employee) => <article key={employee.name}><header><span className="pd-employee-icon" style={{ background: `${employee.color}18`, color: employee.color }}>{employee.icon}</span><button><SIcon name="more" /></button></header><span className="pd-role">{employee.role}</span><h3>{employee.name}</h3><p>{employee.desc}</p><div className="pd-tags">{employee.skills.map((s) => <span key={s}>{s}</span>)}</div><footer><div className="pd-agent-users"><span className="pd-stacked"><Avatar small text="高" /><Avatar small text="陆" color="#5b8def" /></span><small>团队已有 2 人使用</small></div><button className={employee.state === "使用中" ? "using" : ""}>{employee.state === "使用中" && <SIcon name="check" size={14} />}{employee.state}</button></footer></article>)}</div></div>;
}

const skillCards = [
  ["会议纪要", "自动整理讨论结论、决策、行动项与待跟踪风险。", "会", "#fe720a", "团队常用"],
  ["深度研究", "通过多来源检索、交叉验证并生成结构化研究报告。", "研", "#5b8def", "我的技能"],
  ["周报生成", "汇总一周任务、文档和会议信息，生成团队周报。", "周", "#a46be8", "我的技能"],
  ["数据分析", "读取表格数据，完成清洗、分析并输出可视化结论。", "数", "#18a87b", "团队技能"],
  ["网页制作", "把需求快速整理成可预览、可协作的网页原型。", "网", "#e75b72", "团队技能"],
  ["项目简报", "基于项目快照生成会前简报与管理层摘要。", "项", "#0ea5a8", "我的技能"],
];

function SkillsView() {
  const [tab, setTab] = useState("我的技能");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => skillCards.filter((x) => (!query || x[0].includes(query)) && (tab === "工具" || tab === "我的技能" ? true : x[4] === "团队技能")), [query, tab]);
  return <div className="pd-skills-wrap"><div className="pd-product-tabs"><button>员工广场</button><button className="active">技能与工具</button></div><PageHeading title="技能与工具" description="管理智能体员工和会话可以调用的能力。" actions={<button className="pd-primary"><SIcon name="plus" size={16} />创建技能</button>} /><div className="pd-skill-toolbar"><div className="pd-skill-tabs">{["我的技能", "团队技能", "工具"].map((x) => <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>{x}{x !== "工具" && <em>{x === "我的技能" ? 5 : 3}</em>}</button>)}</div><div><label><SIcon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索技能" /></label><button className="pd-outline"><SIcon name="filter" size={15} />筛选</button></div></div>{tab === "工具" ? <ToolsGrid /> : <div className="pd-skill-grid">{filtered.map(([name, desc, icon, color, scope]) => <article key={name}><header><span style={{ background: `${color}16`, color }}>{icon}</span><button><SIcon name="more" /></button></header><h3>{name}</h3><p>{desc}</p><div className="pd-tags"><span>{scope}</span><span>v1.2</span></div><footer><span><SIcon name="bot" size={14} />3 个员工使用</span><button>打开<SIcon name="chevron" size={13} /></button></footer></article>)}</div>}</div>;
}

function ToolsGrid() { return <div className="pd-tool-grid">{[["网页浏览器", "检索网页、提取内容和完成浏览器操作", "globe", "#5b8def"], ["代码执行器", "运行代码、处理文件并验证计算结果", "code", "#0ea5a8"], ["飞书文档", "读取、创建和更新团队云文档", "file", "#fe720a"], ["数据表格", "分析 Excel 与在线表格数据", "chart", "#18a87b"]].map(([name, desc, icon, color]) => <article key={name}><span style={{ background: `${color}16`, color }}><SIcon name={icon as IconName} /></span><div><h3>{name}</h3><p>{desc}</p><small><i />已连接</small></div><button className="pd-outline">设置</button></article>)}</div>; }

function ScheduledTasksView() {
  const [enabled, setEnabled] = useState([true, true, false, true]);
  const rows = [["每周项目进展简报", "每周五 17:30", "运营周报助手", "12 次", "明天 17:30"], ["竞品动态扫描", "每天 09:30", "市场研究员", "37 次", "明天 09:30"], ["月度数据复盘", "每月 1 日 10:00", "数据分析助手", "6 次", "9 月 1 日"], ["会前项目简报", "会议前 1 天", "Snack 项目跟踪", "4 次", "8 月 7 日 16:00"]];
  return <div className="pd-scheduled-wrap"><PageHeading title="定时任务" description="让 Snack 在固定时间自动执行工作，并把结果送到指定位置。" actions={<button className="pd-primary"><SIcon name="plus" size={16} />创建定时任务</button>} /><div className="pd-summary-cards"><div><span className="orange"><SIcon name="clock" /></span><p><small>运行中的任务</small><b>3</b></p></div><div><span className="green"><SIcon name="check" /></span><p><small>本月成功执行</small><b>56</b></p></div><div><span className="blue"><SIcon name="calendar" /></span><p><small>未来 7 天待执行</small><b>18</b></p></div></div><div className="pd-table-card"><header><div className="pd-inline-search"><SIcon name="search" size={16} /><input placeholder="搜索定时任务" /></div><button className="pd-outline"><SIcon name="filter" size={16} />筛选</button></header><div className="pd-table-head"><span>任务</span><span>执行计划</span><span>执行者</span><span>执行记录</span><span>下次执行</span><span>状态</span><span /></div>{rows.map((row, i) => <div className="pd-table-row" key={row[0]}><div><span className={`pd-row-icon r${i}`}><SIcon name={i === 1 ? "globe" : i === 2 ? "chart" : i === 3 ? "calendar" : "file"} /></span><p><b>{row[0]}</b><small>{i === 0 ? "同步到项目群聊" : i === 1 ? "生成研究报告" : "自动生成并提醒"}</small></p></div><span>{row[1]}</span><span><SIcon name="bot" size={15} />{row[2]}</span><span>{row[3]}</span><span>{row[4]}</span><button className={`pd-toggle ${enabled[i] ? "on" : ""}`} onClick={() => setEnabled((old) => old.map((x, j) => j === i ? !x : x))}><i /></button><button><SIcon name="more" /></button></div>)}</div></div>;
}

function WikiView() {
  const [tab, setTab] = useState("全部");
  const docs = [["AI 营销增长系统", "项目知识库", "12 篇文档", "刚刚更新", "项", "#fe720a"], ["产品与设计", "团队知识库", "34 篇文档", "今天 14:20", "产", "#5b8def"], ["市场研究资料", "团队知识库", "18 篇文档", "昨天 18:05", "研", "#a46be8"], ["公司制度与流程", "公司知识库", "26 篇文档", "7 月 30 日", "制", "#18a87b"]];
  return <div className="pd-wiki-wrap"><PageHeading title="知识库" description="统一管理 Snack 与智能体员工可以使用的团队知识。" actions={<><button className="pd-outline"><SIcon name="link" size={16} />连接知识源</button><button className="pd-primary"><SIcon name="plus" size={16} />新建知识库</button></>} /><div className="pd-wiki-hero"><div><span><SIcon name="sparkle" /></span><div><h2>让团队知识持续参与工作</h2><p>连接云端 Wiki、本地文件夹和项目资料，Snack 会自动生成可追溯的知识快照。</p></div></div><button>了解知识同步<SIcon name="arrow" size={16} /></button></div><div className="pd-wiki-toolbar"><div>{["全部", "项目", "团队", "公司"].map((x) => <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>{x}</button>)}</div><label><SIcon name="search" size={16} /><input placeholder="搜索知识库" /></label></div><div className="pd-wiki-grid">{docs.filter((d) => tab === "全部" || d[1].startsWith(tab)).map(([name, type, count, time, icon, color]) => <article key={name}><header><span style={{ background: `${color}18`, color }}>{icon}</span><button><SIcon name="more" /></button></header><h3>{name}</h3><p>{type}</p><div className="pd-wiki-stats"><span><SIcon name="file" size={14} />{count}</span><span><i />同步正常</span></div><footer><span>更新于 {time}</span><button>打开<SIcon name="chevron" size={13} /></button></footer></article>)}</div></div>;
}

function AppsView({ go }: { go: Navigate }) {
  return <div className="pd-apps-wrap"><PageHeading title="应用" description="连接工具，把 Snack 的工作能力扩展到更多真实场景。" /><div className="pd-app-feature"><div className="pd-record-brand"><span><SIcon name="mic" size={28} /></span><div><em>SNACK 原生应用</em><h2>Snack Record</h2><p>本地会议录音与转写。录音结束后生成会议纪要，并继续创建项目、任务与会前简报。</p><div className="pd-tags"><span>本地录音</span><span>离线转写</span><span>会议纪要</span></div></div></div><div className="pd-record-actions"><button className="pd-record-start" onClick={() => go("record")}><SIcon name="mic" size={18} />开始录音</button><button className="pd-outline" onClick={() => go("record-library")}>我的录音</button><button className="pd-icon-btn" aria-label="Snack Record 设置" onClick={() => go("record-settings")}><SIcon name="settings" /></button></div></div><div className="pd-section-row"><div><h2>已连接应用</h2><p>在会话和智能体工作中直接使用</p></div><button className="pd-outline"><SIcon name="plus" size={16} />添加应用</button></div><div className="pd-app-grid">{[["飞书", "连接文档、日历、任务和团队消息", "飞", "#3370ff", "已连接"], ["Figma", "读取设计稿并参与产品设计协作", "F", "#a259ff", "已连接"], ["GitHub", "查看代码、Issue、PR 和构建状态", "G", "#0f172a", "连接"], ["语雀", "读取团队知识库与项目文档", "语", "#00b96b", "连接"]].map(([name, desc, icon, color, state]) => <article key={name}><header><span style={{ background: `${color}14`, color }}>{icon}</span><em className={state === "已连接" ? "connected" : ""}>{state === "已连接" && <i />}{state}</em></header><h3>{name}</h3><p>{desc}</p><footer><span>团队可用</span><button><SIcon name="settings" size={16} />设置</button></footer></article>)}</div></div>;
}

const recordings = [
  { name: "产品周会 · 智能协作", meta: "今天 16:02 · 32:18 · 48.2 MB", state: "转写完成", tone: "done" },
  { name: "东南亚渠道合作沟通", meta: "7 月 31 日 14:30 · 46:09 · 68.7 MB", state: "转写完成", tone: "done" },
  { name: "新官网增长方案评审", meta: "7 月 30 日 10:12 · 28:42 · 41.3 MB", state: "转写中 68%", tone: "working" },
  { name: "临时录音 2026-07-29", meta: "7 月 29 日 19:06 · 12:15 · 18.5 MB", state: "待转写", tone: "pending" },
];

function RecordHeader({ title, desc, back }: { title: string; desc: string; back: () => void }) { return <div className="pd-record-header"><button onClick={back}><SIcon name="back" /></button><div><h1>{title}</h1><p>{desc}</p></div></div>; }

function RecordLibrary({ go }: { go: Navigate }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const rows = recordings.filter((r) => r.name.includes(query));
  return <div className="pd-record-page"><RecordHeader title="我的录音" desc="管理本地录音、转写文件和会议纪要" back={() => go("apps")} /><div className="pd-record-content"><div className="pd-record-toolbar"><label><SIcon name="search" size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索录音和转写" /></label><button className="pd-primary"><SIcon name="upload" size={16} />导入音频</button></div><div className="pd-record-list"><header><label><input type="checkbox" checked={selected.length === rows.length && rows.length > 0} onChange={(e) => setSelected(e.target.checked ? rows.map((_, i) => i) : [])} /><span /></label><b>转写列表</b><em>{rows.length}</em><button disabled={!selected.length}><SIcon name="trash" size={15} />删除已选 {selected.length ? `(${selected.length})` : ""}</button></header>{rows.map((recording, index) => <article key={recording.name} className={selected.includes(index) ? "selected" : ""}><label><input type="checkbox" checked={selected.includes(index)} onChange={(e) => setSelected((old) => e.target.checked ? [...old, index] : old.filter((x) => x !== index))} /><span /></label><span className="pd-audio-file"><SIcon name="file" /></span><div className="pd-record-copy"><h3>{recording.name}</h3><p>{recording.meta}</p>{recording.tone === "working" && <div className="pd-transcribe-progress"><i style={{ width: "68%" }} /></div>}</div><span className={`pd-record-state ${recording.tone}`}>{recording.state}</span><div className="pd-record-row-actions"><button title="打开转写"><SIcon name="file" size={16} /></button><button title="打开音频"><SIcon name="music" size={16} /></button><button title="生成会议纪要" disabled={recording.tone !== "done"} onClick={() => go("record-summary")}><SIcon name="sparkle" size={16} /></button><button title="删除"><SIcon name="trash" size={16} /></button></div></article>)}</div></div></div>;
}

function RecordSettings({ go }: { go: Navigate }) {
  const [fast, setFast] = useState(true), [reminder, setReminder] = useState(true), [organize, setOrganize] = useState(true), [saved, setSaved] = useState(false);
  return <div className="pd-record-page settings"><RecordHeader title="Snack Record 设置" desc="配置本地录音、转写和文件保存方式" back={() => go("apps")} /><div className="pd-settings-content"><section className="pd-settings-card"><header><h2>默认配置</h2><p>以下设置会应用到新的录音任务</p></header><div className="pd-setting-row"><div><b>界面语言</b><p>设置 Snack Record 的默认界面语言</p></div><select><option>简体中文</option><option>English</option></select></div><div className="pd-setting-row"><div><b>转写模式</b><p>快速模式更省资源，标准模式准确率更高</p></div><div className="pd-segment"><button className={fast ? "active" : ""} onClick={() => setFast(true)}>快速</button><button className={!fast ? "active" : ""} onClick={() => setFast(false)}>标准</button></div></div><SettingToggle title="自动会议提醒" desc="检测到会议应用时提醒开始录音" checked={reminder} set={setReminder} /><div className="pd-setting-row"><div><b>录音快捷键</b><p>在任意界面快速开始或结束录音</p></div><kbd>⌃ R</kbd></div><div className="pd-setting-row"><div><b>输出目录</b><p>录音和转写文件将保存在本地</p></div><div className="pd-directory">~/Documents/Snack Record <button><SIcon name="folder" size={15} />选择</button></div></div><SettingToggle title="按日期整理文件" desc="自动创建年月文件夹保存录音" checked={organize} set={setOrganize} /><footer><button className="pd-outline"><SIcon name="refresh" size={16} />恢复默认</button><button className="pd-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1600); }}>{saved ? <><SIcon name="check" size={16} />已保存</> : "保存配置"}</button></footer></section><section className="pd-resource-card"><span><SIcon name="download" /></span><div><h2>本地转写资源包</h2><p>Whisper Standard · 1.42 GB · 资源完整</p></div><em><SIcon name="check" size={15} />可用</em><button className="pd-outline">检查完整性</button></section></div></div>;
}

function SettingToggle({ title, desc, checked, set }: { title: string; desc: string; checked: boolean; set: (value: boolean) => void }) { return <div className="pd-setting-row"><div><b>{title}</b><p>{desc}</p></div><span className="pd-toggle-copy">{checked ? "已开启" : "已关闭"}</span><button className={`pd-toggle ${checked ? "on" : ""}`} onClick={() => set(!checked)}><i /></button></div>; }

function RecordSummary({ go }: { go: Navigate }) {
  const [status, setStatus] = useState<"ready" | "generating" | "complete">("ready");
  const generate = () => { setStatus("generating"); setTimeout(() => setStatus("complete"), 1200); };
  return <div className="pd-record-page summary"><RecordHeader title="生成会议纪要" desc="基于本地转写内容创建会议纪要会话" back={() => go("record-library")} /><div className="pd-summary-content"><div className="pd-summary-context"><article><span><SIcon name="file" /></span><div><small>本地转写文件</small><h3>产品周会 · 智能协作.txt</h3><p>来源为当前录音的本地转写内容</p></div></article><article><span><SIcon name="sparkle" /></span><div><small>会议纪要 Skill</small><h3>{status === "complete" ? "会话已创建" : status === "generating" ? "正在启动" : "可以开始生成"}<em className={status}>{status === "complete" ? "已启动" : status === "generating" ? "启动中" : "已就绪"}</em></h3><p>{status === "complete" ? "下方区域呈现会议纪要结果" : "启动 Skill 并创建真实会议纪要会话"}</p></div></article></div><article className="pd-generate-card"><div><h2>将转写内容交给会议纪要 Skill</h2><p>{status === "complete" ? "会议纪要会话已创建" : status === "generating" ? "正在创建会话，请稍候" : "生成后将在下方呈现会议纪要内容"}</p></div><button className="pd-primary" disabled={status !== "ready"} onClick={generate}><SIcon name={status === "complete" ? "check" : status === "generating" ? "refresh" : "sparkle"} size={16} />{status === "complete" ? "已创建" : status === "generating" ? "正在生成" : "生成会议纪要"}</button></article>{status !== "ready" && <article className="pd-generated-summary">{status === "generating" ? <div className="pd-generating"><span /><b>正在读取转写并生成会议纪要…</b></div> : <><header><div><span><SIcon name="sparkle" /></span><div><small>Snack · 会议纪要</small><h2>产品周会 · 智能协作</h2></div></div><em><SIcon name="check" size={14} />已完成</em></header><div className="pd-summary-sections"><section><h3>会议结论</h3><p>本周将新用户首日完成率作为核心目标，先以 20% 流量验证新版 onboarding 引导。</p></section><section><h3>行动项</h3>{["周三前完成 onboarding 引导稿", "补齐激活率数据口径与历史基线", "周五复盘实验转化和次日留存"].map((x, i) => <div className="pd-summary-task" key={x}><span>{i + 1}</span><b>{x}</b><em>{["陆铭", "林可", "高翔"][i]}</em></div>)}</section><footer><button className="pd-outline" onClick={() => go("record-library")}>返回录音库</button><button className="pd-primary" onClick={() => go("record")}>继续创建跟踪项目<SIcon name="arrow" size={16} /></button></footer></div></>}</article>}</div></div>;
}
