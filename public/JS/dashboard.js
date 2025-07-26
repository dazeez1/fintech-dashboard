// Set the backend API URL
const API = "http://localhost:5001/api"; // Ensure correct backend port

// Get token from localStorage
const token = localStorage.getItem("token");

// Fetch dashboard data
async function loadDashboard() {
  const res = await fetch(`${API}/dashboard/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  // Log the profileImage value for debugging
  console.log("profileImage from dashboard:", data.profileImage);

  // Handle image display, clean up double slashes
  const imageSrc = data.profileImage
    ? `http://localhost:5001${
        data.profileImage.startsWith("/")
          ? data.profileImage
          : "/" + data.profileImage
      }`
    : null;
  const imageTag = imageSrc
    ? `<img src="${imageSrc}" width="150" />`
    : "<p>No profile image uploaded</p>";

  document.getElementById("dashboard").innerHTML = ` 
    ${imageTag}
    <p>Username: ${data.username}</p> 
    <p>Role: ${data.role}</p> 
    <p>Balance: $${data.balance}</p> 
    <p>Total Transactions: ${data.totalTransaction}</p> 
  `;
}

// Logout helper
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

loadDashboard();
