import { expect, test, type Page } from "@playwright/test";

async function fillLogin(page: Page) {
  await page.getByLabel("Email address", { exact: true }).fill("wizard@example.invalid");
  await page.getByLabel("Password", { exact: true }).fill("Astrongpassword27");
}

async function fillSignup(page: Page) {
  await page.getByLabel("Full name", { exact: true }).fill("Test Wizard");
  await page.getByLabel("College", { exact: true }).fill("BIT Patna");
  await page.getByLabel("Phone number", { exact: true }).fill("+91 98765 43210");
  await fillLogin(page);
}

function sessionFor(user: { id: string }) {
  const payload = Buffer.from(JSON.stringify({ sub: user.id, aud: "authenticated", role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  return { access_token: `eyJhbGciOiJIUzI1NiJ9.${payload}.test-signature`, refresh_token: "test-only-refresh", token_type: "bearer", expires_in: 3600, user };
}

async function mockUnsortedAuth(page: Page) {
  const user = { id: "44444444-4444-4444-8444-444444444444", aud: "authenticated", role: "authenticated", email: "wizard@example.invalid", email_confirmed_at: "2026-01-01T00:00:00Z", created_at: "2026-01-01T00:00:00Z", app_metadata: { provider: "email" }, user_metadata: { display_name: "Test Wizard" } };
  await page.route("**/auth/v1/signup**", (route) => route.fulfill({ json: sessionFor(user) }));
  await page.route("**/auth/v1/token?grant_type=password", (route) => route.fulfill({ json: sessionFor(user) }));
  await page.route("**/auth/v1/user", (route) => route.fulfill({ json: user }));
}

async function enterAuthenticatedCeremony(page: Page) {
  await mockUnsortedAuth(page);
  await page.goto("/signup");
  await fillSignup(page);
  await page.getByRole("button", { name: "BEGIN YOUR CEREMONY" }).click();
  await expect(page.getByRole("region", { name: "Sorting Hat ceremony" })).toBeVisible();
}

test("preview questions, skip and refresh never write house membership", async ({ page }) => {
  await enterAuthenticatedCeremony(page);
  const writes: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET" && /auth\/v1|\/api\//.test(request.url())) writes.push(request.url());
  });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The Hat Awaits.");
  await page.getByRole("button", { name: "BEGIN THE CEREMONY" }).click();
  await page.getByRole("button", { name: "The clever mechanism" }).click();
  await page.reload();
  await expect(page.locator(".sorting-overline")).toHaveText("The Hat asks · 2 of 3");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.getByRole("button", { name: "Skip the questions" }).click();
  await expect(page.locator(".sorting-house-reveal")).toBeVisible();
  const house = await page.locator(".sorting-house-reveal").getAttribute("data-house");
  await page.reload();
  await expect(page.locator(".sorting-house-reveal")).toHaveAttribute("data-house", house!);
  await expect(page.getByRole("status")).toContainText("no house has been assigned");
  await expect(page.locator("html")).toHaveAttribute("data-house", "default");
  expect(writes).toEqual([]);
});

test("reduced-motion preview, keyboard controls and 320px layouts work", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 740 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["/login", "/signup", "/reset-password"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".loading-screen")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(320);
    await expect(page.locator(".auth-hat-wrap, .sorting-visual .sorting-hat-artwork").first()).toHaveCSS("animation-name", "none");
  }
  await enterAuthenticatedCeremony(page);
  await expect(page.locator(".sorting-visual .sorting-hat-artwork")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "BEGIN THE CEREMONY" }).focus();
  await page.keyboard.press("Enter");
  for (let i = 0; i < 3; i++) await page.locator(".sorting-options button").first().press("Enter");
  await expect(page.locator(".sorting-house-reveal")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("ceremony-mobile.png"), fullPage: true });
});

test("forgot-password sends the existing recovery callback and handles network errors", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Forgot your password?" }).click();
  await page.getByLabel("Email address", { exact: true }).fill("wizard@example.invalid");
  await page.route("**/auth/v1/recover**", async (route) => {
    expect(decodeURIComponent(route.request().url())).toContain("/auth/callback?next=/reset-password");
    await route.fulfill({ json: {} });
  });
  await page.getByRole("button", { name: "Send my reset letter" }).click();
  await expect(page.getByRole("status")).toContainText("If an account exists");
  await page.unroute("**/auth/v1/recover**");
  await page.route("**/auth/v1/recover**", (route) => route.abort());
  await page.getByRole("button", { name: "Send my reset letter" }).click();
  await expect(page.locator(".auth-form-panel").getByRole("alert")).toContainText("connection");
});

test("signup submits no chosen house and handles duplicate accounts", async ({ page }) => {
  let calls = 0;
  await page.route("**/auth/v1/signup**", async (route) => {
    calls++;
    expect(route.request().postDataJSON().data).toEqual({ display_name: "Test Wizard", college: "BIT Patna", phone: "+919876543210" });
    await route.fulfill({ status: 422, json: { code: "user_already_exists", msg: "User already registered" } });
  });
  await page.goto("/signup");
  await fillSignup(page);
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "BEGIN YOUR CEREMONY" }).click();
  await expect(page.locator(".auth-form-panel").getByRole("alert")).toContainText("already exists");
  await expect(page.locator(".auth-form-panel").getByRole("alert")).toBeFocused();
  expect(calls).toBe(1);
});

test("email-confirmation signup explains the next step without pretending a session exists", async ({ page }) => {
  await page.route("**/auth/v1/signup**", (route) => route.fulfill({ json: { user: { id: "22222222-2222-4222-8222-222222222222", aud: "authenticated", email: "wizard@example.invalid", created_at: "2026-01-01T00:00:00Z", app_metadata: {}, user_metadata: { display_name: "Test Wizard" }, identities: [] }, session: null } }));
  await page.goto("/signup");
  await fillSignup(page);
  await page.getByRole("button", { name: "BEGIN YOUR CEREMONY" }).click();
  await expect(page.getByRole("status")).toContainText("If you already have an account");
  await expect(page).toHaveURL(/\/signup$/);
});

test("preview remains usable when browser storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("Storage disabled", "SecurityError"); } });
  });
  await enterAuthenticatedCeremony(page);
  await page.getByRole("button", { name: "Skip to the reveal" }).click();
  await expect(page.locator(".sorting-house-reveal")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Preview only");
});

test("returning login greets the saved house and the ceremony never resorts it", async ({ page }) => {
  const user = { id: "11111111-1111-4111-8111-111111111111", aud: "authenticated", role: "authenticated", email: "wizard@example.invalid", email_confirmed_at: "2026-01-01T00:00:00Z", created_at: "2026-01-01T00:00:00Z", app_metadata: { provider: "email" }, user_metadata: { house: "ravenclaw", display_name: "Test Wizard" } };
  const writes: string[] = [];
  await page.route("**/auth/v1/token?grant_type=password", (route) => route.fulfill({ json: sessionFor(user) }));
  await page.route("**/auth/v1/user", (route) => {
    if (route.request().method() !== "GET") writes.push(route.request().method());
    return route.fulfill({ json: user });
  });
  // Isolate the frontend navigation from real server authentication; no live account is created.
  await page.route(/\/account(?:\?.*)?$/, (route) => route.fulfill({ contentType: "text/html", body: "<h1>Account destination</h1>" }));
  await page.goto("/login");
  await fillLogin(page);
  await page.getByRole("button", { name: "RETURN TO YOUR HOUSE" }).click();
  await expect(page.getByRole("status")).toContainText("Ravenclaw welcomes you back");
  await expect(page).toHaveURL(/\/account$/);
  await page.goto("/signup");
  await expect(page.locator(".sorting-house-reveal")).toHaveAttribute("data-house", "ravenclaw");
  await expect(page.getByRole("button", { name: "BEGIN THE CEREMONY" })).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".sorting-house-reveal")).toHaveAttribute("data-house", "ravenclaw");
  expect(writes).toEqual([]);
});

test("auth art and forms are visible on desktop and mobile", async ({ page }, testInfo) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "The Hat Awaits" })).toBeVisible();
  const hat = page.getByRole("img", { name: "Sorting Hat", exact: true });
  await expect(hat).toBeVisible();
  await expect(hat).toHaveAttribute("src", /sorting-hat\.png/);
  await expect.poll(() => hat.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator("video")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("signup.png"), fullPage: true });
});

test("five-field signup opens and resumes the ceremony on the same signup page", async ({ page }, testInfo) => {
  const user = { id: "33333333-3333-4333-8333-333333333333", aud: "authenticated", role: "authenticated", email: "wizard@example.invalid", email_confirmed_at: "2026-01-01T00:00:00Z", created_at: "2026-01-01T00:00:00Z", app_metadata: { provider: "email" }, user_metadata: { display_name: "Test Wizard", college: "BIT Patna", phone: "+919876543210" } };
  let signups = 0;
  const houseWrites: string[] = [];
  await page.route("**/auth/v1/signup**", async (route) => {
    signups++;
    expect(route.request().postDataJSON()).toMatchObject({ email: user.email, password: "Astrongpassword27", data: user.user_metadata });
    await route.fulfill({ json: sessionFor(user) });
  });
  await page.route("**/auth/v1/user", (route) => {
    if (route.request().method() !== "GET") houseWrites.push(route.request().method());
    return route.fulfill({ json: user });
  });
  await page.goto("/signup");
  await expect(page.locator(".wizard-auth-form input")).toHaveCount(5);
  await fillSignup(page);
  await page.getByRole("button", { name: "BEGIN YOUR CEREMONY" }).click();
  await expect(page.getByRole("region", { name: "Sorting Hat ceremony" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Sorting Hat", exact: true })).toHaveAttribute("src", /sorting-hat\.png/);
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.locator(".wizard-auth-form")).toHaveCount(0);
  await expect(page.locator(".signup-journey [aria-current=step]")).toContainText("Meet the Hat");
  await page.getByRole("button", { name: "BEGIN THE CEREMONY" }).click();
  await page.getByRole("button", { name: "The clever mechanism" }).click();
  await page.reload();
  await expect(page.locator(".sorting-overline")).toHaveText("The Hat asks · 2 of 3");
  await expect(page.locator(".wizard-auth-form")).toHaveCount(0);
  await page.getByRole("button", { name: "Skip the questions" }).click();
  await expect(page.locator(".sorting-house-reveal")).toBeVisible();
  await expect(page).toHaveURL(/\/signup$/);
  expect(signups).toBe(1);
  expect(houseWrites).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("same-page-ceremony.png"), fullPage: true });
});

test("signed-out ceremony links redirect to login before rendering any ceremony", async ({ page, request }) => {
  for (const url of ["/sorting", "/signup?step=ceremony"]) {
    const response = await request.get(url, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(/\/login$/);
    expect(response.headers()["cache-control"]).toContain("no-store");
    await page.goto(url);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("region", { name: "Sorting Hat ceremony" })).toHaveCount(0);
  }
  for (const route of ["/login", "/signup"]) {
    await page.goto(route);
    await expect(page.locator(".wizard-auth-form")).toBeVisible();
    await expect(page.locator('a[href*="step=ceremony"], a[href="/sorting"]')).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Explore the ceremony preview" })).toHaveCount(0);
  }
});

test("stale preview state and expired sessions cannot reopen the ceremony", async ({ page }) => {
  await enterAuthenticatedCeremony(page);
  await page.getByRole("button", { name: "Skip to the reveal" }).click();
  await expect(page.locator(".sorting-house-reveal")).toBeVisible();
  // A browser-side mocked session is not a server-verified Supabase token.
  const forged = await page.request.get("/signup?step=ceremony", { maxRedirects: 0 });
  expect(forged.status()).toBe(307);
  expect(forged.headers().location).toMatch(/\/login$/);
  await page.context().clearCookies();
  await page.reload();
  await expect(page.locator(".wizard-auth-form")).toBeVisible();
  await expect(page.getByRole("region", { name: "Sorting Hat ceremony" })).toHaveCount(0);
  await page.goto("/signup?step=ceremony");
  await expect(page).toHaveURL(/\/login$/);
});

test("login without a saved house continues to the authenticated ceremony step", async ({ page }) => {
  await mockUnsortedAuth(page);
  // Serve the public signup shell for this mocked token. Real route authorization
  // is checked separately above; no server-side auth bypass is added to the app.
  await page.route(/\/signup\?.*step=ceremony/, async (route) => {
    const url = new URL(route.request().url());
    url.searchParams.delete("step");
    await route.fulfill({ response: await route.fetch({ url: url.toString() }) });
  });
  await page.goto("/login");
  await fillLogin(page);
  await page.getByRole("button", { name: "RETURN TO YOUR HOUSE" }).click();
  await expect(page).toHaveURL(/\/signup\?step=ceremony$/);
  await expect(page.getByRole("region", { name: "Sorting Hat ceremony" })).toBeVisible();
  await expect(page.getByRole("button", { name: "BEGIN THE CEREMONY" })).toBeVisible();
});
