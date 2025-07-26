// Set the backend API URL
const API = "http://localhost:5001/api"; // Ensure correct backend port

// Handle form submission
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent page reload
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Make POST request to register endpoint
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  alert(data.message || "Registered successfully");

  // Redirect to login
  if (res.status === 201) window.location.href = "login.html";
});
