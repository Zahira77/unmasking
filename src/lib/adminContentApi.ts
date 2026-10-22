export interface EntrepreneurLessonItem {
  id?: number;
  slug?: string;
  name: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content?: string;
  quote?: string;
  quote_by?: string;
  image_url?: string;
  media_image_url?: string;
  media_video_url?: string;
  category: string;
  date: string;
  read_time: string;
  published: boolean;
}

export interface StartupStoryItem {
  id?: number;
  slug?: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content?: string;
  quote?: string;
  quote_by?: string;
  tag: string;
  date: string;
  image_url?: string;
  media_image_url?: string;
  media_video_url?: string;
  published: boolean;
}

export interface RealityEpisodeItem {
  id?: number;
  series_id?: number;
  episode_number: number;
  title: string;
  excerpt: string;
  video_url?: string;
  date: string;
  published: boolean;
}

export interface RealitySeriesItem {
  id?: number;
  slug?: string;
  title: string;
  description: string;
  tag: string;
  published: boolean;
  episodes?: RealityEpisodeItem[];
}

export interface CorporateGirlieItem {
  id?: number;
  slug?: string;
  title: string;
  author: string;
  excerpt: string;
  summary?: string;
  content?: string;
  tag: string;
  date: string;
  image_url?: string;
  substack_url?: string;
  published: boolean;
}

export interface EventDocumentaryItem {
  id?: number;
  title: string;
  subtitle?: string;
  author?: string;
  body: string;
  content?: string;
  highlights?: string;
  tag: string;
  date: string;
  location?: string;
  video_url?: string;
  media_image_url?: string;
  media_video_url?: string;
  published: boolean;
}

export interface AuthorNoteItem {
  id?: number;
  slug?: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  published: boolean;
}

export interface HomeReaderItem {
  id?: number;
  tab_id: number; // 0: Startup News, 1: Fact, 2: Update
  tag: string;
  date: string;
  title: string;
  body: string;
  source?: string;
  label?: string;
  sort_order?: number;
  published: boolean;
}

export interface RegistrationItem {
  id: number;
  name?: string;
  email: string;
  source: string;
}

export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "API Request Failed" }));
    throw new Error(errorData.detail || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const adminApi = {
  seed: () => request<{ status: string; message: string }>("/api/admin/seed", { method: "POST" }),

  // Entrepreneur Lessons
  getLessons: (publishedOnly = false) =>
    request<EntrepreneurLessonItem[]>(`/api/lessons?published_only=${publishedOnly}`),
  getLessonBySlug: (slug: string) =>
    request<EntrepreneurLessonItem>(`/api/lessons/by-slug/${slug}`),
  createLesson: (data: EntrepreneurLessonItem) =>
    request<EntrepreneurLessonItem>("/api/lessons", { method: "POST", body: JSON.stringify(data) }),
  updateLesson: (id: number, data: EntrepreneurLessonItem) =>
    request<EntrepreneurLessonItem>(`/api/lessons/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteLesson: (id: number) => request<{ status: string }>(`/api/lessons/${id}`, { method: "DELETE" }),

  // Startup Stories
  getStartupStories: (publishedOnly = false) =>
    request<StartupStoryItem[]>(`/api/startup-stories?published_only=${publishedOnly}`),
  getStartupStoryBySlug: (slug: string) =>
    request<StartupStoryItem>(`/api/startup-stories/by-slug/${slug}`),
  getStartupStoryById: (id: number) =>
    request<StartupStoryItem>(`/api/startup-stories/${id}`),
  createStartupStory: (data: StartupStoryItem) =>
    request<StartupStoryItem>("/api/startup-stories", { method: "POST", body: JSON.stringify(data) }),
  updateStartupStory: (id: number, data: StartupStoryItem) =>
    request<StartupStoryItem>(`/api/startup-stories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteStartupStory: (id: number) => request<{ status: string }>(`/api/startup-stories/${id}`, { method: "DELETE" }),


  // Reality of Startups
  getRealitySeries: (publishedOnly = false) =>
    request<RealitySeriesItem[]>(`/api/reality-series?published_only=${publishedOnly}`),
  createRealitySeries: (data: RealitySeriesItem) =>
    request<RealitySeriesItem>("/api/reality-series", { method: "POST", body: JSON.stringify(data) }),
  updateRealitySeries: (id: number, data: RealitySeriesItem) =>
    request<RealitySeriesItem>(`/api/reality-series/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteRealitySeries: (id: number) => request<{ status: string }>(`/api/reality-series/${id}`, { method: "DELETE" }),

  createRealityEpisode: (seriesId: number, data: RealityEpisodeItem) =>
    request<RealityEpisodeItem>(`/api/reality-series/${seriesId}/episodes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteRealityEpisode: (id: number) => request<{ status: string }>(`/api/reality-episodes/${id}`, { method: "DELETE" }),

  // Corporate Girlie
  getCorporateGirlies: (publishedOnly = false) =>
    request<CorporateGirlieItem[]>(`/api/corporate-girlie?published_only=${publishedOnly}`),
  createCorporateGirlie: (data: CorporateGirlieItem) =>
    request<CorporateGirlieItem>("/api/corporate-girlie", { method: "POST", body: JSON.stringify(data) }),
  updateCorporateGirlie: (id: number, data: CorporateGirlieItem) =>
    request<CorporateGirlieItem>(`/api/corporate-girlie/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCorporateGirlie: (id: number) => request<{ status: string }>(`/api/corporate-girlie/${id}`, { method: "DELETE" }),

  // Event Documentaries
  getEvents: (publishedOnly = false) =>
    request<EventDocumentaryItem[]>(`/api/events?published_only=${publishedOnly}`),
  createEvent: (data: EventDocumentaryItem) =>
    request<EventDocumentaryItem>("/api/events", { method: "POST", body: JSON.stringify(data) }),
  updateEvent: (id: number, data: EventDocumentaryItem) =>
    request<EventDocumentaryItem>(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEvent: (id: number) => request<{ status: string }>(`/api/events/${id}`, { method: "DELETE" }),

  // Author Notes & Essays
  getNotes: (publishedOnly = false) =>
    request<AuthorNoteItem[]>(`/api/notes?published_only=${publishedOnly}`),
  getNoteBySlug: (slug: string) =>
    request<AuthorNoteItem>(`/api/notes/by-slug/${slug}`),
  createNote: (data: AuthorNoteItem) =>
    request<AuthorNoteItem>("/api/notes", { method: "POST", body: JSON.stringify(data) }),
  updateNote: (id: number, data: AuthorNoteItem) =>
    request<AuthorNoteItem>(`/api/notes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteNote: (id: number) => request<{ status: string }>(`/api/notes/${id}`, { method: "DELETE" }),

  // Homepage Live Reader Items
  getHomeReader: (publishedOnly = false) =>
    request<HomeReaderItem[]>(`/api/home-reader?published_only=${publishedOnly}`),
  createHomeReader: (data: HomeReaderItem) =>
    request<HomeReaderItem>("/api/home-reader", { method: "POST", body: JSON.stringify(data) }),
  updateHomeReader: (id: number, data: HomeReaderItem) =>
    request<HomeReaderItem>(`/api/home-reader/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteHomeReader: (id: number) => request<{ status: string }>(`/api/home-reader/${id}`, { method: "DELETE" }),

  // Subscribers
  getRegistrations: () => request<RegistrationItem[]>("/api/registrations"),
  sendNewsletter: (subject: string, body: string) =>
    request<{ status: string; emails_sent: number }>("/api/admin/send-newsletter", {
      method: "POST",
      body: JSON.stringify({ subject, body }),
    }),
};
