/**
 * Simple and clean API client wrapper around native fetch.
 * Automatically injects the Authorization Bearer header from localStorage
 * and prepends the backend base URL.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  token?: string; // Optional manual override token
}

async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_BASE_URL}${cleanEndpoint}`;

  // Prepare headers
  const headers = new Headers(options.headers || {});

  // If no content-type is provided and body is not FormData, default to application/json
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Automatically inject Bearer token from localStorage (if in browser)
  if (typeof window !== 'undefined') {
    const token = options.token || localStorage.getItem('token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(fullUrl, config);
    const data = await response.json();

    if (!response.ok) {
      // Throw formatted error so catch blocks can handle it easily
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg) as any;
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data as T;
  } catch (error: any) {
    // If it's already an error with message, rethrow it
    if (error.message) {
      throw error;
    }
    throw new Error('Unable to connect to the backend server. Please make sure the server is running.');
  }
}

// Convenient helper methods
export const apiClient = {
  // GET request
  get: <T = any>(endpoint: string, options?: RequestOptions) => {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  // POST request
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) => {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  // PUT request
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) => {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  // DELETE request
  delete: <T = any>(endpoint: string, options?: RequestOptions) => {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  // Multipart Form Data Upload (for Cloudinary / Multer)
  upload: <T = any>(endpoint: string, formData: FormData, options?: RequestOptions) => {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  },
};

export default apiClient;
