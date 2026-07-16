const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api${endpoint}`, {
        ...options, // Spread the incoming options first
        headers: {
            'Content-Type': 'application/json',
            ...options.headers, // Then, correctly merge any existing headers from the options
        },
    });
    
    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let error;
        if (contentType && contentType.includes('application/json')) {
            const errData = await response.json();
            error = new Error(errData.error || `Request failed with status ${response.status}`);
        } else {
            const textError = await response.text();
            error = new Error(textError || `Request failed with status ${response.status}`);
        }
        throw error;
    }
    
    return response.json();
};

const apiFetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');

  // If a token exists, add the Authorization header
  if (token!=undefined) {
    console.log('Using token:', token);
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  // Call your original apiFetch function with the updated options
  return apiFetch(endpoint, options);
};

// Now, use apiFetchWithAuth for all your protected endpoints
// e.g., const response = await apiFetchWithAuth('/ai/generate-code');

export { apiFetch, apiFetchWithAuth };