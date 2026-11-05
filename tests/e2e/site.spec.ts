import { expect, test, type Page } from "@playwright/test";

/** Marks the window so we can prove later interactions did not trigger a full page reload. */
async function markWindow(page: Page) {
  await page.evaluate(() => ((window as unknown as { __avrMarker: number }).__avrMarker = 42));
}
async function expectSameWindow(page: Page) {
  expect(await page.evaluate(() => (window as unknown as { __avrMarker?: number }).__avrMarker)).toBe(42);
}

function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

test.describe("navigation", () => {
  test("primary nav reaches every page", async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const targets = [
      { label: "Team", url: /\/team$/, heading: /one crew/i },
      { label: "Cars", url: /\/cars$/, heading: /AVR-26/i },
      { label: "Races", url: /\/races$/, heading: /long-distance/i },
      { label: "News", url: /\/news$/, heading: /pit lane/i },
      { label: "Contact", url: /\/contact$/, heading: /radio the/i },
      { label: "Home", url: /\/$/, heading: /apex/i },
    ];
    for (const t of targets) {
      await nav.getByRole("link", { name: t.label, exact: true }).click();
      await expect(page).toHaveURL(t.url);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(t.heading);
      await expect(nav.getByRole("link", { name: t.label, exact: true })).toHaveAttribute("aria-current", "page");
    }
    expect(errors).toEqual([]);
  });

  test("hero CTAs work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Explore the Team" }).click();
    await expect(page).toHaveURL(/#team$/);
    await expect(page.locator("#team")).toBeInViewport();

    await page.getByRole("link", { name: "Meet the Drivers" }).click();
    await expect(page).toHaveURL(/\/team$/);

    await page.goto("/");
    await page.getByRole("link", { name: "View Race Calendar" }).first().click();
    await expect(page).toHaveURL(/\/races$/);
  });

  test("Read More opens the matching article", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /^Read more:/ }).first();
    const name = (await link.getAttribute("aria-label"))!.replace("Read more: ", "");
    await link.click();
    await expect(page).toHaveURL(/\/news\/[a-z0-9-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name, { ignoreCase: true });
    await expect(page.getByRole("complementary", { name: "Sample content notice" })).toBeVisible();
  });

  test("unknown pages return a 404 with a way back", async ({ page }) => {
    const res = await page.goto("/races/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/gravel/i);
    await page.getByRole("link", { name: "Return to the pits" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 375, height: 760 } });

  test("opens, closes with Escape, and navigates", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
    await toggle.click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile" });
    await expect(mobileNav).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(mobileNav).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.getByRole("button", { name: "Open menu" }).click();
    await mobileNav.getByRole("link", { name: /Races/ }).click();
    await expect(page).toHaveURL(/\/races$/);
    await expect(mobileNav).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("races", () => {
  test("filters update the list without a full reload", async ({ page }) => {
    await page.goto("/races");
    await markWindow(page);
    const status = page.getByRole("status").filter({ hasText: /races? found|Updating/ });
    await expect(status).toHaveText("24 races found");

    await page.getByRole("button", { name: /^IMSA/ }).click();
    await expect(status).toHaveText("8 races found");
    await expect(page).toHaveURL(/series=IMSA/);
    const titles = page.locator("article h3");
    for (const t of await titles.allInnerTexts()) expect(t).toMatch(/DAYTONA|SEBRING|GLEN|PETIT/i);

    await page.getByLabel("Season").selectOption("2027");
    await expect(status).toHaveText("4 races found");

    // Status depends on today's date, so assert consistency rather than a fixed count.
    await page.getByRole("button", { name: "Upcoming" }).click();
    await expect(page).toHaveURL(/status=upcoming/);
    await expect(status).toHaveText(/^\d+ races? found$/);
    const cards = page.locator("article");
    const count = await cards.count();
    if (count === 0) await expect(page.getByText("No races match these filters")).toBeVisible();
    for (let i = 0; i < count; i++) await expect(cards.nth(i)).toContainText("Upcoming");

    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(status).toHaveText("24 races found");
    await expect(page).toHaveURL(/\/races$/);

    await page.getByLabel("From", { exact: true }).fill("2027-06-01");
    await page.getByLabel("To", { exact: true }).fill("2027-06-30");
    await expect(status).toHaveText("2 races found");
    await expectSameWindow(page);
  });

  test("race detail shows circuit, schedule, results and a live countdown", async ({ page }) => {
    await page.goto("/races/le-mans-2026");
    await expect(page.getByRole("heading", { name: "Circuit de la Sarthe" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Session schedule" })).toBeVisible();
    await expect(page.getByRole("table").filter({ hasText: "Hyperpole" })).toBeVisible();
    await expect(page.getByRole("region", { name: /sample classification/ })).toContainText("Apex Velocita Racing");

    await page.goto("/races/le-mans-2027");
    const timer = page.getByRole("timer");
    await expect(timer).toBeVisible();
    const before = await timer.innerText();
    await page.waitForTimeout(1600);
    expect(await timer.innerText()).not.toBe(before);

    await page.getByRole("link", { name: /Next event/ }).click();
    await expect(page).toHaveURL(/watkins-glen-6-2027$/);
  });
});

test.describe("news", () => {
  test("search, category filters and pagination update dynamically", async ({ page }) => {
    await page.goto("/news");
    await markWindow(page);
    const status = page.getByRole("status").filter({ hasText: /articles?|Searching/ });
    await expect(status).toContainText("18 articles");

    await page.getByRole("navigation", { name: "Pagination" }).getByRole("button", { name: "Page 2" }).click();
    await expect(status).toContainText("page 2 of 3");
    await expect(page).toHaveURL(/page=2/);

    await page.getByLabel("Search articles").fill("hybrid");
    await expect(status).toContainText("matching “hybrid”");
    await expect(page.getByRole("heading", { name: /Inside the hybrid/ })).toBeVisible();

    await page.getByLabel("Search articles").fill("");
    await page.getByRole("button", { name: "Drivers", exact: true }).click();
    await expect(status).toContainText("3 articles");
    await expect(page).toHaveURL(/category=drivers/);
    await expectSameWindow(page);

    await page.getByRole("link", { name: /^Read more:/ }).first().click();
    await expect(page).toHaveURL(/\/news\//);
  });
});

test.describe("forms", () => {
  test("newsletter validates, subscribes and handles duplicates", async ({ page }) => {
    await page.goto("/");
    const form = page.getByRole("form", { name: "Newsletter signup" });
    await form.scrollIntoViewIfNeeded();
    const email = form.getByLabel("Email address");

    await email.fill("not-an-email");
    await form.getByRole("button", { name: "Subscribe" }).click();
    await expect(form.getByText("Enter a valid email address.")).toBeVisible();
    await expect(email).toHaveAttribute("aria-invalid", "true");

    const address = `e2e-${Date.now()}@example.com`;
    await email.fill(address);
    await form.getByRole("button", { name: "Subscribe" }).click();
    await expect(form.getByRole("status")).toContainText("You're on the grid");

    await email.fill(address.toUpperCase());
    await form.getByRole("button", { name: "Subscribe" }).click();
    await expect(form.getByRole("status")).toContainText("already subscribed");
  });

  test("contact form validates and submits", async ({ page }) => {
    await page.goto("/contact?topic=partnerships");
    const form = page.getByRole("form", { name: "Contact form" });
    await expect(form.getByLabel("Topic")).toHaveValue("partnerships");

    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByText("Name must be at least 2 characters.")).toBeVisible();
    await expect(form.getByLabel("Full name")).toBeFocused();

    await form.getByLabel("Full name").fill("E2E Tester");
    await form.getByLabel("Email").fill("e2e.tester@example.com");
    await form.getByLabel("Subject").fill("Automated test message");
    await form.getByLabel("Message").fill("This message was sent by the Playwright end-to-end test suite.");
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByRole("status")).toContainText("your message is in the pit lane");
    await expect(form.getByText(/Reference:/)).toBeVisible();
    await expect(form.getByLabel("Full name")).toHaveValue("");
  });
});

test.describe("interactions", () => {
  test("back-to-top appears after scrolling and returns to the top", async ({ page }) => {
    await page.goto("/team");
    // While hidden the button is aria-hidden and unfocusable, so it is absent from the accessibility tree.
    const hidden = page.locator('button[aria-label="Back to top"]');
    await expect(hidden).toHaveAttribute("aria-hidden", "true");
    await expect(hidden).toHaveCSS("opacity", "0");
    await page.mouse.wheel(0, 2400);
    const btn = page.getByRole("button", { name: "Back to top" });
    await expect(btn).toHaveCSS("opacity", "1");
    await btn.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("livery tabs switch with click and arrow keys", async ({ page }) => {
    await page.goto("/cars");
    const tabs = page.getByRole("tablist", { name: "Choose a livery" });
    await tabs.getByRole("tab", { name: /Alba/ }).click();
    await expect(tabs.getByRole("tab", { name: /Alba/ })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowRight");
    await expect(tabs.getByRole("tab", { name: /Tempesta/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Tempesta");
  });

  test("demo-only external links are disabled and labelled", async ({ page }) => {
    await page.goto("/contact");
    const demo = page.getByRole("link", { name: /Instagram \(demo link — not active\)/ }).first();
    await expect(demo).toHaveAttribute("aria-disabled", "true");
    expect(await demo.getAttribute("href")).toBeNull();
  });
});

test.describe("accessibility & motion", () => {
  test("skip link is the first tab stop and moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("animations are disabled when the user prefers reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const wheelAnimation = await page.locator(".avr-wheel-spin").first().evaluate((el) => getComputedStyle(el).animationName);
    expect(wheelAnimation).toBe("none");
    // Reveal never hides content under reduced motion.
    expect(await page.locator('[data-reveal="pending"]').count()).toBe(0);
  });
});

test.describe("layout", () => {
  const widths = [320, 375, 768, 1024, 1440, 1920];
  const paths = ["/", "/team", "/cars", "/races", "/races/le-mans-2026", "/news", "/news/inside-the-hybrid-system", "/contact"];

  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      const errors = trackConsoleErrors(page);
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} overflows at ${width}px`).toBe(0);
      }
      expect(errors).toEqual([]);
    });
  }
});
