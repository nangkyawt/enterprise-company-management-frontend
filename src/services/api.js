const API_URL = "http://localhost:8000/api";

export async function apiRequest(endpoint, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  const makeRequest = async (token) => {
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...options.headers,
      },
    });
  };

  // First request
  let response = await makeRequest(accessToken);

  // Access token expired/invalid
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return response;
    }

    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        return response;
      }

      // Save new access token
      accessToken = refreshData.accessToken;
      localStorage.setItem("accessToken", accessToken);

      // Retry original request with new token
      response = await makeRequest(accessToken);
    } catch (error) {
      console.error("Token refresh error:", error);
    }
  }

  return response;
}