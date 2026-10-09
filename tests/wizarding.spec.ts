import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: /solemnly swear/ })).toHaveCount(0, { timeout: 20000 });
}

test("house choices recolour the entire site and survive navigation and reload", async ({ page }) => {
  await open(page, "/login");
  await page.getByRole("button", { name: /Slytherin Ambition/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-house", "slytherin");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--gold").trim())).toBe("#98d8b4");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-house", "slytherin");
  await expect(page.locator(".hero .house-banners")).toHaveAttribute("data-selected-house", "slytherin");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-house", "slytherin");
  await page.goto("/signup");
  await expect(page.getByRole("button", { name: /Slytherin Ambition/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Keep the original enchanted gold" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-house", "default");
});

test("all four house palettes and banners are distinct", async ({ page }) => {
  await open(page, "/signup");
  const colours = new Set<string>();
  for (const [name, slug] of [["Gryffindor", "gryffindor"], ["Slytherin", "slytherin"], ["Ravenclaw", "ravenclaw"], ["Hufflepuff", "hufflepuff"]]) {
    await page.getByRole("button", { name: new RegExp(name) }).click();
    await expect(page.locator("html")).toHaveAttribute("data-house", slug);
    await expect(page.locator(".auth-house-banners")).toHaveAttribute("data-selected-house", slug);
    colours.add(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--gold").trim()));
  }
  expect(colours.size).toBe(4);
});

test("Hallows illuminate one relic at a time with matching stories", async ({ page }) => {
  await open(page);
  await page.locator("#relics").scrollIntoViewIfNeeded();
  const hallows = page.locator(".hallows-component");
  await hallows.getByRole("tab", { name: /Resurrection Stone/ }).click();
  await expect(hallows).toHaveAttribute("data-active-hallow", "stone");
  await expect(hallows.locator(".illuminated")).toHaveCount(1);
  await expect(hallows.getByRole("tabpanel")).toContainText("The Resurrection Stone");
  await hallows.getByRole("tab", { name: /Resurrection Stone/ }).press("ArrowRight");
  await expect(hallows).toHaveAttribute("data-active-hallow", "cloak");
  await expect(hallows.getByRole("tabpanel")).toContainText("The Invisibility Cloak");
  await expect(page.locator(".goblet-fire > i")).toHaveCount(7);
});

test("Ministry notices open and close accessible decree dialogs", async ({ page }) => {
  await open(page, "/members");
  await page.getByRole("button", { name: "Read decree for Supreme Mugwump" }).click();
  await expect(page.getByRole("dialog", { name: "Supreme Mugwump" })).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("The Chief Convener");
  await page.keyboard.press("Escape");
  await expect(page.locator(".decree-dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Read decree for Supreme Mugwump" })).toBeFocused();
});

test("signup validates strong passwords without contacting the auth service", async ({ page }) => {
  let calls = 0;
  await page.route("**/auth/v1/signup**", async (route) => { calls++; await route.abort(); });
  await open(page, "/signup");
  await page.getByLabel("Your name", { exact: true }).fill("Test Wizard");
  await page.getByLabel("Email address", { exact: true }).fill("wizard@example.invalid");
  await page.getByLabel("Password", { exact: true }).fill("abcdefghijklmnop");
  await page.getByLabel("Confirm password", { exact: true }).fill("abcdefghijklmnop");
  await page.getByRole("button", { name: "Write my first chapter" }).click();
  await expect(page.locator(".auth-form-panel").getByRole("alert")).toContainText("a letter and a number");
  await page.getByLabel("Password", { exact: true }).fill("Astrongpassword27");
  await page.getByLabel("Confirm password", { exact: true }).fill("Anotherpassword27");
  await page.getByRole("button", { name: "Write my first chapter" }).click();
  await expect(page.locator(".auth-form-panel").getByRole("alert")).toContainText("do not match");
  expect(calls).toBe(0);
});

test("login displays real auth failures instead of a simulated success", async ({ page }) => {
  await page.route("**/auth/v1/token?grant_type=password", async (route) => route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "invalid_grant", error_description: "Invalid login credentials", msg: "Invalid login credentials" }) }));
  await open(page, "/login");
  await page.getByLabel("Email address", { exact: true }).fill("wizard@example.invalid");
  await page.getByLabel("Password", { exact: true }).fill("Astrongpassword27");
  await page.getByRole("button", { name: "Enter the common room" }).click();
  await expect(page.locator(".auth-form-panel").getByRole("alert")).toContainText("email and password do not match");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("button", { name: "Forgot your password?" }).click();
  await expect(page.getByRole("button", { name: "Send my reset letter" })).toBeVisible();
});

test("private account and callback reject missing or forged sessions and external redirects", async ({ request }) => {
  const anonymous = await request.get("/account", { maxRedirects: 0 });
  expect(anonymous.status()).toBe(307);
  expect(anonymous.headers().location).toMatch(/\/login$/);
  const forged = await request.get("/account", { maxRedirects: 0, headers: { cookie: "sb-fmmshphhieonyjrjwkos-auth-token=base64-Zm9yZ2Vk" } });
  expect(forged.status()).toBe(307);
  expect(forged.headers().location).toMatch(/\/login$/);
  const callback = await request.get("/auth/callback?next=https://example.com", { maxRedirects: 0 });
  expect(callback.headers().location).toMatch(/\/login\?error=confirmation$/);
});

test("auth pages are noindex and fit narrow phone screens", async ({ page, request }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const route of ["/login", "/signup", "/reset-password"]) {
    await open(page, route);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    const html = await (await request.get(route)).text();
    expect(html).toMatch(/name="robots" content="[^"]*noindex/);
  }
});

test("the cursor uses the downloaded wand and keeps input editing native", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await open(page, "/login");
  await page.mouse.move(100, 200);
  await expect(page.locator("html")).toHaveAttribute("data-wand", "ready");
  await expect(page.locator(".photographic-wand")).toHaveCSS("opacity", "1");
  await page.getByLabel("Email address", { exact: true }).hover();
  await expect(page.locator(".photographic-wand")).toHaveCSS("opacity", "0");
  await expect(page.getByLabel("Email address", { exact: true })).toHaveCSS("cursor", "text");
});
