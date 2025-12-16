import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const TEST_USER = {
  email: `test-${Date.now()}@example.com`,
  password: "testpass123",
  name: "E2E Test User",
};

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.click("text=Products");
    await expect(page).toHaveURL(/.*products/);

    await page.click("text=Customers");
    await expect(page).toHaveURL(/.*customers/);

    await page.click("text=Orders");
    await expect(page).toHaveURL(/.*orders/);

    await page.click("text=Home");
    await expect(page).toHaveURL(BASE_URL);
  });
});

test.describe("Products", () => {
  test("should display all products", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);

    await expect(page.locator("h1")).toContainText("All Products");

    const products = page.locator(".card");
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should show product details", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);

    const firstProduct = page.locator(".card").first();
    await expect(firstProduct).toBeVisible();

    await expect(firstProduct.locator("h2")).toBeVisible();
    await expect(firstProduct.locator("p").first()).toBeVisible();
    await expect(firstProduct.getByText(/Price:/)).toBeVisible();
  });
});

test.describe("Authentication Flow", () => {
  test("should register a new customer", async ({ page }) => {
    await page.goto(`${BASE_URL}/customers/create`);

    // Fill registration form
    await page.fill('input[name="name"]', TEST_USER.name);
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to customers page
    await page.waitForURL(/.*customers/);
  });

  test("should login with valid credentials", async ({ page }) => {
    // Create a user
    const uniqueEmail = `login-test-${Date.now()}@example.com`;
    await page.goto(`${BASE_URL}/customers/create`);
    await page.fill('input[name="name"]', TEST_USER.name);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*customers/);

    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // After successful login, should redirect to home
    await page.waitForURL(BASE_URL, { timeout: 10000 });

    // Verify logout button is visible (user is logged in)
    await expect(page.getByText("Logout")).toBeVisible();
  });

  test("should show error on invalid login", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="email"]', "invalid@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.getByText(/Invalid credentials/i)).toBeVisible();
  });

  test("should logout successfully", async ({ page }) => {
    // Setup: Create and login user
    await page.goto(`${BASE_URL}/customers/create`);
    const uniqueEmail = `logout-test-${Date.now()}@example.com`;
    await page.fill('input[name="name"]', TEST_USER.name);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*customers/);

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(BASE_URL);

    // Verify logged in
    await expect(page.getByText("Logout")).toBeVisible();

    // Logout
    await page.click("text=Logout");

    // Verify logged out
    await expect(page.getByText("Login")).toBeVisible();
    await expect(page.getByText("Logout")).not.toBeVisible();
  });
});

test.describe("Protected Routes", () => {
  test("should redirect to login when accessing protected routes without auth", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/orders/`);

    await expect(page.getByText("Please log in")).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);

    // Navigation should be visible
    await expect(page.locator("nav")).toBeVisible();

    // Check if products page is usable on mobile
    await page.goto(`${BASE_URL}/products`);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should be responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);

    await expect(page.locator("nav")).toBeVisible();
  });
});

test.describe("Form Validation", () => {
  test("should validate required fields on customer registration", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/customers/create`);

    // Try to submit without filling fields
    await page.click('button[type="submit"]');

    // Check if form is still on same page (didn't submit)
    await expect(page).toHaveURL(/.*customers\/create/);
  });

  test("should validate email format", async ({ page }) => {
    await page.goto(`${BASE_URL}/customers/create`);

    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "password123");

    await page.click('button[type="submit"]');

    // HTML5 validation should catch invalid email
    await expect(page).toHaveURL(/.*customers\/create/);
  });
});

test.describe("Accessibility", () => {
  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto(`${BASE_URL}/products`);

    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCount(1); // Only one h1 per page
  });

  test("should have accessible forms", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Check for proper labels
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });
});
