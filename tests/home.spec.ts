import { expect, test } from "@playwright/test";

test("首页五组入口、筹备说明与技术演示链接", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("全民舞 · 从喜欢开始，让舞蹈走进生活");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("从喜欢开始，让舞蹈走进生活。");
  const catalog = page.locator("#explore");
  const slugs = ["foundation", "classical", "folk", "interest", "support"];
  await expect(catalog.locator('a[href^="/learn/"]')).toHaveCount(5);
  for (const slug of slugs) {
    await catalog.locator(`a[href="/learn/${slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/learn/${slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/");
  }
  await expect(page.locator("#sample")).toContainText("筹备中 · 尚未开放");
  await expect(page.locator("#sample")).toContainText("上线时间待确认");
  const sample = page.locator("#sample");
  await expect(sample.locator("img")).toHaveCount(1);
  await expect(sample.locator("figcaption")).toContainText("AI 设计概念 · 非动作教学依据");
  await expect(sample).toContainText("身体认知、自然站姿和听基本拍");
  await expect(sample.locator("ol li")).toHaveCount(3);
  await expect(sample).not.toContainText("八拍踏步");
  await expect(sample).not.toContainText("24秒");
  await expect(sample).not.toContainText("120");
  await sample.getByRole("link", { name: "了解第一课结构演示" }).click();
  await expect(page).toHaveURL(/\/courses\/foundation-1$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("身体认知、自然站姿和听基本拍");
  await page.goto("/");
  await expect(page.locator('section[aria-labelledby="hero-title"] figcaption')).toContainText("AI 品牌意象 · 非真实教学场景");
  await expect(catalog.locator("[data-course-cover]")).toHaveCount(5);
  await expect(catalog.locator("img")).toHaveCount(0);
  await expect(catalog.locator('[data-course-cover="B"]')).toContainText("维吾尔族舞");
  await expect(catalog.locator('[data-course-cover="C"]')).toContainText("成品舞教学");
  await expect(page.locator('section[aria-labelledby="hero-title"]')).toContainText("18–65 岁");
  await expect(page.locator("#method")).toContainText("功能示意");
  await page.locator("summary").filter({ hasText: "现在可以看真实样课或报名吗？" }).click();
  await expect(page.locator("details[open]")).toContainText("没有真实教师接收");
  await page.getByRole("link", { name: "体验技术演示播放器" }).click();
  await expect(page).toHaveURL(/\/courses\/classical-intro\/player$/);
  await expect(page.getByRole("heading", { name: "暂无背面示范视频" })).toBeVisible();
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`首页 ${width}px 无横向溢出且品牌图片加载`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#hero-title")).toBeVisible();
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    await expect.poll(() => page.locator("header img").evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator("#explore h3")).toHaveCount(5);
    const heroBox = await page.locator('section[aria-labelledby="hero-title"] img').boundingBox();
    expect(heroBox).not.toBeNull();
    expect(heroBox!.width / heroBox!.height).toBeCloseTo(1.5, 1);
    const classical = await page.locator('#explore a[href="/learn/classical"]').boundingBox();
    const folk = await page.locator('#explore a[href="/learn/folk"]').boundingBox();
    expect(classical!.width).toBeCloseTo(folk!.width, 0);
    if (width >= 761) expect(classical!.y).toBeCloseTo(folk!.y, 0);
    if (width < 761) {
      const menu = page.locator('summary[aria-label="打开或关闭导航菜单"]');
      await menu.click();
      await expect(page.getByRole("navigation", { name: "手机导航" })).toBeVisible();
      await page.getByRole("navigation", { name: "手机导航" }).getByRole("link", { name: "探索课程", exact: true }).click();
      await expect(page).toHaveURL(/#explore$/);
      await expect(page.getByRole("navigation", { name: "手机导航" })).toBeHidden();
      await menu.click();
      await menu.press("Escape");
      await expect(menu).toBeFocused();
      await expect(page.getByRole("navigation", { name: "手机导航" })).toBeHidden();
    }
  });
}

test("首页跳转链接支持键盘，FAQ 可展开收起", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "跳转至主要内容" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  const faq = page.locator("summary").filter({ hasText: "没有基础，可以从哪里开始？" });
  await faq.focus();
  await faq.press("Enter");
  await expect(page.locator("details[open]")).toContainText("兴趣课不设强制先修");
  await faq.press("Enter");
  await expect(page.locator("details[open]")).toHaveCount(0);
});
