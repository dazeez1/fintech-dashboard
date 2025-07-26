document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const API = "http://localhost:5001/api";
  const res = await fetch(`${API}/profile/upload-profile`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"), // ✅ fixed Authorization header
    },
    body: formData,
  });

  const data = await res.json();

  if (res.ok) {
    alert(data.message);
  } else {
    alert(data.error || "Upload failed");
  }
});
