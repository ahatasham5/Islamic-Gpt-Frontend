import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_PREFIX = "/api/v1";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function getBackendBaseUrl() {
  const value = process.env.BACKEND_API_BASE_URL?.trim();

  if (!value) {
    throw new Error("BACKEND_API_BASE_URL is not configured in .env.local.");
  }

  const normalized = value.replace(/\/+$/, "");

  return normalized.endsWith(API_PREFIX) ? normalized : `${normalized}${API_PREFIX}`;
}

function buildTargetUrl(request: NextRequest, path: string[]) {
  const backendBaseUrl = getBackendBaseUrl();
  const incomingUrl = new URL(request.url);
  // Sanitize path to prevent directory traversal
  const sanitizedPath = path.filter(segment => segment !== '..' && segment !== '.');
  const targetPath = sanitizedPath.map(encodeURIComponent).join("/");

  return `${backendBaseUrl}/${targetPath}${incomingUrl.search}`;
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  let targetUrl: string;

  try {
    const params = await context.params;
    targetUrl = buildTargetUrl(request, params.path);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy configuration error.";
    return Response.json({ detail: message }, { status: 500 });
  }

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  let body: BodyInit | undefined;
  
  // Extract token from HTTPOnly cookie
  const cookieToken = request.cookies.get("islamic-gpt-token")?.value;
  const authHeader = request.headers.get("authorization");

  const hasAuth = !!cookieToken || !!authHeader;

  // Routes that do not require an active user session
  const PUBLIC_ROUTES = [
    "auth/accept-invite",
    "auth/signup",
    "auth/resend-otp",
    "auth/verify-otp",
    "users/forgot-password",
    "users/reset-password"
  ];

  let pathStr = "";
  try {
    const params = await context.params;
    pathStr = params.path.join("/");
  } catch (e) { }

  const isPublic = PUBLIC_ROUTES.some(route => pathStr.startsWith(route));

  if (!hasAuth && !isPublic) {
    return Response.json(
      { detail: "Unauthorized API access. Please log in." },
      { status: 401 }
    );
  }

  if (cookieToken) {
    headers.set("authorization", `Bearer ${cookieToken}`);
  } else if (authHeader) {
    headers.set("authorization", authHeader);
  }

  if (!["GET", "HEAD"].includes(request.method)) {
    if (contentType?.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      const text = await request.text();
      body = text.length > 0 ? text : undefined;

      if (contentType) {
        headers.set("content-type", contentType);
      }
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store"
    });
    const responseBody = await response.arrayBuffer();
    const responseHeaders = new Headers();
    const responseType = response.headers.get("content-type");

    if (responseType) {
      responseHeaders.set("content-type", responseType);
    }

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders
    });
  } catch {
    return Response.json(
      {
        detail: "Backend server is unreachable."
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
