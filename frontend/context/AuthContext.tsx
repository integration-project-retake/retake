'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import UserService from '@/services/userService'; // Adjust path as needed
import { UserDto } from '@/types';
import Link from 'next/link';

interface AuthContextType {
  user: UserDto | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);

  const login = async (credentials: { username: string; password: string }) => {
    const authUser = await UserService.authenticate(credentials);
    setUser(authUser);
  };

  const logout = async () => {
    await UserService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default function ProfileLink() {
  const {user} = useAuth();
  if (!user) return null;
  return <Link href={`/users/${user.id}`} className="hover:underline">My Profile</Link>;
}
