const user = requireLogin();
async function loadProjects() {
  const response = await fetch("/api/projects");
  const projects = await response.json();
  const container = document.getElementById("projects");
  container.innerHTML = projects.map(p => `
    <article class="card">
      <span class="badge">${p.status}</span>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p><b>Location:</b> ${p.location}</p>
      <p><b>Start:</b> ${p.startDate}<br><b>Expected end:</b> ${p.endDate}</p>
      <p><b>Affected:</b> ${p.affectedArea}</p>
    </article>`).join("");
}
loadProjects();
