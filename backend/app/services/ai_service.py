from groq import Groq
import json

SYSTEM_PROMPT= """
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
"""
client = Groq()

def generate_questions(stack,level):
    
    chat_completion = client.chat.completions.create(
    messages=[
        # Set an optional system message. This sets the behavior of the
        # assistant and can be used to provide specific instructions for
        # how it should behave throughout the conversation.
        {
            "role": "system",
            "content": SYSTEM_PROMPT
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
    return json.loads(chat_completion.choices[0].message.content)

def generate_feedback(question,answer):
    return


if __name__ == "_main__":
    generate_questions("JavaScript","Basico")