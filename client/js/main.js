// Main JavaScript file for Fintech Dashboard Frontend
// Handles authentication, API calls, and UI interactions

// Get backend API URL - try multiple sources
let BACKEND_API_URL;

// Method 1: Try environment variable (for Vercel/Netlify)
if (typeof window !== "undefined" && window.BACKEND_API_URL) {
  BACKEND_API_URL = window.BACKEND_API_URL;
}
// Method 2: Try meta tag (for static hosting)
else if (document.querySelector('meta[name="backend-url"]')) {
  BACKEND_API_URL = document
    .querySelector('meta[name="backend-url"]')
    .getAttribute("content");
}
// Method 3: Try localStorage (for manual configuration)
else if (localStorage.getItem("BACKEND_API_URL")) {
  BACKEND_API_URL = localStorage.getItem("BACKEND_API_URL");
}
// Method 4: Fallback to common patterns
else {
  // Try to detect if we're on Vercel/Netlify and construct the URL
  const hostname = window.location.hostname;
  if (hostname.includes("vercel.app")) {
    // If frontend is on Vercel, backend is on Render
    BACKEND_API_URL = `https://fintech-dashboard-t3e1.onrender.com/api`;
  } else if (hostname.includes("netlify.app")) {
    // If frontend is on Netlify, backend is on Render
    BACKEND_API_URL = `https://fintech-dashboard-t3e1.onrender.com/api`;
  } else {
    // Local development or other hosting
    BACKEND_API_URL = `http://localhost:5001/api`;
  }
}

// Log the backend URL for debugging
console.log("Backend API URL:", BACKEND_API_URL);

// Function to update backend URL (for manual configuration)
window.setBackendURL = (url) => {
  BACKEND_API_URL = url;
  localStorage.setItem("BACKEND_API_URL", url);
  console.log("Backend URL updated to:", url);
};

// Utility functions
const showError = (message) => {
  const errorDiv = document.getElementById("errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 5000);
  } else {
    alert(message);
  }
};

const showSuccess = (message) => {
  const successDiv = document.getElementById("successMessage");
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.style.display = "block";
    setTimeout(() => {
      successDiv.style.display = "none";
    }, 3000);
  }
};

const showLoading = () => {
  const loadingDiv = document.getElementById("loading");
  const contentDiv = document.getElementById("dashboardContent");
  if (loadingDiv) loadingDiv.style.display = "block";
  if (contentDiv) contentDiv.style.display = "none";
};

const hideLoading = () => {
  const loadingDiv = document.getElementById("loading");
  const contentDiv = document.getElementById("dashboardContent");
  if (loadingDiv) loadingDiv.style.display = "none";
  if (contentDiv) contentDiv.style.display = "block";
};

// API helper functions
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  // Log the full URL being called for debugging
  const fullUrl = `${BACKEND_API_URL}${endpoint}`;
  console.log("Making API call to:", fullUrl);

  try {
    const response = await fetch(fullUrl, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    console.error("Full URL was:", fullUrl);
    console.error("Backend URL is:", BACKEND_API_URL);
    throw error;
  }
};

// Authentication functions
const login = async (username, password) => {
  try {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          role: data.role,
        })
      );
      return data;
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
};

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Add a signup function for shared use
const signup = async (username, password) => {
  try {
    const data = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// Dashboard functions
const loadDashboard = async () => {
  try {
    showLoading();
    const data = await apiCall("/dashboard/dashboard");

    // Update UI elements
    document.getElementById("username").textContent = data.username;
    document.getElementById("userRole").textContent = `Role: ${data.role}`;
    document.getElementById("roleBadge").textContent = data.role;
    document.getElementById("balance").textContent = `$${data.balance.toFixed(
      2
    )}`;
    document.getElementById("totalTransactions").textContent =
      data.totalTransaction;
    document.getElementById("accountStatus").textContent = "Active";

    // Handle profile image
    const profileImage = document.getElementById("profileImage");
    if (data.profileImage) {
      profileImage.src = data.profileImage.startsWith("http")
        ? data.profileImage
        : `${BACKEND_API_URL.replace("/api", "")}${data.profileImage}`;
    }

    hideLoading();
    return data;
  } catch (error) {
    hideLoading();
    showError("Failed to load dashboard: " + error.message);
    throw error;
  }
};

const refreshDashboard = () => {
  loadDashboard();
};

// Transaction functions
const makeTransaction = async (type, amount) => {
  try {
    const data = await apiCall("/transactions", {
      method: "POST",
      body: JSON.stringify({ type, amount }),
    });

    showSuccess(
      `Transaction successful! New balance: $${data.newBalance.toFixed(2)}`
    );
    return data;
  } catch (error) {
    showError("Transaction failed: " + error.message);
    throw error;
  }
};

const getTransactions = async () => {
  try {
    const data = await apiCall("/transactions");
    return data;
  } catch (error) {
    showError("Failed to load transactions: " + error.message);
    throw error;
  }
};

// Profile functions
const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });

    const token = localStorage.getItem("token");
    const response = await fetch(`${BACKEND_API_URL}/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Profile update failed");
    }

    showSuccess("Profile updated successfully!");
    return data;
  } catch (error) {
    showError("Profile update failed: " + error.message);
    throw error;
  }
};

// Page initialization
const initializePage = () => {
  const currentPage = window.location.pathname.split("/").pop();

  // Check authentication for protected pages
  if (
    currentPage !== "login.html" &&
    currentPage !== "signup.html" &&
    currentPage !== ""
  ) {
    if (!isAuthenticated()) {
      window.location.href = "login.html";
      return;
    }
  }

  // Initialize specific page functionality
  switch (currentPage) {
    case "login.html":
      initializeLoginPage();
      break;
    case "dashboard.html":
      initializeDashboardPage();
      break;
    case "transaction.html":
      initializeTransactionPage();
      break;
    case "profile.html":
      initializeProfilePage();
      break;
    default:
      if (currentPage === "" || currentPage === "index.html") {
        window.location.href = "login.html";
      }
  }
};

// Page-specific initializations
const initializeLoginPage = () => {
  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const loadingDiv = document.getElementById("loading");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Show loading state
      loginBtn.disabled = true;
      loginBtn.textContent = "Signing In...";
      loadingDiv.style.display = "block";

      try {
        await login(username, password);
        showSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } catch (error) {
        showError(error.message);
      } finally {
        // Reset loading state
        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";
        loadingDiv.style.display = "none";
      }
    });
  }
};

const initializeDashboardPage = () => {
  loadDashboard();
};

const initializeTransactionPage = () => {
  // Transaction page specific initialization
  console.log("Transaction page initialized");
};

const initializeProfilePage = () => {
  // Profile page specific initialization
  console.log("Profile page initialized");
};

// Global functions for HTML onclick handlers
window.logout = logout;
window.refreshDashboard = refreshDashboard;
window.makeTransaction = makeTransaction;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    login,
    logout,
    loadDashboard,
    makeTransaction,
    updateProfile,
    apiCall,
  };
}
