import { apiRequest } from "@/lib/http";

export type AdminFeedback = {
  id: number;
  mufti_id: number;
  mufti_name: string;
  is_good: boolean | null;
  feedback_text: string | null;
  created_at: string;
  user_query?: string;
  ai_response?: {
    message_id: number | null;
    session_id: number | null;
    answer: string;
    sources: any[];
  };
};

export type FeedbacksResponse = {
  total: number;
  page: number;
  size: number;
  feedbacks: AdminFeedback[];
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
};

export type UsersResponse = {
  total: number;
  page: number;
  size: number;
  users: AdminUser[];
};

export const adminApi = {
  getFeedbacks(page = 1, size = 10) {
    return apiRequest<FeedbacksResponse>({
      method: "GET",
      url: `/admin/feedbacks?page=${page}&size=${size}`,
    });
  },

  searchFeedbacks(q: string, page = 1, size = 10) {
    return apiRequest<FeedbacksResponse>({
      method: "GET",
      url: `/admin/feedbacks/search`,
      params: { q, page, size },
    });
  },

  deleteFeedback(feedbackId: number) {
    return apiRequest<string>({
      method: "DELETE",
      url: `/admin/feedbacks/${feedbackId}`,
    });
  },

  getUsers(page = 1, size = 10) {
    return apiRequest<UsersResponse>({
      method: "GET",
      url: `/admin/users?page=${page}&size=${size}`,
    });
  },

  searchUsers(q: string, page = 1, size = 10) {
    return apiRequest<UsersResponse>({
      method: "GET",
      url: `/admin/users/search`,
      params: { q, page, size },
    });
  },

  activateUser(userId: number, isActive: boolean) {
    return apiRequest<AdminUser>({
      method: "PATCH",
      url: `/admin/users/${userId}/status`,
      data: { is_active: isActive },
    });
  },

  changeUserRole(userId: number, role: string) {
    return apiRequest<AdminUser>({
      method: "PATCH",
      url: `/admin/users/${userId}/role`,
      data: { role },
    });
  },

  deleteUser(userId: number) {
    return apiRequest<string>({
      method: "DELETE",
      url: `/admin/users/${userId}`,
    });
  },
};
