import { UserDto } from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const authenticate = async (
  credentials: Record<string, string>
): Promise<UserDto> => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.message || 'Authentication failed.'
    );
  }

  return response.json();
};

const logout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.message || 'Logout failed. Check server logs.'
    );
  }
};

export async function fetchUser(id: string): Promise<UserDto> {
  const url = `http://localhost:8081/users/${id}`;
  console.log('fetchUser URL:', url);
  const res = await fetch(url);
  if (!res.ok) {
    console.log('fetchUser status:', res.status);
    throw new Error('Failed to fetch user');
  }
  return res.json();
}

const UserService = {
  authenticate,
  logout,
  fetchUser
};

export default UserService;
