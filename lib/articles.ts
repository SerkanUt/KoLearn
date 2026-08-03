import type { Article } from '@/constants/Api';

let cache: Article[] = [];

export function setArticles(articles: Article[]) {
  cache = articles;
}

export function getArticles(): Article[] {
  return cache;
}

export function getArticleById(id: string): Article | undefined {
  const index = parseInt(id, 10);
  if (!Number.isNaN(index) && cache[index]) return cache[index];
  return cache.find((a, i) => (a.link ?? `article-${i}`) === id);
}

export function getArticleIndex(id: string): number {
  const num = parseInt(id, 10);
  if (!Number.isNaN(num)) return num;
  return cache.findIndex((a, i) => (a.link ?? `article-${i}`) === id);
}
