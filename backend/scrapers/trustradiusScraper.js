const puppeteer = require("puppeteer");

async function scrapeTrustRadius(company, startDate, endDate) {
  const url = `https://www.trustradius.com/products/${company}/reviews`;
  console.log("🌍 TrustRadius URL:", url);

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
    console.log(`➡️ Scraping TrustRadius page ${pageNum}: ${pageUrl}`);
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
      await page.waitForSelector(".reviewCard, [data-testid='review-card']", { timeout: 10000 });
    } catch {
      console.log("⚠️ No reviews found on this page.");
      break;
    }

    const newReviews = await page.evaluate(() => {
      const items = document.querySelectorAll(".reviewCard, [data-testid='review-card']");
      return Array.from(items).map((el) => ({
        title: el.querySelector(".reviewCard__title, h3")?.innerText || "",
        description: el.querySelector(".reviewCard__body, [itemprop='reviewBody']")?.innerText || "",
        date: el.querySelector("time")?.getAttribute("datetime") || "",
        reviewer: el.querySelector(".reviewCard__authorName, .user-name")?.innerText || "Unknown",
        rating: el.querySelectorAll(".tr-Star--full, svg[data-testid='star-full']").length,
        source: "trustradius",
      }));
    });

    console.log(`📄 Page ${pageNum} reviews: ${newReviews.length}`);
    reviews.push(...newReviews);

    hasNext = await page.$("a[rel='next'], button[aria-label='Next']") !== null;
    pageNum++;
  }

  await browser.close();

  const filtered = reviews.filter(r => {
    const d = new Date(r.date);
    return !isNaN(d) && d >= new Date(startDate) && d <= new Date(endDate);
  });

  console.log(`✅ TrustRadius Reviews Fetched: ${filtered.length}`);
  return filtered;
}

module.exports = { scrapeTrustRadius };
