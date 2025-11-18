// API Configuration
// This file handles API URLs for different environments

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  enableBlog: boolean;
}

// Get environment variables with fallbacks
const getApiConfig = (): ApiConfig => {
  // Always use Netlify Functions (works in both dev and production)
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/.netlify/functions';
  
  return {
    baseUrl,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
    enableBlog: import.meta.env.VITE_ENABLE_BLOG !== 'false',
  };
};

export const apiConfig = getApiConfig();

// API endpoints
export const endpoints = {
  blogs: `${apiConfig.baseUrl}/blogs`,
  blog: (slug: string) => `${apiConfig.baseUrl}/blog/${slug}`,
  health: `${apiConfig.baseUrl}/health`,
};

// Fetch wrapper with timeout and error handling
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};
