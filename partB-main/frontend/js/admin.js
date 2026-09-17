const user = requireLogin();
if (user.role !== "admin") {
  alert("Admin access only.");
  location.href = "dashboard.html";
}

document.getElementById("projectForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    name: name.value, description: description.value, location: location.value,
    status: status.value, startDate: startDate.value, endDate: endDate.value,
    affectedArea: affectedArea.value, latitude: latitude.value, longitude: longitude.value
  };
  const response = await fetch("/api/projects", {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data)
  });
  document.getElementById("projectMessage").textContent = response.ok ? "Project added." : "Could not add project.";
  if (response.ok) { e.target.reset(); loadAdmin(); }
});

document.getElementById("announcementForm").addEventListener("submit", async e => {
  e.preventDefault();
  const response = await fetch("/api/announcements", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({title:title.value, message:announcementMessage.value})
  });
  document.getElementById("announcementMessageResult").textContent = response.ok ? "Notice published." : "Could not publish notice.";
  if (response.ok) e.target.reset();
});

async function loadAdmin() {
  const [pRes, rRes] = await Promise.all([fetch("/api/projects"), fetch("/api/reports")]);
  const projects = await pRes.json(), reports = await rRes.json();

  document.getElementById("adminProjects").innerHTML = projects.map(p => `
    <article class="card">
      <span class="badge">${p.status}</span><h3>${p.name}</h3>
      <p>${p.location}</p>
      <button class="btn danger" onclick="deleteProject(${p.id})">Delete</button>
    </article>`).join("");

  document.getElementById("reports").innerHTML = reports.length ? reports.map(r => `
    <article class="notice report-item"><h3>${r.location}</h3>
      <p>${r.description}</p><small>By ${r.name} on ${r.date} — ${r.status}</small>
    </article>`).join("") : '<div class="empty">No student reports yet.</div>';
}

async function deleteProject(id) {
  if (!confirm("Delete this project?")) return;
  await fetch("/api/projects/" + id, {method:"DELETE"});
  loadAdmin();
}
loadAdmin();
