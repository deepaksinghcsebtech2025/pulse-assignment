import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [source, setSource] = useState("g2");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/scrape", {

        company,
        startDate,
        endDate,
        source,
      });
      setReviews(res.data.reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">📊 Pulse Review Scraper</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Company (e.g., asana)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input type="date" onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" onChange={(e) => setEndDate(e.target.value)} />

        <select onChange={(e) => setSource(e.target.value)} value={source}>
          <option value="g2">g2</option>
          <option value="capterra">Capterra</option>
          <option value="trustradius">TrustRadius</option>
        </select>

        <button onClick={handleScrape} disabled={loading}>
          {loading ? "Scraping..." : "Scrape Reviews"}
        </button>
      </div>

      <h2 className="subtitle">Results</h2>
      <div className="reviews">
        {reviews.length === 0 && <p>No reviews yet. Try scraping!</p>}
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <h3>{review.title || "Untitled Review"}</h3>
            <p className="desc">{review.description}</p>
            <p>
              <strong>⭐ {review.rating || "N/A"}</strong> |{" "}
              {review.reviewer || "Anonymous"}
            </p>
            <p className="date">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
