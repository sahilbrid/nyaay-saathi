# Nyaay Saathi

**Nyaay Saathi** is an AI-powered legal aid platform designed to provide accessible, multilingual support for common legal issues in India. The project combines advanced NLP, Retrieval Augmented Generation (RAG), and interactive mapping to empower users with case understanding, risk assessment, document generation, and connections to legal professionals.

## Features

### 1. Case Understanding via AI
- Accepts user queries as text (Hindi or English).
- Utilizes DeepSeek R1 to extract case details and classify cases (eviction, wage theft, etc.).
- Robust chatbot interface for interactive case intake.

### 2. Legal Risk Assessment & Advice
- Performs risk prediction using retrieval of similar cases from a Hugging Face legal dataset (`ninadn/indian-legal`), employing cosine similarity for matching.
- Provides step-by-step guidance (evidence collection, deadlines).
- Fetches relevant legal clauses from public databases to enhance advice.

### 3. Document Generation & Templates
- Auto-generates basic legal documents (complaint letters, dispute letters) using user-supplied details.
- Includes pre-built templates for petitions, appeals, and other common legal filings.

### 4. Multilingual Chatbot
- Supports Hindi and English for legal aid via both web and WhatsApp (powered by Twilio).
- Text-to-text interface for accessibility—no speech features included.

### 5. Lawyer & NGO Directory
- Interactive map (built with Leaflet.js) displaying pro bono lawyers and legal aid NGOs based on user location.
- Easy access to nearby legal assistance and support organizations.

## Technologies Used

- **DeepSeek R1** for natural language understanding and case classification.
- **Hugging Face Dataset** (`ninadn/indian-legal`) for retrieval-augmented advice.
- **TypeScript, Python, JavaScript** for backend and chatbot logic.
- **Twilio API** for WhatsApp integration.
- **Leaflet.js** for interactive mapping of lawyers/NGOs.
- **React, CSS, HTML** for frontend interface and templates.

## Getting Started

1. **Clone the repository**  
   `git clone https://github.com/sahilbrid/nyaay-saathi.git`

2. **Install dependencies**  
   Navigate to each service directory and run  
   `npm install` or `pip install -r requirements.txt` as appropriate.

3. **Configure environment variables**  
   - Add your Twilio credentials for WhatsApp integration.
   - Set up keys for DeepSeek R1 and Hugging Face API.

4. **Run the development servers**  
   - Frontend: `npm start`
   - Backend/Chatbot: `python app.py` or equivalent

5. **Access the platform**  
   - Web interface: Visit `http://localhost:3000`
   - WhatsApp: Add the provided Twilio number and start chatting.

## Contributing

We welcome contributions! Please open issues or submit pull requests for improvements or new features.
