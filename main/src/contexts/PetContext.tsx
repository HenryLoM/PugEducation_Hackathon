import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPetStats, setPetStats, updateScore } from '../localBackend';
import { useAuth } from './AuthContext';
import { getUserProfile } from '../api/achievements';

interface Pet {
  id: string;
  name: string;
  level: number;
  xp: number;
  hunger: number;
  mood: number;
  state: 'happy' | 'sad' | 'sleeping' | 'evolved';
  lastFed: string;
  streak: number;
  lastLogin: string;
}

interface PetContextType {
  pet: Pet;
  feedPet: () => void;
  addXP: (amount: number) => void;
  updateMood: (change: number) => void;
  checkDailyLogin: () => void;
  changePetName: (newName: string) => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function usePet() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
}

interface PetProviderProps {
  children: ReactNode;
}

export function PetProvider({ children }: PetProviderProps) {
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet>(() => {
    const stats = getPetStats();
    const localName = localStorage.getItem('petName');
    const localHunger = localStorage.getItem('petHunger');
    const localMood = localStorage.getItem('petMood');
    const localXP = localStorage.getItem('petXP');
    const localLevel = localStorage.getItem('petLevel');
    return {
      id: '1',
      name: localName || 'Пуга',
      level: localLevel ? Number(localLevel) : Math.floor(stats.score / 100) + 1,
      xp: localXP ? Number(localXP) : stats.score,
      hunger: localHunger ? Number(localHunger) : stats.hunger,
      mood: localMood ? Number(localMood) : 90,
      state: 'happy',
      lastFed: new Date().toISOString(),
      streak: 1,
      lastLogin: new Date().toISOString(),
    };
  });

  // Update pet state from backend data after login
  useEffect(() => {
    if (user && typeof user.pet_stats === 'object' && user.pet_stats) {
      setPet(prev => ({
        ...prev,
        ...user.pet_stats,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getUserProfile(Number(user.id)).then(profile => {
      setPet(prev => {
        const progress = profile.learning_progress ? JSON.parse(profile.learning_progress) : {};
        return {
          ...prev,
          name: progress.name || profile.name || prev.name,
          level: profile.level || prev.level,
          xp: progress.xp || prev.xp,
          streak: progress.streak || prev.streak,
          mood: progress.mood || prev.mood,
        };
      });
    });
  }, [user]);

  useEffect(() => {
    // Decrease hunger every 10 minutes
    const hungerInterval = setInterval(() => {
      setPet(prev => {
        const newHunger = Math.max(0, prev.hunger - 1);
        return { ...prev, hunger: newHunger };
      });
    }, 600000); // 10 minutes

    // Decrease mood every 10 seconds
    const moodInterval = setInterval(() => {
      setPet(prev => {
        const newMood = Math.max(0, prev.mood - 1);
        return { ...prev, mood: newMood };
      });
    }, 10000); // 10 seconds

    return () => {
      clearInterval(hungerInterval);
      clearInterval(moodInterval);
    };
  }, []);

  useEffect(() => {
    // Save pet stats to localStorage whenever hunger, mood, or score changes
    setPetStats({ score: pet.xp, hunger: pet.hunger });
    localStorage.setItem('petHunger', String(pet.hunger));
    localStorage.setItem('petMood', String(pet.mood));
    // Сохраняем прогресс в БД
    if (user) {
      const progress = {
        name: pet.name,
        xp: pet.xp,
        level: pet.level,
        hunger: pet.hunger,
        mood: pet.mood,
        streak: pet.streak,
        lastFed: pet.lastFed,
        lastLogin: pet.lastLogin,
        state: pet.state,
      };
      import('../api/achievements').then(api => {
        api.updateUserProgress(Number(user.id), JSON.stringify(progress));
      });
    }
  }, [pet, user]);

  const feedPet = () => {
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      lastFed: new Date().toISOString(),
    }));
  };

  const addXP = (amount: number) => {
    setPet(prev => {
      const newXP = updateScore(amount);
      const newLevel = Math.floor(newXP / 100) + 1;
      const evolved = newLevel > prev.level && newLevel % 5 === 0;
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        state: evolved ? 'evolved' : prev.state,
        mood: Math.min(100, prev.mood + 5),
      };
    });
  };

  // Only allow mood to be increased via chat (call this from chat logic)
  const updateMood = (change: number) => {
    if (change > 0) {
      setPet(prev => ({
        ...prev,
        mood: Math.max(0, Math.min(100, prev.mood + change)),
      }));
    }
  };

  const checkDailyLogin = () => {
    const today = new Date().toDateString();
    const lastLoginDate = new Date(pet.lastLogin).toDateString();
    
    if (today !== lastLoginDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = new Date(pet.lastLogin).toDateString() === yesterday.toDateString();
      
      setPet(prev => ({
        ...prev,
        streak: wasYesterday ? prev.streak + 1 : 1,
        lastLogin: new Date().toISOString(),
        mood: Math.min(100, prev.mood + 10),
      }));
    }
  };

  const changePetName = async (newName: string) => {
  setPet(prev => ({ ...prev, name: newName }));
  localStorage.setItem('petName', newName);
  if (user) {
    // Обновляем имя в профиле пользователя
    await fetch('http://localhost:8000/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        name: user.nickname,
        bio: user.bio || '',
        google_registered: user.google_registered ?? 0,
        level: pet.level,
        learning_progress: JSON.stringify({
          ...pet,
          name: newName
        })
      })
    });
    // Прогресс сохраняем отдельно
    import('../api/achievements').then(api => {
      api.updateUserProgress(Number(user.id), JSON.stringify({
        ...pet,
        name: newName
      }));
    });
  }
  };

  const value = {
    pet,
    feedPet,
    addXP,
    updateMood,
    checkDailyLogin,
    changePetName,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}
