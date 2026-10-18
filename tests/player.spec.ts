import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
const route = "/courses/classical-intro/player";
async function loadTechnical(page: Page) {
  await page.goto(route);
  await expect(page.locator(".dance-player")).toBeVisible();
  const load = page
    .locator(".player-empty")
    .getByRole("button", { name: "加载技术测试片" });
  if (await load.isVisible()) await load.click();
  await expect(
    page.getByRole("button", { name: "播放", exact: true }),
  ).toBeEnabled();
}
async function seek(page: Page, time: number) {
  const range = page.getByRole("slider", { name: "播放进度" });
  await range.fill(String(time));
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeCloseTo(time, 0);
}

test("课程浏览、八节导学与旧入口保留", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /中国古典舞/ })
    .first()
    .click();
  await page.getByRole("link", { name: /古典舞 · 基础手位/ }).click();
  await page.getByRole("link", { name: "进入演示播放器 ↗" }).click();
  await expect(page).toHaveURL(new RegExp(route));
  await expect(
    page.getByRole("heading", { name: "暂无背面示范视频" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "播放", exact: true }),
  ).toBeDisabled();
  await page.goto("/learn/foundation");
  await expect(page.locator(".course-grid > a")).toHaveCount(8);
  for (const slug of ["folk", "interest", "support", "posture", "rhythm"]) {
    expect((await page.goto(`/learn/${slug}`))?.status()).toBe(200);
  }
  expect((await page.goto("/courses/unknown/player"))?.status()).toBe(404);
});

test("真实媒体播放、暂停、拖动和全部倍速", async ({ page }) => {
  await loadTechnical(page);
  await page.getByRole("button", { name: "播放", exact: true }).click();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0.2);
  await page.getByRole("button", { name: "暂停", exact: true }).click();
  const paused = await page
    .locator("video")
    .evaluate((v: HTMLVideoElement) => v.currentTime);
  await page.waitForTimeout(300);
  expect(
    await page
      .locator("video")
      .evaluate((v: HTMLVideoElement) => v.currentTime),
  ).toBeCloseTo(paused, 1);
  for (const speed of ["0.5", "0.75", "0.9", "1", "1.25"]) {
    await page.getByLabel("倍速", { exact: true }).selectOption(speed);
    expect(
      await page
        .locator("video")
        .evaluate((v: HTMLVideoElement) => v.playbackRate),
    ).toBe(Number(speed));
  }
  await seek(page, 8.5);
});

test("三视角保留时间、速度和循环，镜像与对镜状态分离", async ({ page }) => {
  await loadTechnical(page);
  await seek(page, 6);
  await page.getByLabel("倍速", { exact: true }).selectOption("0.75");
  await page.getByLabel("A 起点（秒）").fill("4");
  await page.getByLabel("B 终点（秒）").fill("9");
  await page.getByRole("button", { name: "开启循环", exact: true }).click();
  await seek(page, 6);
  for (const name of ["正面示范", "对镜示范", "背面示范"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(
      page.getByRole("button", { name: "播放", exact: true }),
    ).toBeEnabled();
    await expect
      .poll(() =>
        page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
      )
      .toBeCloseTo(6, 0);
    expect(
      await page
        .locator("video")
        .evaluate((v: HTMLVideoElement) => v.playbackRate),
    ).toBe(0.75);
    await expect(page.locator(".loop-controls legend")).toContainText("循环中");
  }
  await page.getByRole("button", { name: "开启镜像", exact: true }).click();
  await expect(page.locator(".mirror-badge")).toContainText("镜像已开启");
  expect(
    await page.locator("video").evaluate((v) => getComputedStyle(v).transform),
  ).toContain("-1");
  expect(
    await page
      .locator(".player-controls")
      .evaluate((v) => getComputedStyle(v).transform),
  ).toBe("none");
});

test("缺少视角时不冒充，支持本地文件并处理格式错误", async ({ page }) => {
  await page.goto(route);
  await page.getByText("本地素材与演示说明", { exact: true }).click();
  await page
    .getByLabel("背面示范视频", { exact: true })
    .setInputFiles(path.resolve("public/demo/back.mp4"));
  await expect(
    page.getByRole("button", { name: "播放", exact: true }),
  ).toBeEnabled();
  await seek(page, 4);
  await page
    .getByRole("group", { name: "示范视角" })
    .getByRole("button", { name: /正面示范/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "暂无正面示范视频" }),
  ).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  await page
    .getByRole("group", { name: "示范视角" })
    .getByRole("button", { name: /背面示范/ })
    .click();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeCloseTo(4, 0);
  await page.getByLabel("背面示范视频", { exact: true }).setInputFiles({
    name: "invalid.mp4",
    mimeType: "video/mp4",
    buffer: Buffer.from("invalid video"),
  });
  await expect(
    page.getByRole("heading", { name: "这段视频暂时无法播放" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "播放", exact: true }),
  ).toBeDisabled();
});

test("AB边界验证、实际循环、取消与段落循环", async ({ page }) => {
  await loadTechnical(page);
  await page.getByLabel("A 起点（秒）").fill("4");
  await page.getByLabel("B 终点（秒）").fill("3");
  await page.getByRole("button", { name: "开启循环", exact: true }).click();
  await expect(page.locator(".player-status")).toContainText("有效循环");
  await page.getByLabel("A 起点（秒）").fill("1");
  await page.getByLabel("B 终点（秒）").fill("2");
  await page.getByRole("button", { name: "开启循环", exact: true }).click();
  await page.locator("video").evaluate((v: HTMLVideoElement) => {
    v.dataset.loopSeeks = "0";
    v.addEventListener("seeked", () => {
      v.dataset.loopSeeks = String(Number(v.dataset.loopSeeks) + 1);
    });
  });
  await page.getByRole("button", { name: "播放", exact: true }).click();
  await expect
    .poll(() => page.locator("video").getAttribute("data-loop-seeks"), {
      timeout: 5000,
    })
    .not.toBe("0");
  const current = await page
    .locator("video")
    .evaluate((v: HTMLVideoElement) => v.currentTime);
  expect(current).toBeGreaterThanOrEqual(1);
  expect(current).toBeLessThan(2.2);
  await page.getByRole("button", { name: "暂停", exact: true }).click();
  await page.getByRole("button", { name: "取消循环", exact: true }).click();
  await expect(page.getByLabel("A 起点（秒）")).toHaveValue("");
  await page
    .locator(".segment-grid article")
    .nth(1)
    .getByRole("button", { name: "循环本段" })
    .click();
  await expect(page.getByLabel("A 起点（秒）")).toHaveValue("2.0");
  await expect(page.getByLabel("B 终点（秒）")).toHaveValue("10.0");
  await seek(page, 14);
  await expect(page.locator(".loop-controls legend")).toContainText("未开启");
});

test("数拍随真实媒体时间、暂停和拖动同步，独立模式关闭提示", async ({
  page,
}) => {
  await loadTechnical(page);
  await page.getByRole("button", { name: "音乐跟练", exact: true }).click();
  await seek(page, 0.5);
  await expect(page.getByTestId("beat-count")).toHaveText("6");
  await seek(page, 2);
  await expect(page.getByTestId("beat-count")).toHaveText("1");
  await seek(page, 4.5);
  await expect(page.getByTestId("beat-count")).toHaveText("6");
  await page.getByLabel("数拍方式").selectOption("4");
  await expect(page.getByTestId("beat-count")).toHaveText("2");
  await page.waitForTimeout(600);
  await expect(page.getByTestId("beat-count")).toHaveText("2");
  await page.getByRole("button", { name: "独立练习", exact: true }).click();
  await expect(page.getByTestId("beat-count")).toHaveCount(0);
});

test("恢复本机进度、模式、视角和倍速，损坏存储可降级", async ({ page }) => {
  await loadTechnical(page);
  await seek(page, 7);
  await page.getByLabel("倍速", { exact: true }).selectOption("0.75");
  await page.getByRole("button", { name: "音乐跟练", exact: true }).click();
  await page.getByRole("button", { name: "对镜示范", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "播放", exact: true }),
  ).toBeEnabled();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(
            localStorage.getItem("quanminwu:progress:classical-intro") ??
              "null",
          )?.view,
      ),
    )
    .toBe("mirror");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "对镜示范", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("倍速", { exact: true })).toHaveValue("0.75");
  await expect(
    page.getByRole("button", { name: "音乐跟练", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeCloseTo(7, 0);
  expect(
    await page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
  ).toBe(true);
  await page.goto("/progress");
  await expect(page.getByRole("link", { name: "继续上次位置" })).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem("quanminwu:progress:classical-intro", "{broken"),
  );
  await page.goto(route);
  await expect(
    page.getByRole("heading", { name: "暂无背面示范视频" }),
  ).toBeVisible();
});

test("动态演示水印跨视角与全屏，原生全屏受限时保留页内能力", async ({
  page,
}) => {
  await loadTechnical(page);
  await expect(page.getByTestId("watermark")).toContainText("演示水印");
  const session = await page.getByTestId("watermark").textContent();
  await seek(page, 6);
  await expect(page.getByTestId("watermark")).toHaveClass(/watermark-1/);
  await page.getByRole("button", { name: "正面示范", exact: true }).click();
  await expect(page.getByTestId("watermark")).toHaveText(session!);
  await page.getByRole("button", { name: "全屏", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => !!document.fullscreenElement))
    .toBe(true);
  await expect(page.getByTestId("watermark")).toBeVisible();
  await page.getByRole("button", { name: "退出全屏", exact: true }).click();
  await page.evaluate(() =>
    Object.defineProperty(document, "fullscreenEnabled", {
      configurable: true,
      value: false,
    }),
  );
  await page.getByRole("button", { name: "全屏", exact: true }).click();
  await expect(page.locator(".player-status")).toContainText(
    "不支持包含控件与水印",
  );
});

test("本地答疑提交、示例反馈与删除，不上传视频", async ({ page }) => {
  const posted: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posted.push(request.url());
  });
  await page.goto("/courses/classical-intro/questions");
  await page.getByLabel("想请教什么？").fill("重心变化时如何理解八拍？");
  await page
    .getByLabel("练习视频（只选文件名，不上传）")
    .setInputFiles(path.resolve("public/demo/back.mp4"));
  await page.getByRole("button", { name: "添加到本机演示列表" }).click();
  await expect(page.locator(".question-text")).toHaveText(
    "重心变化时如何理解八拍？",
  );
  await page.getByRole("button", { name: "查看示例教师反馈" }).click();
  await expect(
    page.getByRole("heading", { name: "示例反馈 · 非真实教师回复" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator(".question-text")).toBeVisible();
  await page.getByRole("button", { name: "删除本机问题" }).click();
  await expect(page.locator(".question-text")).toHaveCount(0);
  expect(posted).toEqual([]);
});

test("手机、低高度横屏、平板、桌面与键盘，控件点击区域", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const [width, height] of [
    [360, 800],
    [390, 844],
    [667, 320],
    [844, 390],
    [768, 1024],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await loadTechnical(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const controls = await page
      .locator(".player-toolbar button")
      .evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().height),
      );
    expect(controls.every((height) => height >= 44)).toBe(true);
    const modes = await page
      .locator(".practice-modes button")
      .evaluateAll((buttons) =>
        buttons.map((button) => ({
          width: button.getBoundingClientRect().width,
          height: button.getBoundingClientRect().height,
        })),
      );
    expect(
      modes.every((button) => button.width >= 90 && button.height < 75),
    ).toBe(true);
    const range = page.getByRole("slider", { name: "播放进度" });
    await range.focus();
    await page.keyboard.press("ArrowRight");
    expect(Number(await range.inputValue())).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test("播放控件可自动隐藏并触摸恢复，键盘焦点不被自动隐藏", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await loadTechnical(page);
  await page.getByRole("button", { name: "播放", exact: true }).click();
  await expect(page.locator("#dance-controls")).toBeHidden({ timeout: 7000 });
  await page.locator(".player-stage").click();
  await expect(page.locator("#dance-controls")).toBeVisible();
  await page.getByRole("slider", { name: "播放进度" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(4800);
  await expect(page.locator("#dance-controls")).toBeVisible();
});

test("触控横屏可操作，拒绝全屏和禁用存储时仍可播放", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage disabled", "SecurityError");
    };
    HTMLElement.prototype.requestFullscreen = () =>
      Promise.reject(new DOMException("Fullscreen denied", "NotAllowedError"));
  });
  await page.goto("http://127.0.0.1:3100" + route);
  await page.getByRole("button", { name: "加载技术测试片" }).first().tap();
  await expect(
    page.getByRole("button", { name: "播放", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "播放", exact: true }).tap();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0.2);
  await page.getByRole("button", { name: "暂停", exact: true }).tap();
  await page.getByRole("button", { name: "全屏", exact: true }).tap();
  await expect(page.locator(".player-status")).toContainText("未被浏览器允许");
  await expect(
    page.getByText("浏览器不允许本地存储，本次仍可练习，但进度不会保存。"),
  ).toBeVisible();
  await context.close();
});

test("测试片重复加载可继续使用，整段末尾循环不会停住", async ({ page }) => {
  await loadTechnical(page);
  await page.getByText("本地素材与演示说明", { exact: true }).click();
  await page.getByRole("button", { name: "加载技术测试片" }).click();
  await expect(
    page.getByRole("button", { name: "播放", exact: true }),
  ).toBeEnabled();
  await page.getByLabel("A 起点（秒）").fill("22");
  await page.getByLabel("B 终点（秒）").fill("24");
  await page.getByRole("button", { name: "开启循环", exact: true }).click();
  await page.locator("video").evaluate((v: HTMLVideoElement) => {
    let high = 0;
    v.dataset.wrapped = "false";
    v.addEventListener("timeupdate", () => {
      if (high > 23.3 && v.currentTime < 22.5) v.dataset.wrapped = "true";
      high = Math.max(high, v.currentTime);
    });
  });
  await page.getByRole("button", { name: "播放", exact: true }).click();
  await expect
    .poll(() => page.locator("video").getAttribute("data-wrapped"), {
      timeout: 6000,
    })
    .toBe("true");
  expect(
    await page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
  ).toBe(false);
});
