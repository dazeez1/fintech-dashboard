// Set the backend API URL 
const API = 'http://localhost:5000/api'; // Change for production 

document.getElementById('txnForm').addEventListener('submit', async (e) => { 
  e.preventDefault(); 

  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value); 

  const res = await fetch(`${API}/transactions`, { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('token')}` 
    }, 
    body: JSON.stringify({ type, amount }) 
  }); 

  const data = await res.json(); 
  alert(data.message); 

  if (res.status === 201) { 
    window.location.href = 'dashboard.html'; 
  } 
});
