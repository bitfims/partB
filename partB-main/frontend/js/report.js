requireLogin();
document.getElementById("reportForm").addEventListener("submit", async e => {
  e.preventDefault();


const name = document.getElementById("name").value.trim();
const location = document.getElementById("location").value.trim();
const description = document.getElementById("description").value.trim();
const msg = document.getElementById("message");



if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
  msg.textContent =
    "Name can only contain letters, spaces, hyphens, and apostrophes.";
  return;
}

if (!/^[a-zA-Z0-9À-ÿ\s.,'()#-]+$/.test(location)) {
  msg.textContent = "Please enter a valid location.";
  return;
}




if (name.length < 2) {
  msg.textContent = "Please enter a valid name.";
  return;
}

if (location.length < 3) {
  msg.textContent = "Please enter a valid location.";
  return;
}

if (description.length < 10) {
  msg.textContent = "Description must be at least 10 characters.";
  return;
}

if (!/[a-zA-Z]/.test(description)) {
  msg.textContent = "Please describe the problem using words.";
  return;
}







  const response = await fetch("/api/reports", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name: name,
      location:location,
      description: description
    })
  });
  const data = await response.json();

  msg.textContent = response.ok ? "Report submitted successfully." : data.message;
  msg.className = response.ok ? "success" : "error";
  if (response.ok) e.target.reset();
});
