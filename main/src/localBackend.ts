// src/localBackend.ts
// Simulates backend operations using localStorage

export const getProfile = () => {
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(profile) : { name: '', avatar: '', email: '' };
};

export const setProfile = (profile: { name: string; avatar: string; email: string }) => {
  localStorage.setItem('profile', JSON.stringify(profile));
};

export const getPetStats = () => {
  const stats = localStorage.getItem('petStats');
  return stats ? JSON.parse(stats) : { score: 0, hunger: 100 };
};

export const setPetStats = (stats: { score: number; hunger: number }) => {
  localStorage.setItem('petStats', JSON.stringify(stats));
};

export const updateScore = (delta: number) => {
  const stats = getPetStats();
  stats.score += delta;
  setPetStats(stats);
  return stats.score;
};

export const updateHunger = (delta: number) => {
  const stats = getPetStats();
  stats.hunger = Math.max(0, Math.min(100, stats.hunger + delta));
  setPetStats(stats);
  return stats.hunger;
};

export const resetStats = () => {
  setPetStats({ score: 0, hunger: 100 });
};
