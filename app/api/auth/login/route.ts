import { NextRequest, NextResponse } from "next/server";

function getBackendBaseUrl() {
  const value = process.env.BACKEND_API_BASE_URL?.trim();
  if (!value) throw new Error("BACKEND_API_BASE_URL is not configured.");
  const normalized = value.replace(/\/+$/, "");
  return normalized.endsWith("/api/v1") ? normalized : `${normalized}/api/v1`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetUrl = `${getBackendBaseUrl()}/auth/login`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const nextResponse = NextResponse.json(data);
    const token = data.access_token;
    
    if (token) {
      nextResponse.cookies.set("islamic-gpt-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ detail: "Login failed" }, { status: 500 });
  }
}
