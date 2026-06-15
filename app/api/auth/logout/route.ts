import { NextRequest, NextResponse } from "next/server";

function getBackendBaseUrl() {
  const value = process.env.BACKEND_API_BASE_URL?.trim();
  if (!value) throw new Error("BACKEND_API_BASE_URL is not configured.");
  const normalized = value.replace(/\/+$/, "");
  return normalized.endsWith("/api/v1") ? normalized : `${normalized}/api/v1`;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("islamic-gpt-token")?.value;

  if (token) {
    try {
      await fetch(`${getBackendBaseUrl()}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Backend logout failed:", err);
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("islamic-gpt-token");
  return response;
}
