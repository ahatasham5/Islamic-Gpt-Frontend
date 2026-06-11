export type HealthResponse = {
  status: string;
  message: string;
};

export type UserRole = "super_admin" | "mufti" | "user";

export type UserCreate = {
  name: string;
  email: string;
  password: string;
};

export type MuftiCreate = {
  name: string;
  email: string;
};

export type AcceptInvite = {
  email: string;
  password: string;
};

export type UserLogin = {
  email: string;
  password: string;
};

export type VerifyOTP = {
  email: string;
  otp: string;
};

export type ResendOTP = {
  email: string;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
};

export type Token = {
  access_token: string;
  token_type: string;
  user: UserResponse;
};

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  user: UserResponse;
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
