let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.dispatchEvent(new Event("unauthorized"));
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    logout();
    throw new Error("No refresh token");
  }

  const response = await fetch("/api/users/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    logout();
    throw new Error("Refresh failed");
  }

  const data = await response.json();

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  return data.accessToken;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const makeRequest = async (token: string | null) => {
    return fetch(url, {
      ...options,
      headers: { 
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });
  };

  let accessToken = localStorage.getItem("accessToken");
  let response = await makeRequest(accessToken);

  if (response.status !== 401) {
    return response;
  }
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken()
      .then((newToken) => {
        isRefreshing = false;
        return newToken;
      })
      .catch((err) => {
        isRefreshing = false;
        refreshPromise = null;
        throw err;
      });
  }

  try {
    const newToken = await refreshPromise!;
    return await makeRequest(newToken);
  } catch (e) {
    return response;
  }
}