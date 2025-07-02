from flask import Flask, request, jsonify
from flask_cors import CORS

# Your existing helpers
from summarizer import generate_summary
from qna import generate_qna
from flashcards import generate_flashcards
from pdf_utils import extract_texts

# Updated quiz import
from quiz import generate_quiz

app = Flask(__name__)
CORS(app)   # Allow React to call the API from localhost:3000 or 5173, etc.

# ────────────────────────────────────────────────────────────────────────────────
# Health‑check route
# ────────────────────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return "Server is running!"

# ────────────────────────────────────────────────────────────────────────────────
# Summarizer route (unchanged)
# ────────────────────────────────────────────────────────────────────────────────
@app.route("/summarizes", methods=["POST"])
def summarize():
    files = request.files.getlist("pdf_files")
    text = request.form.get("texts", "")
    level = request.form.get("summary_level", "summary")

    full_text = extract_texts(files, text)
    summary = generate_summary(full_text, level)
    return jsonify({"summary": summary})


# ────────────────────────────────────────────────────────────────────────────────
# QnA route (unchanged)
# ────────────────────────────────────────────────────────────────────────────────
@app.route("/upload", methods=["POST"])
def qna():
    files = request.files.getlist("file")
    text = request.form.get("text", "")

    full_text = extract_texts(files, text)
    qa_pairs = generate_qna(full_text)
    return jsonify({"answers": qa_pairs})


# ────────────────────────────────────────────────────────────────────────────────
# Flashcards route (unchanged)
# ────────────────────────────────────────────────────────────────────────────────
@app.route("/uploads", methods=["POST"])
def flashcards():
    files = request.files.getlist("file")
    text = request.form.get("texts", "")

    full_text = extract_texts(files, text)
    cards = generate_flashcards(full_text)
    return jsonify({"summary": cards})


# ────────────────────────────────────────────────────────────────────────────────
# NEW & IMPROVED Quiz route
# ────────────────────────────────────────────────────────────────────────────────
@app.route("/quiz", methods=["POST"])
def quiz():
    files = request.files.getlist("file")
    text = request.form.get("text", "")
    num_questions = int(request.form.get("num_questions", 10))

    full_text = extract_texts(files, text)

    if not full_text.strip():
        return jsonify({"quiz": []}), 400

    quiz_questions = generate_quiz(full_text, num_questions)
    return jsonify({"quiz": quiz_questions})


if __name__ == "__main__":
    app.run(debug=True)


#M /usr/local/bin/python3.11 -m venv ~/venv311
#W python -m venv venv
#M source ~/venv311/bin/activate
#W .\venv\Scripts\Activate.ps1
# pip install -r requirements.txt
# python app.py