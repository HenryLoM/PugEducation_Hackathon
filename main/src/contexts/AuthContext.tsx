import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { setProfile } from '../localBackend';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  createdAt: string;
  bio?: string;
  google_registered?: number;
  notifications_enabled: number;
  achievements: string;
  level: number;
  learning_progress?: string;
  pet_stats?: Record<string, any>;
  settings?: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, nickname: string, password: string, google_registered?: number) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  editProfile: (profile: { name: string; avatar?: string; bio?: string; google_registered?: number; achievements?: string; level?: number; learning_progress?: string }) => void;
  changePassword: (newPassword: string) => Promise<void>;
  updateNotifications: (enabled: boolean) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from cookie if present
    const cookieUser = Cookies.get('taa_user');
    if (cookieUser) {
      try {
        const parsed = JSON.parse(cookieUser);
        setUser(parsed);
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error('Неверный email или пароль');
      }
      const data = await res.json();

      // Sync settings and pet stats to localStorage
      if (data.settings) {
        Object.entries(data.settings).forEach(([key, value]) => {
          localStorage.setItem(String(key), String(value));
        });
      }
      if (data.pet_stats) {
        if (data.pet_stats.name) localStorage.setItem('petName', data.pet_stats.name);
        if (data.pet_stats.hunger !== undefined) localStorage.setItem('petHunger', String(data.pet_stats.hunger));
        if (data.pet_stats.mood !== undefined) localStorage.setItem('petMood', String(data.pet_stats.mood));
        if (data.pet_stats.xp !== undefined) localStorage.setItem('petXP', String(data.pet_stats.xp));
        if (data.pet_stats.level !== undefined) localStorage.setItem('petLevel', String(data.pet_stats.level));
      }

      // Fetch notifications setting
      const notifRes = await fetch(`http://localhost:8000/notifications/${data.id}`);
      let notifications_enabled = 1;
      if (notifRes.ok) {
        const n = await notifRes.json();
        notifications_enabled = typeof n.enabled === 'number' ? n.enabled : 1;
      }

      const userObj = {
        id: String(data.id),
        email: data.email,
        nickname: data.nickname,
        avatar: '',
        bio: data.bio,
        google_registered: data.google_registered,
        notifications_enabled,
        achievements: data.achievements,
        level: data.level,
        createdAt: new Date().toISOString(),
        settings: data.settings || {},
        pet_stats: data.pet_stats || {},
      };
      setUser(userObj);
      Cookies.set('taa_user', JSON.stringify(userObj), { expires: 7 });
      // Optionally, trigger pet context update here if needed
    } catch (err: any) {
      alert(err.message || 'Ошибка входа');
    }
  };

  const register = async (email: string, nickname: string, password: string) => {
    const res = await fetch('http://localhost:8000/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nickname, password, bio: '', google_registered: 0 }),
    });
    if (res.ok) {
      const userId = await res.json();
      const userObj = {
        id: String(userId),
        email,
        nickname,
        avatar: '',
        bio: '',
        google_registered: 0,
        notifications_enabled: 1,
        achievements: '[]',
        level: 1,
        createdAt: new Date().toISOString(),
      };
      setUser(userObj);
      Cookies.set('taa_user', JSON.stringify(userObj), { expires: 7 });
    } else {
      alert('Ошибка регистрации');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile = {
        name: user.displayName || 'Google User',
        avatar: user.photoURL || '',
        email: user.email || '',
        bio: '',
        google_registered: 1,
      };
      // Пытаемся создать пользователя
      let userId = null;
      const res = await fetch('http://localhost:8000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, nickname: profile.name, avatar: profile.avatar, bio: '', google_registered: 1 }),
      });
      if (res.ok) {
        userId = await res.json();
      } else {
        // Если пользователь уже есть, получаем его id
        const getRes = await fetch(`http://localhost:8000/user/by-email?email=${encodeURIComponent(profile.email)}`);
        if (getRes.ok) {
          userId = await getRes.json();
        } else {
          throw new Error('Ошибка Google авторизации!');
        }
      }
      // Fetch notification settings
      const notifRes = await fetch(`http://localhost:8000/notifications/${userId}`);
      let notifications_enabled = 1;
      if (notifRes.ok) {
        const n = await notifRes.json();
        notifications_enabled = typeof n.enabled === 'number' ? n.enabled : 1;
      }
      const userObj = {
        id: String(userId),
        email: profile.email,
        nickname: profile.name,
        avatar: profile.avatar,
        bio: '',
        google_registered: 1,
        notifications_enabled,
        achievements: '[]',
        level: 1,
        createdAt: new Date().toISOString(),
      };
      setUser(userObj);
      Cookies.set('taa_user', JSON.stringify(userObj), { expires: 7 });
    } catch (error) {
      alert('Ошибка Google авторизации!');
    }
  };

  const logout = async () => {
  await signOut(auth);
  setUser(null);
  Cookies.remove('taa_user');
  setProfile({ name: '', avatar: '', email: '' });
  };

  const editProfile = (profile: { name: string; bio?: string; google_registered?: number; achievements?: string; level?: number; learning_progress?: string }) => {
    // Update profile in backend
    fetch('http://localhost:8000/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profile.name,
        bio: profile.bio || '',
        google_registered: profile.google_registered ?? 0,
        achievements: profile.achievements ?? '',
        level: profile.level ?? 1,
        learning_progress: profile.learning_progress ?? '{}',
      }),
    });
    setUser(prev => prev ? {
      ...prev,
      nickname: profile.name,
      bio: profile.bio || '',
      google_registered: profile.google_registered ?? 0,
      achievements: profile.achievements ?? prev.achievements,
      level: profile.level ?? prev.level,
      learning_progress: profile.learning_progress ?? prev.learning_progress,
    } : null);
  };

  const changePassword = async (_newPassword: string) => {
    // Mock password change
    alert('Пароль успешно изменен!');
  };

  const updateNotifications = async (settings: any) => {
    // Update notification setting in backend
    if (!user) return;
    await fetch('http://localhost:8000/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        enabled: settings ? 1 : 0,
      }),
    });
    setUser(prev => prev ? { ...prev, notifications_enabled: settings ? 1 : 0 } : null);
  };

  const deleteAccount = async () => {
  setUser(null);
  Cookies.remove('taa_user');
  setProfile({ name: '', avatar: '', email: '' });
  alert('Аккаунт удален!');
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    editProfile,
    changePassword,
    updateNotifications,
    deleteAccount,
  };

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}