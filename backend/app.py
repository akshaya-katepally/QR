from flask import Flask, request, jsonify
from flask_cors import CORS
from summarizer import generate_summary
from qna import generate_qna
from flashcards import generate_flashcards
from pdf_utils import extract_texts

app = Flask(__name__)
CORS(app)

@app.route('/summarizes', methods=['POST'])
def summarize():
    files = request.files.getlist('pdf_files')
    text = request.form.get('texts', '')
    level = request.form.get('summary_level', 'summary')
    
    full_text = extract_texts(files, text)
    summary = generate_summary(full_text, level)
    return jsonify({'summary': summary})

@app.route('/upload', methods=['POST'])
def qna():
    files = request.files.getlist('file')
    text = request.form.get('text', '')
    
    full_text = extract_texts(files, text)
    qa_pairs = generate_qna(full_text)
    return jsonify({'answers': qa_pairs})

@app.route('/uploads', methods=['POST'])
def flashcards():
    files = request.files.getlist('file')
    text = request.form.get('texts', '')
    
    full_text = extract_texts(files, text)
    cards = generate_flashcards(full_text)
    return jsonify({'summary': cards})

if __name__ == '__main__':
    app.run(debug=True)



# /usr/local/bin/python3.11 -m venv ~/venv311
# source ~/venv311/bin/activate
# pip install -r requirements.txt