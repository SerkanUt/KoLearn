import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Article } from '@/constants/Api';

const KEYS = {
  translations: '@kolearn/translations',
  bookmarks: '@kolearn/bookmarks',
  stories: '@kolearn/stories',
  settings: '@kolearn/settings',
  activity: '@kolearn/activity',
  readArticles: '@kolearn/read-articles',
} as const;

export type TranslationEntry = {
  id: string;
  source: string;
  result: string;
  fromLanguage: string;
  toLanguage: string;
  createdAt: string;
};

export type SavedStory = {
  id: string;
  words: string[];
  story: string;
  createdAt: string;
};

export type AppSettings = {
  apiBaseUrl: string;
  appearance: 'system' | 'light' | 'dark';
  learnerName: string;
};

export type ActivityLog = {
  dates: string[];
  translationsCount: number;
  articlesReadCount: number;
};

const DEFAULT_SETTINGS: AppSettings = {
  apiBaseUrl: 'http://localhost:3000',
  appearance: 'system',
  learnerName: 'Guest',
};

const DEFAULT_ACTIVITY: ActivityLog = {
  dates: [],
  translationsCount: 0,
  articlesReadCount: 0,
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getSettings(): Promise<AppSettings> {
  return readJson(KEYS.settings, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await writeJson(KEYS.settings, settings);
}

export async function getTranslations(): Promise<TranslationEntry[]> {
  return readJson(KEYS.translations, []);
}

export async function addTranslation(entry: Omit<TranslationEntry, 'id' | 'createdAt'>): Promise<void> {
  const list = await getTranslations();
  const next: TranslationEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  await writeJson(KEYS.translations, [next, ...list].slice(0, 20));
  await logTranslation();
}

export async function clearTranslations(): Promise<void> {
  await writeJson(KEYS.translations, []);
}

export async function getSavedStories(): Promise<SavedStory[]> {
  return readJson(KEYS.stories, []);
}

export async function saveStory(story: Omit<SavedStory, 'id' | 'createdAt'>): Promise<void> {
  const list = await getSavedStories();
  const next: SavedStory = {
    ...story,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  await writeJson(KEYS.stories, [next, ...list]);
}

export async function clearStories(): Promise<void> {
  await writeJson(KEYS.stories, []);
}

export async function getBookmarks(): Promise<string[]> {
  return readJson(KEYS.bookmarks, []);
}

export async function toggleBookmark(articleId: string): Promise<boolean> {
  const list = await getBookmarks();
  const exists = list.includes(articleId);
  const next = exists ? list.filter((id) => id !== articleId) : [...list, articleId];
  await writeJson(KEYS.bookmarks, next);
  return !exists;
}

export async function clearBookmarks(): Promise<void> {
  await writeJson(KEYS.bookmarks, []);
}

export async function getReadArticles(): Promise<string[]> {
  return readJson(KEYS.readArticles, []);
}

export async function markArticleRead(articleId: string): Promise<void> {
  const list = await getReadArticles();
  if (list.includes(articleId)) return;
  await writeJson(KEYS.readArticles, [...list, articleId]);
  await logArticleRead();
}

export async function getActivity(): Promise<ActivityLog> {
  return readJson(KEYS.activity, DEFAULT_ACTIVITY);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function logTranslation(): Promise<void> {
  const activity = await getActivity();
  const today = todayKey();
  const dates = activity.dates.includes(today) ? activity.dates : [...activity.dates, today];
  await writeJson(KEYS.activity, {
    ...activity,
    dates,
    translationsCount: activity.translationsCount + 1,
  });
}

async function logArticleRead(): Promise<void> {
  const activity = await getActivity();
  const today = todayKey();
  const dates = activity.dates.includes(today) ? activity.dates : [...activity.dates, today];
  await writeJson(KEYS.activity, {
    ...activity,
    dates,
    articlesReadCount: activity.articlesReadCount + 1,
  });
}

export async function resetActivity(): Promise<void> {
  await writeJson(KEYS.activity, DEFAULT_ACTIVITY);
  await writeJson(KEYS.readArticles, []);
}

export function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const expected = cursor.toISOString().slice(0, 10);
    if (sorted[i] === expected) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0 && sorted[0] !== expected) {
      const yesterday = new Date(cursor);
      yesterday.setDate(yesterday.getDate() - 1);
      if (sorted[0] === yesterday.toISOString().slice(0, 10)) {
        streak = 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return streak;
}

export function articleId(article: Article, index: number): string {
  return article.link ?? `article-${index}`;
}

export async function clearAllData(): Promise<void> {
  await Promise.all([
    clearTranslations(),
    clearStories(),
    clearBookmarks(),
    resetActivity(),
  ]);
}
