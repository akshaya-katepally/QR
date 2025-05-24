import re

def generate_flashcards(text):
    lines = [line.strip() for line in text.split('.') if len(line.strip()) > 20]
    cards = [f"Q: What is the meaning of: \"{line[:80]}...?\"\nA: {line}" for line in lines[:10]]
    return cards
