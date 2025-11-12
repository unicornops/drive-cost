import { test, expect } from "@playwright/test";

test("main flow: calculate diesel vs electric cost and savings (JS)", async ({
  page,
}) => {
  // Constants must match the app logic
  const LITRES_PER_UK_GALLON = 4.54609;
  const KM_PER_MILE = 1.60934;

  // Navigate to the app root (Playwright will start the preview server via config.webServer)
  await page.goto("/");

  // Fill inputs using placeholders present in the app's inputs
  // There are multiple numeric inputs; target them by their unique placeholders used in the app.
  await page.fill('input[placeholder="100"]', "100"); // distance (miles)
  await page.fill('input[placeholder="45.0"]', "45"); // MPG (fuel efficiency)
  await page.fill('input[placeholder="1.45"]', "1.45"); // cost per litre
  await page.fill('input[placeholder="15.5"]', "15.5"); // kWh per 100km
  await page.fill('input[placeholder="0.28"]', "0.28"); // cost per kWh

  // Wait for the cost comparison section to be visible
  await page.waitForSelector("text=Cost Comparison");

  // Locate the cost values in the comparison section using more specific selectors
  // The comparison section has a grid with three cards showing the costs
  const comparisonSection = page.locator(
    'div:has(> h3:text("Cost Comparison"))',
  );

  // Get the specific cards within the comparison grid (direct children of the grid)
  const dieselComparisonCard = comparisonSection
    .locator(".grid > div")
    .filter({ hasText: "Diesel/Petrol" })
    .first();
  const electricComparisonCard = comparisonSection
    .locator(".grid > div")
    .filter({ hasText: "Electric" })
    .first();

  await expect(dieselComparisonCard).toBeVisible();
  await expect(electricComparisonCard).toBeVisible();

  // Get the cost values (second <p> in each card)
  const dieselValueLocator = dieselComparisonCard.locator("p").nth(1);
  const electricValueLocator = electricComparisonCard.locator("p").nth(1);

  await expect(dieselValueLocator).toBeVisible();
  await expect(electricValueLocator).toBeVisible();

  const dieselText = ((await dieselValueLocator.textContent()) || "").trim();
  const electricText = (
    (await electricValueLocator.textContent()) || ""
  ).trim();

  // Parse numeric values (strip currency/symbols if any)
  const dieselDisplayed = parseFloat(dieselText.replace(/[^\d.-]/g, ""));
  const electricDisplayed = parseFloat(electricText.replace(/[^\d.-]/g, ""));

  // Recompute expected values using the same formulas as the app
  const distanceMiles = 100;
  const mpg = 45;
  const pricePerLitre = 1.45;

  // Diesel litres needed = (miles / mpg) * litresPerGallon (UK gallon default in app)
  const litresNeeded = (distanceMiles / mpg) * LITRES_PER_UK_GALLON;
  const dieselExpected = litresNeeded * pricePerLitre;

  // Electric:
  const distanceKm = distanceMiles * KM_PER_MILE;
  const kwhPer100km = 15.5;
  const pricePerKwh = 0.28;
  const kwhNeeded = (distanceKm / 100) * kwhPer100km;
  const electricExpected = kwhNeeded * pricePerKwh;

  // Sanity checks: displayed values should be close to expected (2 decimal places)
  expect(Number.isFinite(dieselDisplayed)).toBe(true);
  expect(Number.isFinite(electricDisplayed)).toBe(true);

  // Use toBeCloseTo-like assertion via numeric difference tolerance
  const closeEnough = (a, b, dp = 2) =>
    Math.abs(a - b) < Math.pow(10, -dp) * Math.max(1, Math.abs(b));

  if (!closeEnough(dieselDisplayed, dieselExpected, 2)) {
    throw new Error(
      `Diesel value mismatch: displayed=${dieselDisplayed} expected=${dieselExpected}`,
    );
  }
  if (!closeEnough(electricDisplayed, electricExpected, 2)) {
    throw new Error(
      `Electric value mismatch: displayed=${electricDisplayed} expected=${electricExpected}`,
    );
  }

  // Check savings card shows the absolute difference and optionally the percentage
  const savingsCard = comparisonSection
    .locator(".grid > div")
    .filter({ hasText: /You Save|Extra Cost/i })
    .first();
  await expect(savingsCard).toBeVisible();

  const savingsValueLocator = savingsCard.locator("p").nth(1);
  await expect(savingsValueLocator).toBeVisible();

  const savingsText = ((await savingsValueLocator.textContent()) || "").trim();
  const savingsDisplayed = parseFloat(savingsText.replace(/[^\d.-]/g, ""));

  const savingsExpected = Math.abs(dieselExpected - electricExpected);

  if (!closeEnough(savingsDisplayed, savingsExpected, 2)) {
    throw new Error(
      `Savings mismatch: displayed=${savingsDisplayed} expected=${savingsExpected}`,
    );
  }

  // If percentage text exists, validate it roughly
  const percentageLocator = savingsCard.locator("p").filter({ hasText: "%" });
  if ((await percentageLocator.count()) > 0) {
    const pctText = (await percentageLocator.first().textContent()) || "";
    const pctMatch = pctText.match(/([\d.]+)\s*%/);
    if (pctMatch) {
      const pctDisplayed = parseFloat(pctMatch[1]);
      const pctExpected = (savingsExpected / dieselExpected) * 100;
      if (!closeEnough(pctDisplayed, pctExpected, 1)) {
        throw new Error(
          `Percentage mismatch: displayed=${pctDisplayed} expected=${pctExpected}`,
        );
      }
    }
  }
});
