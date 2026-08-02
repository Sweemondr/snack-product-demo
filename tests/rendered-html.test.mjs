import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Snack recording entry", async () => {
  const response = await render("/?view=record");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Snack · 产品全景协作 Demo<\/title>/i);
  assert.match(html, /Snack Record/);
  assert.match(html, /把会议记录下来/);
  assert.match(html, /会议跟踪流程/);
  assert.match(html, /选择录音/);
  assert.match(html, /项目已就绪/);
});

test("keeps the complete product view inventory in source", async () => {
  const [page, productPages, productCss, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/product-pages.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/product-pages.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  for (const view of [
    "home",
    "taskhub",
    "todos",
    "project",
    "task-detail",
    "employees",
    "skills",
    "tasks",
    "wiki",
    "apps",
    "record-library",
    "record-settings",
    "record-summary",
  ]) {
    assert.match(productPages, new RegExp(`\\| \\"${view}\\"`));
  }

  assert.match(page, /ProductPages/);
  assert.match(page, /readInitialView/);
  assert.match(productPages, /Snack Record/);
  assert.match(productPages, /我的录音/);
  assert.match(productPages, /生成会议纪要/);
  assert.match(productPages, /首次配置 Snack Record/);
  assert.match(productPages, /snack-record-configured-v1/);
  assert.match(productPages, /创建项目继续跟踪/);
  assert.match(productPages, /将 3 个任务写入 Task Hub/);
  assert.match(productPages, /开启会前提醒与简报/);
  assert.match(productPages, /每一步都可跳过/);
  assert.match(productCss, /pd-conversation-layout/);
  assert.match(productCss, /pd-record-settings-entry/);
  assert.match(productPages, /任务工作台/);
  assert.match(productCss, /--pd-orange:#fe720a/);
  assert.match(layout, /title: "Snack · 产品全景协作 Demo"/);
});
