const API_BASE_URL = "http://127.0.0.1:8000";

export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) {
    throw new Error("Không gọi được /health");
  }
  return res.json();
}

export async function syncMe(idToken) {
  const res = await fetch(`${API_BASE_URL}/api/auth/sync-me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Sync user thất bại");
  }

  return data;
}

export async function getMe(idToken) {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Lấy profile thất bại");
  }

  return data;
}