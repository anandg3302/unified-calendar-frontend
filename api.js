const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export const registerUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};
