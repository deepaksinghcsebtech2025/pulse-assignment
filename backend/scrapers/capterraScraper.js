const puppeteer = require("puppeteer");

async function scrapeCapterra(productId, startDate, endDate) {
  const url = `https://www.capterra.com/p/${productId}/reviews/`;
  console.log("🌍 Capterra URL:", url);

  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS === "true",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );

  let reviews = [];
  let pageNum = 1;
  let hasNext = true;

  while (hasNext) {
    const pageUrl = `${url}?page=${pageNum}`;
    console.log(`➡️ Scraping Capterra page ${pageNum}: ${pageUrl}`);
    await page.goto(pageUrl, { waitUntil: "networkidle2", timeout: 60000 });

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 250);
      });
    });

    await new Promise(r => setTimeout(r, 4000));

    try {
      await page.waitForSelector("[data-review-id], article", { timeout: 10000 });
    } catch {
      console.log("⚠️ No reviews found on this page.");
      break;
    }

    const newReviews = await page.evaluate(() => {
      const items = document.querySelectorAll("[data-review-id], article");
      return Array.from(items).map((el) => ({
        title: el.querySelector("h3, .reviewCard__title")?.innerText || "",
        description: el.querySelector("[itemprop='reviewBody'], .reviewCard__review")?.innerText || "",
        date: el.querySelector("time")?.getAttribute("datetime") || "",
        reviewer: el.querySelector(".reviewerName, .reviewCard__reviewerName")?.innerText || "Unknown",
        rating: el.querySelectorAll("svg[data-testid='star-full'], .icon-starFull").length,
        source: "capterra",
      }));
    });

    console.log(`📄 Page ${pageNum} reviews: ${newReviews.length}`);
    reviews.push(...newReviews);

    hasNext = await page.$("a[aria-label='Next'], button[aria-label='Next']") !== null;
    pageNum++;
  }

  await browser.close();

  const filtered = reviews.filter(r => {
    const d = new Date(r.date);
    return !isNaN(d) && d >= new Date(startDate) && d <= new Date(endDate);
  });

  console.log(`✅ Capterra Reviews Fetched: ${filtered.length}`);
  return filtered;
}

module.exports = { scrapeCapterra };
