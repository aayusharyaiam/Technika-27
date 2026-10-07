import { expect, test, type Page } from "@playwright/test";

async function arrive(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  // The entry button is autofocus; Enter also handles a loader that already auto-dismissed.
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("h1")).toBeVisible();
}

test("arrival, home sections, timeline tabs, and real links work", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await arrive(page);
  await expect(page.locator("#hero-title")).toContainText("TECHNIKA");
  await page.getByRole("tab", { name: /DAY II ·/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("The Triwizard Spellathon");
  await page.getByRole("tab", { name: /DAY II ·/ }).press("ArrowRight");
  await expect(page.getByRole("tabpanel")).toContainText("The Yule Ball");
  for (const id of ["about", "campus", "sponsors"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id} h2`)).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("every themed portal is readable, images load, and layout fits", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  for (const route of ["/", "/registrations", "/members", "/delegate", "/alumni", "/contact"]) {
    await page.goto(route);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(route === "/" ? ".hero-details" : ".inner-hero")).toHaveCSS("opacity", "1");
    if (route !== "/") await expect(page.locator(".soon-badge")).toBeVisible();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter((img) => img.loading !== "lazy").map((img) => img.decode().catch(() => {}))); });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, `${route} must fit ${testInfo.project.name}`).toBe(false);
    const broken = await page.evaluate(() => [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src));
    expect(broken).toEqual([]);
    await page.screenshot({ path: `test-results/${testInfo.project.name}-${route === "/" ? "home" : route.slice(1)}.png`, scale: "css" });
  }
});

test("mobile navigation supports opening, escape, and route changes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await arrive(page);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("#mobile-navigation").getByRole("link", { name: /Members/ }).click();
  await expect(page).toHaveURL(/\/members$/);
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await expect(page.locator("h1")).toContainText("The Order of Technika");
});

test("chamber filters show the correct sealed portraits", async ({ page }) => {
  await arrive(page, "/members");
  await expect(page.locator(".order-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Web Sorcerers", exact: true }).click();
  await expect(page.locator(".order-card")).toHaveCount(2);
  await expect(page.locator(".order-gallery")).toContainText("Chief Sorcerer");
  await expect(page.locator(".order-gallery")).toContainText("Grand Diviner");
  await page.getByRole("button", { name: "Complete chamber" }).click();
  await expect(page.locator(".order-card")).toHaveCount(8);
});

test("save the date downloads a real calendar and FAQs expand", async ({ page }) => {
  await arrive(page, "/registrations");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save the date" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("technika-27-save-the-date.ics");
  const stream = await download.createReadStream();
  let calendar = "";
  for await (const chunk of stream!) calendar += chunk.toString();
  expect(calendar).toContain("DTSTART;VALUE=DATE:20270108");
  expect(calendar).toContain("STATUS:TENTATIVE");
  await page.getByText("Can students from other colleges attend?", { exact: true }).click();
  await expect(page.getByText(/The delegate portal is being prepared/)).toBeVisible();
});

test("snitch is autonomous, and motion can be paused", async ({ page }) => {
  await arrive(page);
  const first = await page.locator(".flying-snitch").evaluate((el) => el.getAttribute("style"));
  await expect.poll(() => page.locator(".flying-snitch").evaluate((el) => el.getAttribute("style"))).not.toBe(first);
  await page.getByRole("button", { name: "Pause magical effects" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-magic", "off");
  const paused = await page.locator(".flying-snitch").evaluate((el) => el.getAttribute("style"));
  await page.waitForTimeout(200);
  expect(await page.locator(".flying-snitch").evaluate((el) => el.getAttribute("style"))).toBe(paused);
  await page.getByRole("button", { name: "Enable magical effects" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-magic", "on");
});

test("reduced motion and narrow phone screens remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 740 });
  await arrive(page);
  await expect(page.locator("html")).toHaveAttribute("data-magic", "off");
  for (const route of ["/", "/registrations", "/members", "/delegate", "/alumni", "/contact"]) {
    await page.goto(route);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), route).toBe(true);
  }
});
