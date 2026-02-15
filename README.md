# Ning Finance | Advance AI Intelligence

## 🚀 Project Overview
Ning Finance is an advanced AI intelligence news website. The platform is 99% AI-operated, auto-updating its feeds to provide users with continuous, curated news and market data across multiple sectors (Global, Asia, AI & Frontier, Luxury, and Culture).

**Live URL:** (https://ningfinance.com/)  
**Repository:** (https://github.com/brub-ai/ning-finance-website)

## 🧠 Core Features
* **Auto-Updating News Feeds:** Content is sourced and updated continuously via automated AI pipelines without requiring manual editorial oversight.
* **Intelligent Chatbot:** An integrated AI assistant with knowledge based on subscription tiers:
  * **Level 1 (Basic):** Trained on local market data and company profiles.
  * **Level 2 (Pro):** Trained on Global Markets, Forex, Crypto, and Commodities.
* **Voice Tab Navigation:** Hands-free website control via ElevenLabs. Voice commands are used strictly to navigate the DOM (e.g., switching between the News, Market Data, and Culture tabs). *Note: The voice agent operates as a navigational remote, not an audio news reader or verbal analyst.*

## 🛠 Tech Stack & Architecture
* **Frontend:** Vanilla HTML5, CSS3, ES6 JavaScript (Lightweight, no frameworks).
* **Database (CMS):** Airtable (Acts as the headless CMS for all news and content feeds).
* **Market Data Ingestion:** Custom real-time Google Sheets CSV parsing for live price action.
* **Middleware:** Make.com (Orchestrates RSS fetching, AI processing, and Webhooks).
* **AI Voice Navigation:** ElevenLabs Conversational AI (WebSDK) for client-side tab switching.
* **Chatbot LLMs:** Google Gemini 2.5 Flash and OpenAI GPT-4o via Make.com webhooks.

## 🔌 Integrations & Configuration
**1. Airtable Backend**
* `Base ID`: [REDACTED]
* `Tables`: Global News, Asia News, AI News, Commentary, Luxury, Culture

**2. Automation & Routing (Make.com)**
* `Chatbot Webhook`: [REDACTED]

**3. Voice Agent (ElevenLabs)**
* `Agent ID`: [REDACTED]

## 🚀 Deployment
1. Clone the repository: 
   `git clone https://github.com/brub-ai/ning-finance-website.git`
2. Open `index.html` in any modern browser. No build steps, dependencies, or package managers required. 

---
*Powered by BRUB AI*
