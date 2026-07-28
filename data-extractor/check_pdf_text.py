import fitz # PyMuPDF
import sys

def check_pdf(pdf_path):
    print(f"Opening {pdf_path}")
    doc = fitz.open(pdf_path)
    
    # Check first 20 pages
    for page_num in range(min(20, len(doc))):
        page = doc[page_num]
        text = page.get_text()
        if text.strip():
            print(f"--- Page {page_num+1} ---")
            print(text[:200]) # print first 200 chars
            print("...")
            
if __name__ == "__main__":
    check_pdf("../Modern Chinese Textbook 1 (Taiwan).pdf")
