import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.SKYNOTE_URL ?? 'http://127.0.0.1:5173/';
const widths = [360, 390, 430];

await mkdir('artifacts', { recursive: true });

let browser;

try {
  browser = await chromium.launch({ headless: true });
} catch (error) {
  console.error('Unable to launch Playwright Chromium. Run `npx playwright install chromium` and retry.');
  console.error(error.message);
  process.exit(1);
}

const results = [];

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: 820 },
    deviceScaleFactor: 2,
    isMobile: true,
  });

  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '疲惫' }).click();
  await page.getByRole('button', { name: '雨' }).click();
  await page.getByPlaceholder('写一句今天想留住的话...').fill('今天下雨，但把心情写下来之后轻了一点。');
  await page.getByRole('button', { name: '保存一条' }).click();
  await page.getByRole('button', { name: '回顾' }).click();
  await page.getByText('今天下雨').first().click();
  await page.getByRole('button', { name: '返回' }).click();
  await page.getByRole('button', { name: '趋势' }).click();
  await page.getByRole('button', { name: '设置' }).click();

  const overflow = await page.evaluate(() => {
    const offenders = [...document.querySelectorAll('body *')]
      .filter((el) => el.scrollWidth > el.clientWidth + 1)
      .slice(0, 8)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        className: el.className,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));

    return {
      bodyScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      offenders,
    };
  });

  await page.screenshot({
    path: `artifacts/skynote-${width}.png`,
    fullPage: true,
  });

  results.push({ width, consoleErrors, overflow });
  await page.close();
}

await browser.close();

const failures = results.filter(
  (result) =>
    result.consoleErrors.length > 0 ||
    result.overflow.bodyScrollWidth > result.overflow.viewportWidth + 1 ||
    result.overflow.offenders.length > 0,
);

console.log(JSON.stringify(results, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
