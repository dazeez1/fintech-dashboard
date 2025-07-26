// Set the backend API URL
const API = "http://localhost:5001/api"; // Ensure correct backend port

// Handle form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Make POST request to login endpoint
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token); // Save JWT for reuse
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } else {
    alert(data.message || "Login failed");
  }
});
