import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Missing Supabase credentials in .env file.")
    exit(1)
import re
import supabase._sync.client as supabase_client
original_match = re.match

def fake_match(pattern, string, flags=0):
    if string and string.startswith("sb_"):
        class FakeMatch: pass
        return FakeMatch()
    return original_match(pattern, string, flags)

supabase_client.re.match = fake_match

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_chapter_data(json_file_path: str):
    print(f"Reading {json_file_path}...")
    
    if not os.path.exists(json_file_path):
        print(f"Error: File {json_file_path} not found.")
        return
        
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Uploading Chapter {data['chapter_number']} to Supabase...")
    
    # 1. We need a book ID first (assuming only 1 book for now, we'll fetch it or create it)
    book_response = supabase.table("books").select("id").limit(1).execute()
    if len(book_response.data) == 0:
        print("Creating default book...")
        new_book = supabase.table("books").insert({"title": "Modern Chinese Textbook 1", "description": "Imported from PDF"}).execute()
        book_id = new_book.data[0]['id']
    else:
        book_id = book_response.data[0]['id']
        
    # 2. Insert Chapter
    print(f"Inserting Chapter {data['chapter_number']}...")
    chapter_response = supabase.table("chapters").insert({
        "book_id": book_id,
        "chapter_number": data['chapter_number'],
        "title": data['title'],
        "description": data['description']
    }).execute()
    
    chapter_id = chapter_response.data[0]['id']
    
    # 3. Insert Vocabulary
    vocab_list = data['vocabulary']
    print(f"Inserting {len(vocab_list)} vocabulary words...")
    
    # Format for supabase
    formatted_vocab = []
    for i, word in enumerate(vocab_list):
        formatted_vocab.append({
            "chapter_id": chapter_id,
            "hanzi": word['hanzi'],
            "pinyin": word['pinyin'],
            "meaning": word['meaning'],
            "part_of_speech": word['part_of_speech'],
            "example_sentence": word['example_sentence'],
            "example_translation": word['example_translation'],
            "order_index": i
        })
        
    # Bulk insert
    supabase.table("vocabulary").insert(formatted_vocab).execute()
    
    print("Upload complete! Your web app should now display the data.")

if __name__ == "__main__":
    import glob
    
    # Find all chapter json files
    json_files = glob.glob("chapter_*_data.json")
    
    if not json_files:
        print("No chapter data files found.")
    else:
        # Sort files by chapter number
        json_files.sort(key=lambda x: int(x.split('_')[1]))
        
        for file in json_files:
            print("-" * 30)
            upload_chapter_data(file)
            
    print("-" * 30)
    print("All available chapters processed!")
