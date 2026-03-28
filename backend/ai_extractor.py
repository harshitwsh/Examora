import os
import json
import google.generativeai as genai
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Check for GEMINI_API_KEY, fallback to OPENAI_API_KEY since you might have pasted it there
api_key = os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("OPENAI_API_KEY", "").strip()

if api_key:
    genai.configure(api_key=api_key)

def extract_events_from_text(text: str) -> List[dict]:
    if not api_key:
        raise ValueError("Gemini API Key is missing! Please configure GEMINI_API_KEY in your backend/.env file.")

    # Using gemini-2.5-flash for the latest API compatibility
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    prompt = f"""
    You are an AI assistant that extracts academic events and dates from course syllabi or handouts.
    Extract all important academic dates such as exams, assignments, quizzes, and project deadlines. 
    Also note any weightage (like 10%, 50 points, etc.) of quizzes or presentations inside the event name if mentioned.

    Format the response strictly as a JSON object containing a single key "events" which is an array of objects.
    Each object in the "events" array must exactly match this structure:
    {{
        "event": "name of the event (include weightage if mentioned)",
        "date": "YYYY-MM-DD if an exact date is given, otherwise write EXACTLY what the syllabus says (e.g. 'According to university calendar', 'TBD', 'Week 4'). Do not guess or invent dates.",
        "category": "category type (e.g., 'Exam', 'Assignment', 'Quiz', 'Project', 'Lecture', 'Other')"
    }}

    If a date is given as a format (e.g. October 12) without the year, assume the current academic year.
    If no specific date is found, please just extract the descriptive text from the syllabus without inventing one.

    Text extracted from the syllabus:
    {text}
    """

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        
        reply = response.text
        if reply:
             parsed = json.loads(reply)
             events = parsed.get("events", [])
             return events
        return []

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raise ValueError(f"Gemini extraction failed: {str(e)}")
