const puppeteer = require("puppeteer");

async function scrapeG2(company, startDate, endDate) {
  const url = `https://www.g2.com/products/${company}/reviews`;
  console.log("🌍 G2 URL:", url);

  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS === "true",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );

  let allReviews = [];

  // ✅ Intercept network responses
  page.on("response", async (response) => {
    try {
      const reqUrl = response.url();
      if (reqUrl.includes("/products/") && reqUrl.includes("/reviews.json")) {
        const data = await response.json();
        if (data && data.reviews) {
          const formatted = data.reviews.map(r => ({
            title: r.review_headline || "",
            description: r.review_text || "",
            date: r.created_at || "",
            reviewer: r.user?.display_name || "Unknown",
            rating: r.rating || 0,
            source: "g2",
          }));
          allReviews.push(...formatted);
        }
      }
    } catch (err) {
      // ignore parsing errors
    }
  });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise(r => setTimeout(r, 10000)); // wait for XHR calls

  await browser.close();

  // ✅ Date filter
  const filtered = allReviews.filter(r => {
    const d = new Date(r.date);
    return !isNaN(d) && d >= new Date(startDate) && d <= new Date(endDate);
  });

  console.log(`✅ G2 Reviews Fetched: ${filtered.length}`);
  return filtered;
}

module.exports = { scrapeG2 };
