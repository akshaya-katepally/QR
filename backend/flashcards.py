from transformers import pipeline, AutoTokenizer

# Use a high-quality model that can follow instructions
model_name = "google/flan-t5-large"
flashcard_generator = pipeline("text2text-generation", model=model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

def chunk_text(text, max_tokens=450):
    """Split text into token-safe chunks for processing."""
    words = text.split()
    chunks, current_chunk = [], []

    for word in words:
        current_chunk.append(word)
        if len(tokenizer(' '.join(current_chunk))['input_ids']) > max_tokens:
            current_chunk.pop()
            chunks.append(' '.join(current_chunk))
            current_chunk = [word]

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks

def generate_flashcards(text):
    if not text.strip():
        return ["No input text provided."]

    chunks = chunk_text(text)
    flashcards = []

    for i, chunk in enumerate(chunks[:3]):  # limit to first 3 chunks
        prompt = (
            "You are a flashcard generator.\n"
            "Create 2 study flashcards from the text below.\n"
            "Each flashcard must follow this format exactly:\n\n"
            "Q: <question>\nA: <answer>\n\n"
            "Text:\n" + chunk.strip()
        )

        try:
            response = flashcard_generator(prompt, max_length=512, do_sample=False)[0]['generated_text']
            print("=== RAW OUTPUT ===")
            print(response)

            lines = response.strip().splitlines()
            q, a = '', ''
            for line in lines:
                if line.lower().startswith("q:") or line.lower().startswith("question:"):
                    if q and a:
                        flashcards.append(f"Q: {q}\nA: {a}")
                    q = line.split(":", 1)[1].strip()
                    a = ''
                elif line.lower().startswith("a:") or line.lower().startswith("answer:"):
                    a = line.split(":", 1)[1].strip()

            if q and a:
                flashcards.append(f"Q: {q}\nA: {a}")
                
        except Exception as e:
            flashcards.append(f"[Error generating flashcards from chunk {i+1}: {str(e)}]")

    return flashcards[:10] if flashcards else ["No flashcards could be generated."]
