import { UserDto } from "../types";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL_INTERNAL || "http://localhost:8080"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// forgive me for my sins

const authenticate = async (
  credentials: Record<string, string>,
): Promise<UserDto> => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(error?.message || "Authentication failed.");
  }

  return response.json();
};

const register = async (input: Record<string, string>): Promise<UserDto> => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(error?.message || "Registration failed.");
  }

  return response.json();
};

const logout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(error?.message || "Logout failed. Check server logs.");
  }
};

const getCurrentUser = async (): Promise<UserDto | null> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch current user.");
  }

  return response.json();
};

export async function fetchUser(id: string): Promise<UserDto> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

const UserService = {
  authenticate,
  register,
  logout,
  getCurrentUser,
  fetchUser,
};

export default UserService;
