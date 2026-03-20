const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function parseResponse(response) {
  const text = await response.text();
  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { detail: text || "Phản hồi không hợp lệ từ server" };
  }

  if (!response.ok) {
    throw new Error(result.detail || "Yêu cầu thất bại");
  }

  return result;
}

export async function registerUser(data) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}

export async function loginUser(data) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}

export async function googleAuthCode(code) {
  const response = await fetch(`${API_BASE}/auth/google/code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  return parseResponse(response);
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return parseResponse(response);
}

export async function resetPassword(data) {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}

// hàm đổi mk = mk cũ
export async function changePassword(data) {
  const response = await fetch(`${API_BASE}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}