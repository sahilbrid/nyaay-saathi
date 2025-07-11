# 🏛️ Nyaayसाथी – The AI Legal Aid Advisor

Empowering underserved communities in India with AI-driven legal support.

---

## 📖 Overview

**Nyaayसाथी** is an AI-powered legal aid platform designed to assist low-income individuals in navigating complex legal issues such as evictions, wage theft, and domestic disputes. It provides multilingual chatbot support, legal risk assessment, document generation, and connects users with pro bono lawyers and NGOs.

---

<img width="480" height="480" alt="image" src="https://github.com/user-attachments/assets/66b443b6-b216-4752-97d5-d2889d4ecb0c" />
<img width="480" height="480" alt="image" src="https://github.com/user-attachments/assets/503f6caf-9682-4144-8413-4183ae1623d6" />

---

<img width="480" height="480" alt="image" src="https://github.com/user-attachments/assets/55151f2c-f1cc-4792-b0f1-8bd86f7b795b" />
<img width="480" height="480" alt="image" src="https://github.com/user-attachments/assets/fb427142-fdf1-4f1a-bcac-4ac6e4b76126" />

---

## 🚀 Features

### 1️⃣ Case Understanding via AI

* Accepts **text inputs** (supports Hindi & English).
* Uses **DeepSeek R1** for analyzing case details and understanding user intent.
* Classifies cases into categories like:

  * Eviction
  * Wage Theft
  * Domestic Violence
  * Child Custody
  * And more.

### 2️⃣ Legal Risk Assessment & Guidance

* **Retrieval-Augmented Generation (RAG):**

  * Retrieves similar past cases from [Hugging Face dataset `ninadn/indian-legal`](https://huggingface.co/datasets/ninadn/indian-legal).
  * Computes similarity using **cosine similarity**.
* Provides:

  * Risk prediction based on retrieved cases.
  * Step-by-step guidance on evidence collection and deadlines.
  * Fetches relevant legal clauses from public databases.

### 3️⃣ Document Generation & Templates

* Auto-generates legal documents (e.g., complaint letters, eviction notices).
* Provides pre-built templates for petitions, appeals, and dispute letters.
* Templates are dynamically filled using user-provided case details.

### 4️⃣ Multilingual Chatbot

* Chatbot available on:

  * **WhatsApp** (via Twilio API)
  * **Web App** (React frontend)
* Supports **Hindi** and **English**.
* Simplifies legal queries with user-friendly responses.

### 5️⃣ Lawyer & NGO Directory

* Uses **Leaflet.js** to display nearby pro bono lawyers and legal aid NGOs on an interactive map.
* Helps users locate free legal support in their vicinity.

---

## 🏗️ Tech Stack

| Layer             | Tools/Frameworks                         |
| ----------------- | ---------------------------------------- |
| **Frontend**      | React.js, Leaflet.js                     |
| **Backend**       | Python, Flask                          |
| **AI/NLP Models** | DeepSeek R1, Hugging Face Transformers   |
| **RAG & Search**  | Cosine Similarity, Hugging Face Datasets |
| **Messaging**     | Twilio API (WhatsApp Integration)        |
| **Mapping**       | Leaflet.js                               |

---

## 📊 Market Opportunity & Impact

* **Target Audience**: Low-income individuals, migrant workers, underserved communities.
* **Impact**: Bridges the access-to-justice gap by empowering users to:

  * Understand their legal rights.
  * Take action with AI-assisted documentation.
  * Connect with free legal services.

---

## 📦 Installation

### Backend Setup

```bash
git clone https://github.com/<your-username>/NyaaySathi.git
cd NyaaySathi/backend
python app.py
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

### Configure WhatsApp

* Setup Twilio credentials in `.env` file.

---

## ✨ Acknowledgements

* [Hugging Face](https://huggingface.co)
* [DeepSeek](https://deepseek.com)
* [Twilio](https://www.twilio.com)
* [Leaflet.js](https://leafletjs.com)

---

> 🔗 "Empowering Mumbai’s underserved with AI-driven legal support" – Nyaayसाथी
