"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductPages, type ProductView } from "./product-pages";

type IconName =
  | "plus" | "chat" | "task" | "bot" | "clock" | "grid" | "book" | "search"
  | "folder" | "chevron" | "mic" | "cloud" | "file" | "sparkle" | "check"
  | "arrow" | "users" | "message" | "target" | "calendar" | "more" | "edit"
  | "link" | "shield" | "play" | "pause" | "brief" | "trend" | "settings";

function Icon({ name, size = 18, strokeWidth = 1.8 }: { name: IconName; size?: number; strokeWidth?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chat: <><path d="M4 5.5h16v11H9l-5 3v-14Z" /></>,
    task: <><path d="M7 4h10l3 3v13H4V4h3Z" /><path d="M8 11h8M8 15h6" /></>,
    bot: <><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    book: <><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" /><path d="M8 8h7M8 12h7" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    folder: <><path d="M3.5 6.5h6l2-2H20a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8A1.5 1.5 0 0 1 4 6.5Z" /></>,
    chevron: <><path d="m9 7 5 5-5 5" /></>,
    mic: <><rect x="8" y="3" width="8" height="13" rx="4" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>,
    cloud: <><path d="M7 18h11a4 4 0 0 0 .7-7.94A7 7 0 0 0 5.4 8.3 4.8 4.8 0 0 0 7 18Z" /><path d="m9 13 3-3 3 3M12 10v6" /></>,
    file: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h4M9 13h6M9 17h6" /></>,
    sparkle: <><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    check: <><path d="m5 12 4 4 10-10" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    users: <><path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M17 11a4 4 0 0 1 4 4v2" /></>,
    message: <><path d="M4 4h16v12H8l-4 4V4Z" /><path d="M8 9h8M8 12h5" /></>,
    target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    edit: <><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z" /><path d="m13.5 7 3.5 3.5" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" /></>,
    shield: <><path d="M12 3 20 6v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    play: <><path d="m8 5 11 7-11 7V5Z" /></>,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    brief: <><path d="M8 5V3h8v2M4 7h16v13H4V7Z" /><path d="M4 12h16M10 12v2h4v-2" /></>,
    trend: <><path d="m4 17 5-5 4 3 7-8" /><path d="M15 7h5v5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[name]}</svg>;
}

const steps = [
  { title: "选择录音", subtitle: "本地或云端", icon: "mic" as IconName },
  { title: "录音转译", subtitle: "实时生成纪要", icon: "sparkle" as IconName },
  { title: "确认跟踪", subtitle: "判断是否立项", icon: "check" as IconName },
  { title: "创建项目", subtitle: "上下文与成员", icon: "folder" as IconName },
  { title: "任务与指标", subtitle: "确认跟踪方式", icon: "target" as IconName },
  { title: "项目已就绪", subtitle: "下次会前简报", icon: "brief" as IconName },
];

const navItems = [
  ["task", "任务工作台"], ["bot", "智能体员工"], ["clock", "定时任务"], ["grid", "应用"], ["book", "知识库"],
] as const;

function Avatar({ label, color }: { label: string; color: string }) {
  return <span className="avatar" style={{ background: color }}>{label}</span>;
}

function Sidebar({ onNavigate }: { onNavigate: (view: ProductView | "record") => void }) {
  return <aside className="sidebar">
    <div className="brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/snack-logo.png" alt="Snack" />
    </div>
    <button className="new-chat" onClick={() => onNavigate("home")}><Icon name="plus" size={19} />新会话</button>
    <button className="group-beta"><Icon name="users" size={17} /><span>发起群聊</span><em>实验中</em></button>
    <div className="side-rule" />
    <nav className="main-nav">
      {navItems.map(([icon, label]) => <button key={label} onClick={() => onNavigate(({ "任务工作台": "taskhub", "智能体员工": "employees", "定时任务": "tasks", "应用": "apps", "知识库": "wiki" } as const)[label])}><Icon name={icon} size={18} />{label}</button>)}
    </nav>
    <div className="side-rule" />
    <div className="search-box"><Icon name="search" size={17} /><span>搜索会话...</span></div>
    <div className="side-label">项目</div>
    <div className="project-tree selected"><Icon name="folder" size={18} /><span>AI 营销增长系统</span><Icon name="chevron" size={15} /></div>
    <div className="tree-child active"><span>产品周会 · 智能协作</span><span className="live-dot" /></div>
    <div className="tree-child"><span>项目群聊</span><span className="mini-avatars"><Avatar label="高" color="#ff720a" /><Avatar label="陆" color="#ffc38d" /></span></div>
    <div className="tree-child">目标与执行</div>
    <div className="project-tree"><Icon name="folder" size={18} /><span>东南亚渠道拓展</span><Icon name="chevron" size={15} /></div>
    <div className="side-label conversation-label">对话</div>
    <div className="plain-chat">落地页转化率复盘</div>
    <div className="plain-chat">产品周报自动生成</div>
    <div className="account"><Avatar label="高" color="#ff7a16" /><span>高翔</span><Icon name="settings" size={17} /></div>
  </aside>;
}

function StepRail({ current, onChange }: { current: number; onChange: (v: number) => void }) {
  return <div className="step-rail">
    <div className="step-rail-title"><span>会议跟踪流程</span><em>自动保存</em></div>
    <div className="steps">
      {steps.map((s, i) => <button key={s.title} className={`step ${current === i ? "current" : ""} ${current > i ? "done" : ""}`} onClick={() => onChange(i)}>
        <span className="step-index">{current > i ? <Icon name="check" size={14} strokeWidth={2.5} /> : i + 1}</span>
        <span className="step-copy"><b>{s.title}</b><small>{s.subtitle}</small></span>
      </button>)}
    </div>
    <div className="privacy-note"><Icon name="shield" size={17} /><div><b>录音数据受保护</b><span>转写与分析仅对项目成员可见</span></div></div>
  </div>;
}

function Header({ current }: { current: number }) {
  return <header className="topbar">
    <div className="breadcrumb"><span>录音会议</span><Icon name="chevron" size={14} /><b>{steps[current].title}</b></div>
    <div className="header-actions">
      <button className="ghost-icon"><Icon name="more" size={19} /></button>
      <button className="avatar-button"><Avatar label="高" color="#ff720a" /></button>
    </div>
  </header>;
}

function SourceStep({ onNext }: { onNext: () => void }) {
  const [source, setSource] = useState<"local" | "cloud">("local");
  return <div className="stage source-stage">
    <div className="eyebrow"><span className="eyebrow-icon"><Icon name="mic" size={17} /></span>Snack Record</div>
    <h1>把会议记录下来，<br />后面的跟踪交给 Snack</h1>
    <p className="lead">选择录音来源。会议过程中会实时生成纪要，结束后再由你决定是否创建项目和跟踪任务。</p>
    <div className="source-grid">
      <button className={`source-card ${source === "local" ? "selected" : ""}`} onClick={() => setSource("local")}>
        <span className="source-icon local"><Icon name="mic" size={25} /></span>
        <span className="source-copy"><b>本地录音</b><small>使用当前设备麦克风</small></span>
        <span className="radio"><i /></span>
        <em>推荐</em>
      </button>
      <button className={`source-card ${source === "cloud" ? "selected" : ""}`} onClick={() => setSource("cloud")}>
        <span className="source-icon"><Icon name="cloud" size={26} /></span>
        <span className="source-copy"><b>上传云端录音</b><small>音频、视频或会议链接</small></span>
        <span className="radio"><i /></span>
      </button>
    </div>
    <div className="meeting-preset">
      <div className="preset-top"><div><Icon name="calendar" size={19} /><span><b>产品周会 · 智能协作</b><small>今天 16:00 · 6 位参与者</small></span></div><button><Icon name="edit" size={16} />编辑</button></div>
      <div className="preset-tags"><span>周期会议</span><span>已关联：AI 营销增长系统</span><span>自动识别行动项</span></div>
    </div>
    <button className="primary-cta" onClick={onNext}><span className="record-dot" />开始本地录音<Icon name="arrow" size={18} /></button>
    <p className="fine-print">开始后可随时暂停或结束，原始录音将作为会议证据保存</p>
  </div>;
}

const transcript = [
  { time: "16:21", who: "高翔", color: "#FF720A", text: "这周先把新用户的激活路径定下来，目标是把首日完成率提到 65%。" },
  { time: "16:22", who: "陆铭", color: "#5B8DEF", text: "我周三前会补一版 onboarding 引导，实验组先覆盖 20% 的新用户。" },
  { time: "16:24", who: "高翔", color: "#FF720A", text: "数据看板由小林跟进，周五复盘时一起看转化和留存。" },
  { time: "16:25", who: "林可", color: "#18A87B", text: "没问题，我会把口径和历史数据一起补到项目资料里。" },
];

function RecordingStep({ onNext }: { onNext: () => void }) {
  const [paused, setPaused] = useState(false);
  return <div className="stage recording-stage">
    <div className="record-head">
      <div><div className="live-pill"><span />正在录音</div><h1>产品周会 · 智能协作</h1><p>2026 年 8 月 1 日 · 6 位参与者</p></div>
      <div className="record-timer">32:18</div>
    </div>
    <div className="wave-panel">
      <div className={`wave ${paused ? "paused" : ""}`}>{Array.from({ length: 54 }, (_, i) => <i key={i} style={{ height: `${12 + ((i * 13) % 31)}px` }} />)}</div>
      <button className="pause-btn" onClick={() => setPaused(!paused)}><Icon name={paused ? "play" : "pause"} size={18} />{paused ? "继续录音" : "暂停"}</button>
    </div>
    <div className="record-columns">
      <section className="transcript-card">
        <div className="section-title"><div><span className="ai-glyph"><Icon name="sparkle" size={16} /></span><b>实时转写</b></div><span className="syncing"><i />同步中</span></div>
        <div className="transcript-list">{transcript.map((t, i) => <div className={`transcript-row ${i === transcript.length - 1 ? "latest" : ""}`} key={t.time}>
          <span className="transcript-time">{t.time}</span><Avatar label={t.who.slice(0, 1)} color={t.color} /><div><b>{t.who}</b><p>{t.text}</p></div>
        </div>)}</div>
      </section>
      <section className="minutes-card">
        <div className="section-title"><div><span className="ai-glyph"><Icon name="sparkle" size={16} /></span><b>会议纪要</b></div><span className="auto-label">AI 实时生成</span></div>
        <div className="summary-block"><small>本次讨论</small><b>新用户激活路径与首日完成率</b><p>围绕 onboarding 引导、实验范围和数据口径完成了初步分工。</p></div>
        <div className="signal-card decision"><span><Icon name="check" size={16} /></span><div><small>已识别决策</small><b>首日完成率目标设为 65%</b></div></div>
        <div className="signal-card action"><span><Icon name="task" size={16} /></span><div><small>3 个行动项</small><b>2 个已有明确负责人</b></div></div>
        <div className="signal-card metric"><span><Icon name="trend" size={16} /></span><div><small>关注指标</small><b>激活率 · 次日留存</b></div></div>
      </section>
    </div>
    <button className="primary-cta end-record" onClick={onNext}><span className="stop-icon" />结束录音并生成纪要<Icon name="arrow" size={18} /></button>
  </div>;
}

function ReviewStep({ onNext, onFinish }: { onNext: () => void; onFinish: () => void }) {
  return <div className="stage review-stage">
    <div className="success-kicker"><span><Icon name="check" size={18} /></span>录音和纪要已生成</div>
    <h1>这次会议，需要继续跟踪吗？</h1>
    <p className="lead">Snack 识别到 1 项决策、3 个行动项和 2 个关注指标。你可以创建项目持续跟踪，也可以只保存本次纪要。</p>
    <div className="review-layout">
      <section className="review-paper">
        <div className="paper-head"><div><span className="file-icon"><Icon name="file" size={19} /></span><div><b>产品周会 · 2026-08-01</b><small>会议纪要 · 已完成</small></div></div><button><Icon name="more" size={19} /></button></div>
        <div className="paper-section"><small>会议结论</small><p>本周将新用户首日完成率作为核心目标，先以 20% 流量验证新版 onboarding 引导。</p></div>
        <div className="paper-section"><small>行动项</small>
          {["周三前完成 onboarding 引导稿", "补齐激活率数据口径与历史基线", "周五复盘实验转化和次日留存"].map((x, i) => <div className="paper-task" key={x}><span>{i + 1}</span><b>{x}</b><em>{["陆铭", "林可", "高翔"][i]}</em></div>)}
        </div>
        <div className="paper-meta"><span>原始录音 32:18</span><span>完整转写 4,286 字</span><span>生成于 16:34</span></div>
      </section>
      <section className="track-choice">
        <div className="recommend-badge"><Icon name="sparkle" size={15} />Snack 建议</div>
        <h2>创建项目持续跟踪</h2><p>这些事项跨越多天并需要多人协作，适合放进一个业务项目持续推进。</p>
        <div className="benefit-list">
          <div><span><Icon name="folder" size={18} /></span><p><b>沉淀项目上下文</b><small>关联云端 Wiki、本地资料和后续会议</small></p></div>
          <div><span><Icon name="users" size={18} /></span><p><b>自动建立协作空间</b><small>项目成员、群聊与资料权限同步创建</small></p></div>
          <div><span><Icon name="target" size={18} /></span><p><b>持续跟踪任务和指标</b><small>下次会前自动生成进展简报</small></p></div>
        </div>
        <button className="primary-cta compact" onClick={onNext}>创建项目并继续<Icon name="arrow" size={18} /></button>
        <button className="text-action" onClick={onFinish}>只保存纪要，暂不跟踪</button>
      </section>
    </div>
  </div>;
}

function ProjectStep({ onNext }: { onNext: () => void }) {
  const [name, setName] = useState("AI 营销增长系统");
  return <div className="stage project-stage">
    <div className="form-head"><div><span className="form-icon"><Icon name="folder" size={23} /></span><div><h1>创建业务项目</h1><p>确认项目上下文与协作成员，Snack 会同时建立项目空间和对应群聊。</p></div></div><span>4 / 6</span></div>
    <div className="form-grid">
      <section className="form-card">
        <div className="form-section"><label>项目名称</label><div className="input-shell"><Icon name="folder" size={18} /><input value={name} onChange={e => setName(e.target.value)} /></div></div>
        <div className="form-section"><label>项目目标</label><textarea defaultValue="提升新用户激活与留存，通过持续实验把首日完成率提升至 65%。" /></div>
        <div className="form-section"><div className="label-row"><label>项目上下文</label><small>Snack 会从这些资料生成异步快照</small></div>
          <div className="context-list">
            <div className="context-item"><span className="context-icon wiki">W</span><div><b>增长实验 Wiki</b><small>云端 Wiki · 12 篇文档</small></div><span className="connected"><Icon name="check" size={13} />已连接</span></div>
            <div className="context-item"><span className="context-icon local-folder"><Icon name="folder" size={20} /></span><div><b>本地 /Growth/Onboarding</b><small>桌面文件夹 · 28 个文件</small></div><span className="connected"><Icon name="check" size={13} />已连接</span></div>
            <button className="add-source"><Icon name="plus" size={17} />添加资料来源</button>
          </div>
        </div>
      </section>
      <section className="form-card team-card">
        <div className="form-section"><div className="label-row"><label>项目成员</label><button><Icon name="plus" size={15} />添加成员</button></div>
          <div className="member-list">
            {[["高", "高翔", "项目负责人", "#FF720A"], ["陆", "陆铭", "产品设计", "#5B8DEF"], ["林", "林可", "数据分析", "#18A87B"], ["周", "周叙", "增长运营", "#A46BE8"]].map(([a,n,r,c]) => <div className="member" key={n}><Avatar label={a} color={c} /><div><b>{n}</b><small>{r}</small></div><span><Icon name="check" size={13} />已加入</span></div>)}
          </div>
        </div>
        <div className="group-preview"><div className="group-title"><span><Icon name="message" size={18} /></span><div><b>同时创建项目群聊</b><small>AI 营销增长系统 · 项目群</small></div><span className="switch on"><i /></span></div><p>会议纪要、任务变化和下次会前简报会同步到群聊。</p></div>
      </section>
    </div>
    <div className="form-footer"><p><Icon name="sparkle" size={16} />创建后约 2 分钟生成第一版项目快照</p><button className="primary-cta compact" onClick={onNext}>创建项目并配置跟踪<Icon name="arrow" size={18} /></button></div>
  </div>;
}

function TasksStep({ onNext }: { onNext: () => void }) {
  const [metrics, setMetrics] = useState(true);
  return <div className="stage tasks-stage">
    <div className="form-head"><div><span className="form-icon task-icon"><Icon name="target" size={23} /></span><div><h1>确认任务与关注指标</h1><p>Snack 已从纪要中提取跟踪事项，确认后会写入项目 Task Hub。</p></div></div><span>5 / 6</span></div>
    <div className="task-metric-layout">
      <section className="task-review-card">
        <div className="section-heading"><div><b>跟踪任务</b><span>3</span></div><button><Icon name="plus" size={16} />添加任务</button></div>
        <div className="task-table-head"><span>任务</span><span>负责人</span><span>截止时间</span><span /></div>
        {[
          ["完成 onboarding 引导稿", "陆", "陆铭", "8 月 5 日", "#5B8DEF", "进行中"],
          ["补齐激活率口径与历史基线", "林", "林可", "8 月 6 日", "#18A87B", "待开始"],
          ["复盘实验转化和次日留存", "高", "高翔", "8 月 8 日", "#FF720A", "待开始"],
        ].map(([title,a,name,date,color,status]) => <div className="task-table-row" key={title}>
          <div><span className="check-box"><Icon name="check" size={12} /></span><span><b>{title}</b><small>{status}</small></span></div>
          <div><Avatar label={a} color={color} /><span>{name}</span></div><span>{date}</span><button><Icon name="more" size={18} /></button>
        </div>)}
      </section>
      <section className="metric-card">
        <div className="section-heading"><div><b>关注核心目标 / 指标</b></div><span className={`switch ${metrics ? "on" : ""}`} onClick={() => setMetrics(!metrics)}><i /></span></div>
        <p className="metric-intro">开启后，Snack 会在项目快照与会前简报中持续关注变化。</p>
        <div className="north-star"><div className="metric-symbol"><Icon name="target" size={20} /></div><div><small>核心目标</small><b>首日关键路径完成率</b></div><span>65%</span></div>
        <div className="metric-list">
          <div><span>激活率</span><b>42.8%</b><em className="up">+3.2%</em></div>
          <div><span>次日留存</span><b>31.4%</b><em className="down">-0.8%</em></div>
        </div>
        <button className="add-metric"><Icon name="plus" size={16} />添加指标</button>
        <div className="brief-setting"><Icon name="calendar" size={18} /><div><b>下次会前自动提醒</b><small>会前 1 天 · 群聊发送项目简报</small></div><span className="switch on"><i /></span></div>
      </section>
    </div>
    <div className="form-footer"><p><Icon name="check" size={16} />所有设置都可以稍后在项目设置中修改</p><button className="primary-cta compact" onClick={onNext}>确认并进入项目<Icon name="arrow" size={18} /></button></div>
  </div>;
}

function CompleteStep({ onRestart }: { onRestart: () => void }) {
  return <div className="stage complete-stage">
    <div className="project-cover">
      <div className="project-cover-top"><div className="project-logo"><Icon name="trend" size={27} /></div><div><div className="project-status"><span />项目已创建</div><h1>AI 营销增长系统</h1><p>项目上下文、群聊和 3 个跟踪任务已就绪</p></div><button className="outline-btn"><Icon name="settings" size={17} />项目设置</button></div>
      <div className="project-stats"><div><small>项目成员</small><span className="stack-avatars"><Avatar label="高" color="#FF720A" /><Avatar label="陆" color="#5B8DEF" /><Avatar label="林" color="#18A87B" /><Avatar label="周" color="#A46BE8" /></span><b>4 人</b></div><div><small>资料来源</small><b>2 个</b><span>Wiki + 本地文件夹</span></div><div><small>待跟踪任务</small><b>3 个</b><span>1 项进行中</span></div><div><small>快照状态</small><b className="orange-text">生成中</b><span>预计 2 分钟</span></div></div>
    </div>
    <div className="dashboard-grid">
      <section className="dash-card brief-card"><div className="dash-title"><div><span><Icon name="brief" size={18} /></span><b>下次会前简报</b></div><em>自动生成</em></div>
        <div className="next-meeting"><div className="date-chip"><b>08</b><small>月 08 日</small></div><div><b>产品周会 · 智能协作</b><p>下周五 16:00 · 会前 1 天发送</p></div></div>
        <div className="brief-preview"><small>届时将包含</small><div><span><Icon name="check" size={14} />本周任务进展与逾期风险</span><span><Icon name="trend" size={14} />核心指标变化与异常</span><span><Icon name="file" size={14} />最新资料与关键决策</span></div></div>
        <button className="secondary-btn">预览简报样式<Icon name="arrow" size={17} /></button>
      </section>
      <section className="dash-card recent-card"><div className="dash-title"><div><span><Icon name="clock" size={18} /></span><b>最新动态</b></div><button>查看全部</button></div>
        <div className="timeline-item"><span className="timeline-icon orange"><Icon name="file" size={15} /></span><div><b>会议纪要已归档</b><p>产品周会 · 识别 3 个行动项</p><small>刚刚</small></div></div>
        <div className="timeline-item"><span className="timeline-icon blue"><Icon name="message" size={15} /></span><div><b>项目群聊已创建</b><p>4 位项目成员已加入</p><small>刚刚</small></div></div>
        <div className="timeline-item"><span className="timeline-icon green"><Icon name="target" size={15} /></span><div><b>跟踪任务已写入 Task Hub</b><p>3 个任务 · 最近截止 8 月 5 日</p><small>刚刚</small></div></div>
      </section>
    </div>
    <div className="complete-actions"><button className="text-action" onClick={onRestart}>重新体验流程</button><button className="primary-cta compact">进入项目主页<Icon name="arrow" size={18} /></button></div>
  </div>;
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [view, setView] = useState<ProductView | "record">("record");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrent(readInitialStep());
      setView(readInitialView());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const navigate = (next: ProductView | "record") => {
    setView(next);
    const url = new URL(window.location.href);
    url.searchParams.set("view", next);
    if (next !== "record") url.searchParams.delete("step");
    window.history.pushState({}, "", url);
  };
  const content = useMemo(() => {
    if (current === 0) return <SourceStep onNext={() => setCurrent(1)} />;
    if (current === 1) return <RecordingStep onNext={() => setCurrent(2)} />;
    if (current === 2) return <ReviewStep onNext={() => setCurrent(3)} onFinish={() => setCurrent(5)} />;
    if (current === 3) return <ProjectStep onNext={() => setCurrent(4)} />;
    if (current === 4) return <TasksStep onNext={() => setCurrent(5)} />;
    return <CompleteStep onRestart={() => setCurrent(0)} />;
  }, [current]);

  if (view !== "record") return <ProductPages view={view} go={navigate} />;

  return <main className="app-shell">
    <Sidebar onNavigate={navigate} />
    <section className="workspace">
      <Header current={current} />
      <div className="workspace-body">
        <StepRail current={current} onChange={setCurrent} />
        <div className="content-scroll">{content}</div>
      </div>
    </section>
  </main>;
}

const productViews: Array<ProductView | "record"> = ["record", "home", "taskhub", "todos", "project", "task-detail", "employees", "skills", "tasks", "wiki", "apps", "record-library", "record-settings", "record-summary"];

function readInitialView(): ProductView | "record" {
  if (typeof window === "undefined") return "record";
  const requested = new URLSearchParams(window.location.search).get("view") as ProductView | "record" | null;
  return requested && productViews.includes(requested) ? requested : "record";
}

function readInitialStep(): number {
  if (typeof window === "undefined") return 0;
  const step = Number(new URLSearchParams(window.location.search).get("step"));
  return Number.isFinite(step) && step >= 1 && step <= 6 ? step - 1 : 0;
}
