import { getToken } from './auth.js';

const base = '';

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();
  try {
    const res = await fetch(`${base}/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!res.ok) {
      let errorMessage = res.statusText;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const text = await res.text();
        if (text) errorMessage = text;
      }
      
      const error = new Error(errorMessage);
      error.status = res.status;
      throw error;
    }
    
    return res.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
}


