require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");

const { scrapeG2 } = require("./scrapers/g2Scraper");
const { scrapeCapterra } = require("./scrapers/capterraScraper");
const { scrapeTrustRadius } = require("./scrapers/trustradiusScraper");
const Review = require("./models/Review");

const app = express();
app.use(bodyParser.json());

// connect mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// main API
app.post("/scrape", async (req, res) => {
  const { company, startDate, endDate, source } = req.body;
  console.log("🔎 Scraping Request:", { company, startDate, endDate, source });

  try {
    let reviews = [];

    if (source === "g2") reviews = await scrapeG2(company, startDate, endDate);
    else if (source === "capterra") reviews = await scrapeCapterra(company, startDate, endDate);
    else if (source === "trustradius") reviews = await scrapeTrustRadius(company, startDate, endDate);
    else return res.status(400).json({ error: "invalid source" });

    console.log("✅ Total Reviews Fetched:", reviews.length);

    if (reviews.length > 0) {
      await Review.insertMany(reviews);
      fs.writeFileSync("reviews.json", JSON.stringify(reviews, null, 2));
    }

    res.json({ count: reviews.length, reviews });
  } catch (err) {
    console.error("❌ Scraping failed:", err);
    res.status(500).json({ error: "scraping failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
