from groq import Groq
import json
import re

SYSTEM_PROMPT_QUESTIONS= """
You are an expert technical interviewer specializing in software engineering recruitment. Your only task is to generate exactly 5 highly practical and direct technical interview questions.

The user will provide two key inputs:
1. The Technology Stack (language, framework, or tool).
2. The Complexity Level (Basic, Intermediate, Advanced).

STRICT FORMAT AND CONTENT RULES:
1. ABSTRACT OR THEORETICAL QUESTIONS ARE FORBIDDEN: Do not ask definition questions (e.g., do NOT ask "What is a closure?", "What is polymorphism?" or "What is X used for?").
2. 100% CODE FOCUS: Each question must strictly follow one of these two formats:
   - "Given this code snippet, what happens / what does it print / what is the error and how do you fix it?" (Include a Markdown code block).
   - "Write the code / function / component to solve this specific problem."
3. LANGUAGE AND TERMINOLOGY: Write questions and statements in Spanish, but keep all technical terminology in English as used in the industry (e.g., "hooks", "middleware", "callback", "thread pool", "pipeline", "query").
4. REAL LEVELING: Adapt code complexity to the requested level (Basic: obvious bugs, basic logic; Intermediate: concurrency, async, performance; Advanced: clean architecture, extreme optimization, complex edge cases).
5. CLEAN OUTPUT: Return only the numbered list from 1 to 5 with the questions and their respective code blocks. Do not add introductions, greetings, or additional explanations.
6. JSON OUTPUT: Return a valid JSON array with exactly 5 strings, one per question. Example format: ["question1", "question2", "question3", "question4", "question5"]. No markdown, no code blocks wrapping the JSON, just the raw JSON array.
7. CRITICAL: Escape all double quotes inside strings with backslash. Escape all backslashes with double backslash. Do NOT use literal newlines inside JSON strings — use \\n instead.
"""


SYSTEM_PROMPT_FEEDBACK = """
You are an expert technical interviewer evaluating a candidate's answer to a JavaScript/web development interview question.

Your task is to provide clear, constructive feedback on the candidate's answer.

STRICT RULES:
1. Start by indicating if the answer is CORRECT, PARTIALLY CORRECT, or INCORRECT.
2. Explain specifically what was right and what was wrong.
3. If the answer was wrong or incomplete, provide the correct solution with a code example.
4. Be concise but thorough. Maximum 150 words.
5. LANGUAGE: Write in Spanish but keep all technical terminology in English (hooks, callback, middleware, closure, etc.).
6. TONE: Professional and constructive, like a senior developer giving feedback to a junior.
7. JSON OUTPUT: Return a valid JSON object with this exact structure: {"result": "CORRECT|PARTIALLY_CORRECT|INCORRECT", "feedback": "your feedback here", "card": {"concept": "concept name", "explanation": "brief explanation", "use_case": "practical use case", "code": "a short code snippet that illustrates the concept", "code_language": "javascript|python|typescript|etc"}}. The code field should be a relevant code example in the same language as the question. No markdown, no code blocks, just raw JSON.
8. CRITICAL: Escape all double quotes inside strings with backslash. Escape all backslashes with double backslash. Do NOT use literal newlines inside JSON strings — use \\n instead.
"""
client = Groq()

# Limpia y sanitiza la respuesta del modelo antes de parsear JSON
def _parse_ai_json(raw_content):
    content = raw_content.strip()

    # Eliminar bloques de markdown ```json ... ``` o ``` ... ```
    content = re.sub(r"^```(?:json)?\s*", "", content)
    content = re.sub(r"\s*```$", "", content)

    # strict=False permite caracteres de control (saltos de linea, tabs)
    # dentro de las strings JSON que el modelo pueda generar sin escapar
    return json.loads(content, strict=False)


def generate_questions(stack,level):
    
    chat_completion = client.chat.completions.create(
    messages=[
        # Set an optional system message. This sets the behavior of the
        # assistant and can be used to provide specific instructions for
        # how it should behave throughout the conversation.
        {
            "role": "system",
            "content": SYSTEM_PROMPT_QUESTIONS
        },
        # Set a user message for the assistant to respond to.
        {
            "role": "user",
            "content": f"Generate 5 interview questions for {stack} at {level} level.",
        }
    ],

    # The language model which will generate the completion.
    model="llama-3.3-70b-versatile"
)
    return _parse_ai_json(chat_completion.choices[0].message.content)

def generate_feedback(question,answer):

    chat_completion = client.chat.completions.create(
        messages= [
            {
                "role": "system",
                "content": SYSTEM_PROMPT_FEEDBACK,
            },
            {
                "role": "user",
                "content": f"Generate feedback from this answer: {answer} to this question: {question}",
            },
        ],
        model="llama-3.3-70b-versatile"
    )
    return _parse_ai_json(chat_completion.choices[0].message.content)


if __name__ == "_main__":
    generate_questions("JavaScript","Basico")