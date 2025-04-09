import json
import requests

# Update based on your model name used for embedding (e.g., 'mistral:latest')
OLLAMA_MODEL = "llama3.2:latest "
CHUNK_FILE = "chunks.txt"
OUTPUT_EMBED_FILE = "embeddings.json"

def get_embedding(text):
    response = requests.post(
        "http://127.0.0.1:11434/api/embeddings",
        json={"model": OLLAMA_MODEL, "prompt": text}
    )
    response.raise_for_status()
    return response.json()["embedding"]

def main():
    embeddings = []
    with open(CHUNK_FILE, "r", encoding="utf-8") as file:
        for i, line in enumerate(file):
            text = line.strip()
            if text:
                try:
                    embedding = get_embedding(text)
                    embeddings.append({
                        "id": f"chunk_{i}",
                        "text": text,
                        "embedding": embedding
                    })
                    print(f"[✓] Embedded chunk {i}")
                except Exception as e:
                    print(f"[X] Failed to embed chunk {i}: {e}")
    
    with open(OUTPUT_EMBED_FILE, "w", encoding="utf-8") as out_file:
        json.dump(embeddings, out_file, indent=2)
        print(f"\n[✔] All embeddings saved to {OUTPUT_EMBED_FILE}")

if __name__ == "__main__":
    main()
