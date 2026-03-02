import io
from PyPDF2 import PdfReader
from docx import Document

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """
    Extract text from uploaded PDF or DOCX file content.
    """
    ext = filename.split('.')[-1].lower()
    
    if ext == 'pdf':
        return extract_text_from_pdf(file_content)
    elif ext == 'docx':
        return extract_text_from_docx(file_content)
    else:
        raise ValueError(f"Unsupported file format: {ext}")

def extract_text_from_pdf(file_content: bytes) -> str:
    pdf_reader = PdfReader(io.BytesIO(file_content))
    text = ""
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()

def extract_text_from_docx(file_content: bytes) -> str:
    doc = Document(io.BytesIO(file_content))
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text.strip()
