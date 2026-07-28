import os
import json
import time
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
API_KEY = os.environ.get("GEMINI_API_KEY")

if not API_KEY or API_KEY == "your_gemini_api_key_here":
    print("Error: Please set your GEMINI_API_KEY in the .env file.")
    exit(1)

# Initialize Gemini Client
genai.configure(api_key=API_KEY)

def extract_chapter_data(pdf_file_path: str, chapter_num: int):
    print(f"Uploading {pdf_file_path} to Gemini...")
    
    # Upload the file to Gemini File API
    uploaded_file = genai.upload_file(path=pdf_file_path)
    
    print(f"File uploaded successfully. URI: {uploaded_file.uri}")
    
    # Wait for the file to be processed
    print("Waiting for file to be processed by Gemini...")
    while True:
        file_info = genai.get_file(uploaded_file.name)
        if file_info.state.name == "ACTIVE":
            print("File is ready!")
            break
        elif file_info.state.name == "FAILED":
            print("File processing failed.")
            return
        time.sleep(3)
        
    print(f"Processing Chapter {chapter_num}. This may take a minute or two...")

    prompt = f"""
    You are a meticulous Chinese language teacher. 
    I have provided you with a Chinese textbook PDF. 
    Please scan the document, locate Chapter {chapter_num}, and extract ALL of the vocabulary words introduced in this specific chapter. 
    
    Output the data STRICTLY as a JSON object matching this exact schema:
    {{
      "chapter_number": {chapter_num},
      "title": "English title of chapter",
      "description": "Short description",
      "vocabulary": [
        {{
          "hanzi": "你好",
          "pinyin": "nǐ hǎo (with tone marks)",
          "meaning": "hello",
          "part_of_speech": "verb",
          "example_sentence": "",
          "example_translation": ""
        }}
      ]
    }}
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(
            [uploaded_file, prompt],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        
        # Save output to file
        output_file = f"chapter_{chapter_num}_data.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(response.text)
            
        print(f"Success! Data extracted and saved to {output_file}")
        
    except Exception as e:
        print(f"Error during generation: {e}")
        
    finally:
        # Clean up the file from Google's servers
        print("Cleaning up uploaded file...")
        genai.delete_file(uploaded_file.name)
        print("Cleanup complete.")

if __name__ == "__main__":
    pdf_path = "../Modern Chinese Textbook 1 (Taiwan).pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: Cannot find PDF at {pdf_path}")
        exit(1)
        
    chapter_to_extract = 1
    extract_chapter_data(pdf_path, chapter_to_extract)
