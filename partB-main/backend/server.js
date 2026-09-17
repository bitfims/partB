const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, "data");

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

function readData(file) {
  const filePath = path.join(DATA_DIR, file);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(file, data) {
  const filePath = path.join(DATA_DIR, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const users = readData("users.json");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid email or password." });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

app.get("/api/projects", (req, res) => {
  res.json(readData("projects.json"));
});

app.post("/api/projects", (req, res) => {
  const projects = readData("projects.json");
  const project = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    status: req.body.status,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    affectedArea: req.body.affectedArea,
    latitude: Number(req.body.latitude),
    longitude: Number(req.body.longitude)
  };

  projects.push(project);
  writeData("projects.json", projects);
  res.status(201).json(project);
});

app.put("/api/projects/:id", (req, res) => {
  const projects = readData("projects.json");
  const index = projects.findIndex(p => p.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "Project not found." });

  projects[index] = { ...projects[index], ...req.body };
  writeData("projects.json", projects);
  res.json(projects[index]);
});

app.delete("/api/projects/:id", (req, res) => {
  let projects = readData("projects.json");
  const originalLength = projects.length;
  projects = projects.filter(p => p.id != req.params.id);

  if (projects.length === originalLength)
    return res.status(404).json({ message: "Project not found." });

  writeData("projects.json", projects);
  res.json({ message: "Project deleted." });
});

app.get("/api/announcements", (req, res) => {
  res.json(readData("announcements.json"));
});

app.post("/api/announcements", (req, res) => {
  const announcements = readData("announcements.json");
  const announcement = {
    id: Date.now(),
    title: req.body.title,
    message: req.body.message,
    date: new Date().toISOString().slice(0, 10)
  };

  announcements.unshift(announcement);
  writeData("announcements.json", announcements);
  res.status(201).json(announcement);
});

app.post("/api/reports", (req, res) => {



  const name = String(req.body.name || "").trim();
  const location = String(req.body.location || "").trim();
  const description = String(req.body.description || "").trim();

  if (name.length < 2 || !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
    return res.status(400).json({
      message: "Please enter a valid name.",
    });
  }

  if (location.length < 3 || !/^[a-zA-Z0-9À-ÿ\s.,'()#-]+$/.test(location)) {
    return res.status(400).json({
      message: "Please enter a valid location.",
    });
  }

  if (description.length < 20 || !/[a-zA-Z]/.test(description)) {
    return res.status(400).json({
      message: "Please provide a more detailed description.",
    });
  }




  const reports = readData("reports.json");
  const report = {
    id: Date.now(),
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    date: new Date().toISOString().slice(0, 10),
    status: "Pending"
  };

  reports.unshift(report);
  writeData("reports.json", reports);
  res.status(201).json(report);
});

app.get("/api/reports", (req, res) => {
  res.json(readData("reports.json"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`UNIVEN Construction System running at http://localhost:${PORT}`);
});
