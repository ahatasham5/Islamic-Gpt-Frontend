export type HealthResponse = {
  status: string;
  message: string;
};

export type BookInfo = {
  book_id: string;
  file_name: string;
  book_title: string;
  author: string | null;
  volume: number | null;
  language: string;
  total_chunks: number;
  ingested_at: string;
};

export type BookListResponse = {
  books: BookInfo[];
  total: number;
};

export type BookUploadResponse = {
  book_id: string;
  file_name: string;
  book_title: string;
  book_title_bn: string | null;
  author: string | null;
  volume: number | null;
  language: string;
  subject: string | null;
  madhab: string | null;
  total_pages: number;
  total_chunks: number;
  status: "ingested" | "already_exists" | "failed";
  message: string;
  ingested_at: string;
};

export type Source = {
  book_title: string;
  file_name: string;
  page_number: number | null;
  page_number_str?: string | null;
  section: string;
  relevance_score: number;
  relevance_label: "high" | "medium" | "low";
  context_text?: string;
  madhab?: string | null;
};

export type ChatRequest = {
  query: string;
  book_id: string | null;
  top_k: number;
};

export type ChatResponse = {
  answer: string;
  sources: Source[];
  confidence: "high" | "medium" | "low" | "not_found";
  query_language: "bn" | "en";
  arabic_translation: string;
  books_searched: string[];
  madhabs?: string[];
  total_chunks_retrieved: number;
};
