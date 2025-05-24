from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def generate_summary(text, level="summary"):
    max_len = {"abstract": 60, "summary": 120, "article": 300}.get(level, 120)
    if len(text) == 0:
        return "No content to summarize."
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
    result = []
    for chunk in chunks:
        summary = summarizer(chunk, max_length=max_len, min_length=30, do_sample=False)[0]['summary_text']
        result.append(summary)
    return '\n'.join(result)
