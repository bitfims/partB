requireLogin();
async function loadAnnouncements() {
  const response = await fetch("/api/announcements");
  const announcements = await response.json();
  document.getElementById("announcements").innerHTML = announcements.map(a => `
    <article class="notice"><h3>${a.title}</h3><p>${a.message}</p><small>Published: ${a.date}</small></article>
  `).join("");
}
loadAnnouncements();
