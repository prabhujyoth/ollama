import os
import pdfplumber
import textwrap

SOURCE_DIR = "downloaded_pdfs"
CHUNK_SIZE = 500  # characters
CHUNKS_OUTPUT = "chunks.txt"

def extract_text_from_pdfs(folder_path):
    all_text = ""
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            path = os.path.join(folder_path, filename)
            try:
                with pdfplumber.open(path) as pdf:
                    for page in pdf.pages:
                        all_text += page.extract_text() or ''  # in case page is blank
                        all_text += "\n"
                print(f"Extracted: {filename}")
            except Exception as e:
                print(f"Failed to read {filename}: {e}")
    return all_text

def chunk_text(text, size=CHUNK_SIZE):
    return textwrap.wrap(text, width=size, break_long_words=False, replace_whitespace=False)

# Main
text = extract_text_from_pdfs(SOURCE_DIR)
chunks = chunk_text(text)

with open(CHUNKS_OUTPUT, "w", encoding="utf-8") as f:
    for chunk in chunks:
        f.write(chunk.strip() + "\n\n")

print(f"Extracted and chunked into {len(chunks)} pieces")
