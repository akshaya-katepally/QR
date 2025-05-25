from transformers import pipeline

# Load the quiz generation model
quiz_generator = pipeline("text2text-generation", model="valhalla/t5-base-qg-hl")

def generate_quiz(text):
    """Generate quiz questions from the input text."""
    # Split the text into sentences
    sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 20]
    if not sentences:
        return []

    questions = []
    for sent in sentences[:5]:  # Limit to 5 quiz questions
        try:
            # Generate a question using the model
            prompt = f"highlight: {sent} context: {text}"
            output = quiz_generator(prompt, max_length=64, do_sample=False)[0]['generated_text']
            questions.append({
                "question": output,
                "correct_answer": sent,
                "options": generate_distractors(sent, sentences)
            })
        except Exception as e:
            print(f"Error generating question for sentence: {sent}\n{e}")
    return questions

def generate_distractors(correct_answer, all_sentences):
    """Generate distractor options from other sentences."""
    distractors = [s for s in all_sentences if s != correct_answer][:3]  # Limit to 3 distractors
    return distractors + [correct_answer]
