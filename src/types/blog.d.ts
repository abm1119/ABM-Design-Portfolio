// src/types/blog.d.ts
export interface BlogPost {
  id: string;
  title: string;
  coverImage: string | null;
  creator: string;
  link: string;
  pubDate: string | null;
  pubDateFormatted: string | null;
  created: string | null;
  createdFormatted: string | null;
  contentSnippet: string;
  content?: string; // Optional for list view, required for detail view
  medium: 'notion';
  category: string;
  tags: string[];
  slug: string;
  status: string;
}
