// src/api/achievements.ts
// API для обновления ачивок пользователя

export async function updateUserAchievements(userId: number, achievements: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch('/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId, achievements }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Ошибка сохранения достижений');
    return await res.json();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error('Ошибка сохранения достижений: ' + msg);
  }
}

export async function getUserAchievements(userId: number) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`/achievements/${userId}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Ошибка загрузки достижений');
    return await res.json();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error('Ошибка загрузки достижений: ' + msg);
  }
}

export async function getUserProfile(userId: number) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`/profile/${userId}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Ошибка загрузки профиля');
    return await res.json();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error('Ошибка загрузки профиля: ' + msg);
  }
}

export async function updateUserProfile(userId: number, learning_progress: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch('/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId, learning_progress }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Ошибка сохранения прогресса');
    return await res.json();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error('Ошибка сохранения прогресса: ' + msg);
  }
}

export async function updateUserProgress(userId: number, learning_progress: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch('/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId, learning_progress }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Ошибка сохранения прогресса');
    return await res.json();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error('Ошибка сохранения прогресса: ' + msg);
  }
}
