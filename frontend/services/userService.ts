import { UserDto } from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

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

const UserService = {
  authenticate,
  logout,
};

export default UserService;