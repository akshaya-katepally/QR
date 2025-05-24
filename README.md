# Quick Recap

**Quick Recap** is a full-stack AI-powered app that allows users to:
- Summarize documents or pasted text
- Generate Question-Answer (QnA) pairs
- Generate study-friendly Flashcards

It supports multiple file formats including PDF, DOCX, PPTX, XLSX, TXT, and even image files (via OCR). Built with a React frontend and a Flask backend powered by Hugging Face models.

---

## Project Structure

<pre> 📁 <strong>QuickRecap/</strong> ├── 📦 <strong>frontend/</strong> # React frontend │ ├── 📁 public/ │ └── 📁 src/ │ ├── 📄 App.js │ ├── 📄 App.css │ ├── 📄 index.js │ ├── 📄 index.css │ └── 📁 components/ │ ├── 📄 Header.js │ ├── 📄 Summarizer.js │ ├── 📄 QnAGenerator.js │ └── 📄 Flashcards.js │ └── 📦 <strong>backend/</strong> # Flask backend ├── 📄 app.py ├── 📄 summarizer.py ├── 📄 qna.py ├── 📄 flashcards.py ├── 📄 pdf_utils.py └── 📄 requirements.txt </pre>


---

## Features

- Summarize documents with selectable depth (`abstract`, `summary`, `article`)
- Automatically generate QnA pairs from content
- Create flashcards for spaced repetition learning
- Supports:
  - PDF
  - DOCX (Word)
  - PPTX (PowerPoint)
  - XLSX (Excel)
  - TXT (Text files)
  - Images (JPG/PNG with OCR)
- Combine uploaded files with manually entered text

---

## Setup Instructions

### 1. Clone the Repository
git clone https://github.com/yourusername/quickrecap.git
cd quickrecap

###  2. Set Up the Backend
- cd backend
- python3 -m venv venv
- source venv/bin/activate  # On Windows: venv\Scripts\activate
- pip install -r requirements.txt

Make sure you have Tesseract installed for image OCR:
#### macOS
brew install tesseract
#### Ubuntu
sudo apt install tesseract-ocr
#### Windows
- Download the Tesseract installer from:
👉 https://github.com/tesseract-ocr/tesseract/wiki
- Direct link to latest release (e.g. 5.3.3):
👉 https://github.com/UB-Mannheim/tesseract/wiki
- Run the installer and during installation select "Add Tesseract to PATH"
- Verify installation:
tesseract --version

- Then run the backend:
- python app.py
The backend will run on: http://localhost:5000

### 3. Set Up the Frontend
- cd ../frontend
- npm install
- npm start
The frontend will be available at: http://localhost:3000

---

### Tech Stack
- Frontend: React.js
- Backend: Flask + Flask-CORS
- NLP Models: Hugging Face Transformers (facebook/bart-large-cnn, valhalla/t5-base-qg-hl)
- PDF/Text Parsing: PyMuPDF, python-docx, python-pptx, openpyxl, pytesseract

---

### Screenshots
Coming soon...

---

### TODO
- Add export to PDF
- Add drag-and-drop UI
- Add user login to save recaps
- Option to choose model

---

### Acknowledgments
- Hugging Face for powerful transformer models
- PyMuPDF, pytesseract, and friends for document handling
