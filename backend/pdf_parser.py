import pdfplumber
import os

def extract_text_from_pdf(filepath: str) -> str:
    """Extract all text from a locally saved PDF file."""
    text = ""
    try:
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\\n"
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
    return text
