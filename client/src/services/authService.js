export async function loginUser(email, password) {
  const response = await fetch(`${import.meta.env.VITE_APP_IMAGE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');

  // ✅ Save user data in localStorage
  localStorage.setItem('user', JSON.stringify(data.user));

  return data.user;
}
