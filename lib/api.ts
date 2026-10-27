import { getSettings } from '@/lib/storage';

export type Article = { title?: string; link?: string; content?: string };
export type StoryResponse = { story: string };

export async function getApiBase(): Promise<string> {
  const settings = await getSettings();
  return settings.apiBaseUrl.replace(/\/$/, '');
}

export async function fetchNews(): Promise<Article[]> {
  const base = await getApiBase();
  const res = await fetch(`${base}/news`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchStory(words: string[]): Promise<string> {
  const base = await getApiBase();
  const res = await fetch(`${base}/story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words }),
  });
  const data = await res.json();
  return data.story ?? '';
}

export async function pingBackend(): Promise<boolean> {
  try {
    const base = await getApiBase();
    const res = await fetch(`${base}/news`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function translateWord(word: string): Promise<string> {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=ko|en`
  );
  const data = await res.json();
  return data.responseData?.translatedText ?? '';
}
