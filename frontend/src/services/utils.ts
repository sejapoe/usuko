export async function getCurrentUser() {
  const response = await fetch('/api/user');
  console.log(response);
  return await response.json();
}

export async function login(form: object): Promise<Response> {
  return await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });
}
export async function logout(): Promise<Response> {
  return await fetch('/api/auth/logout');
}
