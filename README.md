Perfect 👍 Let’s add a README.md to your project root (pulse-assignment/) before pushing to GitHub.

Here’s a good starting point for your Pulse Coding Assignment repo:

⸻

📄 README.md

# 📊 Pulse Coding Assignment — SaaS Reviews Scraper

This project is a full-stack solution for scraping SaaS product reviews from **G2**, **Capterra**, and **GetApp**.  
It accepts company name, date range, and source as inputs, scrapes reviews with pagination, and outputs JSON.  
Reviews are stored in **MongoDB Atlas** and can be viewed through a **React frontend**.

---

## 🚀 Features
- Scrapes reviews from **G2**, **Capterra**, and **GetApp** (bonus).
- Input parameters:
  - `company` → company/product name
  - `start`, `end` → date range (`YYYY-MM-DD`)
  - `source` → review source (`g2`, `capterra`, `getapp`)
- Outputs JSON with:
  - `title`, `review`, `date`, `rating`, `reviewer_name`, etc.
- Handles **pagination** & **date filtering**.
- Robust error handling and retries.
- MongoDB Atlas integration for persistence.
- React frontend UI to run scrapes and view results.

---

## 🛠 Tech Stack
- **Backend** → Node.js, Express, Playwright, Cheerio, Mongoose
- **Database** → MongoDB Atlas
- **Frontend** → React (Vite) + Axios

---

## ⚡ Quickstart

### 1. Clone Repo
```bash
git clone https://github.com/deepaksinghcsebtech2025/pulse-assignment.git
cd pulse-assignment

2. Backend Setup

cd backend
npm install
npx playwright install chromium
cp .env.example .env   # update MONGO_URI with your Atlas URI
npm start

3. Frontend Setup

cd ../frontend
npm install
npm run dev

Open 👉 http://localhost:5173

⸻

📌 Example API Usage

curl -X POST http://localhost:8000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"company":"Notion","start":"2024-01-01","end":"2024-12-31","source":"g2"}'


⸻

📂 Project Structure

pulse-assignment/
├── backend/        # Node.js + Express + Playwright
│   ├── models/
│   ├── scrapers/
│   └── server.js
├── frontend/       # React (Vite) frontend
└── README.md


⸻

⚠️ Notes
	•	Keep your .env secret (don’t commit credentials).
	•	For production, configure IP whitelist + DB users in MongoDB Atlas.
	•	Respect G2/Capterra/GetApp Terms of Service when scraping.

⸻

📄 License

MIT

---

👉 Steps to add this to your repo:

```bash
cd ~/Desktop/pulse-assignment
nano README.md   # paste the content above, save & exit
git add README.md
git commit -m "Added project README"
git push origin main


⸻

Do you want me to also generate a .gitignore file for you (so you don’t accidentally push node_modules and .env)?
