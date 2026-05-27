export const API_BASE = 'http://localhost/repairshop-backend';

export async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    credentials: 'include',
    ...options,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const error = new Error(data.message || 'Request failed');
    (error as any).response = response;
    (error as any).data = data;
    throw error;
  }

  return data;
}

export function jsonRequest(endpoint: string, body: Record<string, any>, method: string = 'POST') {
  return fetchJson(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function deleteRequest(endpoint: string, body: Record<string, any>) {
  return jsonRequest(endpoint, body, 'DELETE');
}

export function putRequest(endpoint: string, body: Record<string, any>) {
  return jsonRequest(endpoint, body, 'PUT');
}
