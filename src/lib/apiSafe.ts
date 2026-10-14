/**
 * Safely performs a POST request and only parses JSON if the response is JSON.
 * Protects against HTML error pages or SPA fallback index.html responses.
 */
export async function safePostJson(url: string, data: any, customHeaders: Record<string, string> = {}): Promise<any> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...customHeaders },
      body: JSON.stringify(data)
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Safely performs a GET request and only parses JSON if the response is JSON.
 */
export async function safeGetJson(url: string, customHeaders: Record<string, string> = {}): Promise<any> {
  try {
    const res = await fetch(url, {
      headers: customHeaders
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}
