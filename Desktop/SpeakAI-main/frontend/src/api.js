const API_BASE = "http://127.0.0.1:8000/api/v1/chat";

export async function sendTextChat(message, useRag = false) {
  const formData = new URLSearchParams();
  formData.append("message", message);
  formData.append("use_rag", String(useRag));

  const response = await fetch(`${API_BASE}/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Text chat failed");
  }

  return data;
}

const API_VOICE = "http://127.0.0.1:8000/api/v1/chat";
export async function sendVoiceChat(file, useRag = false) {
  const formData = new FormData();
  formData.append("audio", file);
  formData.append("use_rag", String(useRag));

  const response = await fetch(`${API_VOICE}/voice`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : JSON.stringify(data.detail || data)
    );
  }

  return data;
}

export async function getRagCollections() {
  const response = await fetch(`${API_BASE}/rag/collections`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Load collections failed");
  }

  return data;
}

export async function searchRag(query, collection) {
  const params = new URLSearchParams({
    query,
    collection,
  });

  const response = await fetch(`${API_BASE}/rag/search?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "RAG search failed");
  }

  return data;
}

export async function addRagDoc(collection, text) {
  const response = await fetch(`${API_BASE}/rag/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collection,
      text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Add RAG doc failed");
  }

  return data;
}