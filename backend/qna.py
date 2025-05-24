from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# Load the question generation model
tokenizer = AutoTokenizer.from_pretrained("valhalla/t5-base-qg-hl")
model = AutoModelForSeq2SeqLM.from_pretrained("valhalla/t5-base-qg-hl")

def generate_qna(text):
    # Highlight sentence for QG
    sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 20]
    if not sentences:
        return []

    results = []
    for sentence in sentences[:5]:  # Limit to avoid slowdowns
        input_text = f"highlight: {sentence} context: {text}"
        inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
        outputs = model.generate(inputs, max_new_tokens=64)
        question = tokenizer.decode(outputs[0], skip_special_tokens=True)
        results.append({
            "question": question,
            "answer": sentence
        })
    return results
