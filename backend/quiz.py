# import json
# from groq import Groq

# class GroqQuizGenerator:
#     def __init__(self, groq_api_key, model="llama3-70b-8192"):
#         self.client = Groq(api_key=groq_api_key)
#         self.model = model

#     def build_prompt(self, context):
#         return f"""
# You are a helpful AI tutor. Create exactly 10 multiple-choice questions based on the following text.

# Each question must:
# - Have 4 options: A, B, C, D
# - Mark the correct option using "correct_answer"
# - Include a short explanation for the correct answer

# Text:
# \"\"\"{context}\"\"\"

# Respond ONLY in this JSON format:
# {{
#   "questions": [
#     {{
#       "question": "Your question here?",
#       "options": {{
#         "A": "Option A",
#         "B": "Option B",
#         "C": "Option C",
#         "D": "Option D"
#       }},
#       "correct_answer": "A",
#       "explanation": "Because ..."
#     }}
#   ]
# }}
# Only output the JSON.
# """

#     def generate_quiz(self, context):
#         prompt = self.build_prompt(context)

#         response = self.client.chat.completions.create(
#             model=self.model,
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.3,
#             max_tokens=2048,
#         )

#         output = response.choices[0].message.content.strip()
#         start = output.find('{')
#         end = output.rfind('}') + 1
#         json_str = output[start:end]

#         try:
#             quiz_data = json.loads(json_str)
#             if "questions" in quiz_data:
#                 return quiz_data["questions"]
#             else:
#                 return {"error": "Parsed JSON does not contain 'questions'."}
#         except json.JSONDecodeError as e:
#             return {"error": f"Failed to parse JSON: {e}\n\nRaw response:\n{output}"}

# # Instantiate this in your main app.py
# groq_api_key = "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"  
# quiz_generator = GroqQuizGenerator(groq_api_key)

# def generate_quiz(text):
#     return quiz_generator.generate_quiz(text)


import json
from groq import Groq

class GroqQuizGenerator:
    def __init__(self, groq_api_key: str, model: str = "llama3-70b-8192") -> None:
        self.client = Groq(api_key=groq_api_key)
        self.model = model

    # Build the prompt with a variable number of questions
    def build_prompt(self, context: str, num_questions: int = 10) -> str:
        return f"""
You are a helpful AI tutor. Create exactly {num_questions} multiple‑choice questions based on the following text.

Each question must:
- Have 4 options: A, B, C, D
- Mark the correct option using "correct_answer"
- Include a short explanation for the correct answer

Text:
\"\"\"{context}\"\"\"

Respond ONLY in this JSON format:
{{
  "questions": [
    {{
      "question": "Your question here?",
      "options": {{
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      }},
      "correct_answer": "A",
      "explanation": "Because …"
    }}
  ]
}}
Only output the JSON.
"""

    # Call the model and return a list of question dicts
    def generate_quiz(self, context: str, num_questions: int = 10):
        prompt = self.build_prompt(context, num_questions)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2048,
        )

        output = response.choices[0].message.content.strip()
        # Grab the JSON substring in case the model adds surrounding text
        json_str = output[output.find("{") : output.rfind("}") + 1]

        try:
            quiz_data = json.loads(json_str)
            return quiz_data.get("questions", [])
        except json.JSONDecodeError as err:
            return {
                "error": f"Failed to parse JSON: {err}\n\nRaw response:\n{output}"
            }


groq_api_key = "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"        # ← put your key here
quiz_generator = GroqQuizGenerator(groq_api_key)


def generate_quiz(text: str, num_questions: int = 10):
    """Return a list of question dictionaries (or an error dict)."""
    return quiz_generator.generate_quiz(text, num_questions)
