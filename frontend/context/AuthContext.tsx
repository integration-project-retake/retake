'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import UserService from '@/services/userService';
import type { UserDto } from '@/types';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;

  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<UserDto | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser =
          await UserService.getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        console.error(
          'Failed to restore authentication session:',
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials: {
    username: string;
    password: string;
  }) => {
    const authUser =
      await UserService.authenticate(
        credentials
      );

    setUser(authUser);
  };

  const logout = async () => {
    await UserService.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};

export default function ProfileLink() {
  const {
    user,
    loading,
  } = useAuth();

  if (
    loading ||
    !user
  ) {
    return null;
  }

  return (
    <Link
      href={`/users/${user.id}`}
      className="hover:underline"
    >
      My Profile
    </Link>
  );
}