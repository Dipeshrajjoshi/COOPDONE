/* =========================
   CoopDone – FINAL JS (COMPLETE)
   ========================= */

let applications = JSON.parse(localStorage.getItem("applications")) || [];
let weeklyTarget = localStorage.getItem("weeklyTarget") || "";
let darkMode = localStorage.getItem("darkMode") === "true";
let statusChart = null;
let deleteIndex = null;

/* ---------- DOM ---------- */
const form = document.getElementById("application-form");
const editIndexInput = document.getElementById("edit-index");
const tableBody = document.getElementById("applications-table");

const totalApplicationsEl = document.getElementById("total-applications");
const weeklyTargetInput = document.getElementById("weekly-target");
const weeklyAppliedEl = document.getElementById("weekly-applied");

const countAppliedEl = document.getElementById("count-applied");
const countInProcessEl = document.getElementById("count-inprocess");
const countInterviewEl = document.getElementById("count-interview");
const countRejectedEl = document.getElementById("count-rejected");

const daysLeftEl = document.getElementById("days-left");
const dailyQuoteEl = document.getElementById("daily-quote");

const coopStartInput = document.getElementById("coop-start");
const coopEndInput = document.getElementById("coop-end");

const csvImportInput = document.getElementById("csv-import");
const csvExportBtn = document.getElementById("export-csv");

/* ---------- DARK MODE TOGGLE ---------- */
const darkToggle = document.getElementById("dark-mode-toggle");

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  if (darkToggle) darkToggle.textContent = "☀️ Light Mode";
}

darkToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
  darkToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});


/* ---------- SAVE ---------- */
function save() {
  localStorage.setItem("applications", JSON.stringify(applications));
  localStorage.setItem("weeklyTarget", weeklyTarget);
  localStorage.setItem("darkMode", darkMode);
}

/* ---------- DARK MODE ---------- */
if (darkMode) document.body.classList.add("dark");

/* ---------- DAILY MOTIVATION ---------- */
const quotes = [
  "Consistency beats motivation.",
  "One application today is progress.",
  "Small steps compound into results.",
  "Your co-op is closer than you think.",
  "Discipline creates opportunities."
];

function setDailyQuote() {
  if (!dailyQuoteEl) return;
  const day = new Date().getDate();
  dailyQuoteEl.textContent = quotes[day % quotes.length];
}

/* ---------- CO-OP DAY COUNTER ---------- */
function updateDayCounter() {
  if (!coopStartInput || !coopEndInput || !daysLeftEl) return;

  if (!coopStartInput.value || !coopEndInput.value) {
    daysLeftEl.textContent = "—";
    return;
  }

  const today = new Date();
  const end = new Date(coopEndInput.value);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  daysLeftEl.textContent = diff >= 0 ? diff : "Ended";
}

coopStartInput?.addEventListener("change", updateDayCounter);
coopEndInput?.addEventListener("change", updateDayCounter);

/* ---------- WEEK CHECK ---------- */
function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return date >= start && date < end;
}

/* ---------- DASHBOARD ---------- */
function updateDashboard() {
  totalApplicationsEl.textContent = applications.length;

  const counts = {
    Applied: 0,
    "In Process": 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0
  };

  let weeklyCount = 0;

  applications.forEach(app => {
    if (counts[app.status] !== undefined) counts[app.status]++;
    if (isThisWeek(app.dateApplied)) weeklyCount++;
  });

  countAppliedEl.textContent = counts.Applied;
  countInProcessEl.textContent = counts["In Process"];
  countInterviewEl.textContent = counts.Interview;
  countRejectedEl.textContent = counts.Rejected;
  weeklyAppliedEl.textContent = weeklyCount;

  updateChart(counts);
}

/* ---------- STATUS BADGE ---------- */
function statusBadge(status) {
  const map = {
    Applied: "status-applied",
    "In Process": "status-inprocess",
    Interview: "status-interview",
    Offer: "status-offer",
    Rejected: "status-rejected"
  };
  return `<span class="status-badge ${map[status]}">${status}</span>`;
}

/* ---------- TABLE ---------- */
function renderTable() {
  tableBody.innerHTML = "";

  applications.forEach((app, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${app.company}</td>
      <td>${app.role}</td>
      <td>${app.roleType}</td>
      <td>${statusBadge(app.status)}</td>
      <td>${app.deadline || "-"}</td>
      <td>
        <button class="view-btn" data-index="${index}">View</button>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </td>
    `;

    const details = document.createElement("tr");
    details.innerHTML = `
      <td colspan="6">
        <div class="details-box" style="display:none">
          <p><strong>Date Applied:</strong> ${app.dateApplied || "-"}</p>
          <p><strong>Confidence:</strong> ${app.confidence}</p>
          <p><a href="${app.resumeLink}" target="_blank">Resume</a></p>
          <p><a href="${app.prepLink}" target="_blank">Preparation</a></p>
          <p><a href="${app.jobLink}" target="_blank">Job Link</a></p>
          <p>${app.notes || ""}</p>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
    tableBody.appendChild(details);
  });
}

/* ---------- TABLE ACTIONS ---------- */
tableBody.addEventListener("click", e => {
  const index = e.target.dataset.index;

  if (e.target.classList.contains("view-btn")) {
    const box = e.target.closest("tr").nextElementSibling.querySelector(".details-box");
    box.style.display = box.style.display === "none" ? "block" : "none";
  }

  if (e.target.classList.contains("edit-btn")) {
    const app = applications[index];
    Object.keys(app).forEach(k => form[k] && (form[k].value = app[k]));
    editIndexInput.value = index;
    window.scrollTo({ top: form.offsetTop - 40, behavior: "smooth" });
  }

  if (e.target.classList.contains("delete-btn")) {
    deleteIndex = index;
    showDeleteModal();
  }
});

/* ---------- DELETE MODAL ---------- */
function showDeleteModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal">
      <h3>Delete Application?</h3>
      <p>This action cannot be undone.</p>
      <div class="modal-actions">
        <button id="cancel-delete">Cancel</button>
        <button class="delete-btn" id="confirm-delete">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("cancel-delete").onclick = () => overlay.remove();
  document.getElementById("confirm-delete").onclick = () => {
    applications.splice(deleteIndex, 1);
    save();
    renderTable();
    updateDashboard();
    overlay.remove();
  };
}

/* ---------- FORM SUBMIT ---------- */
form.addEventListener("submit", e => {
  e.preventDefault();

  const appData = {
    company: form.company.value,
    role: form.role.value,
    roleType: form.roleType.value,
    dateApplied: form.dateApplied.value,
    deadline: form.deadline.value,
    status: form.status.value,
    confidence: form.confidence.value,
    resumeLink: form.resumeLink.value,
    prepLink: form.prepLink.value,
    jobLink: form.jobLink.value,
    notes: form.notes.value,
    createdAt:
      editIndexInput.value !== ""
        ? applications[editIndexInput.value].createdAt
        : new Date().toISOString()
  };

  if (editIndexInput.value !== "") {
    applications[editIndexInput.value] = appData;
    editIndexInput.value = "";
  } else {
    applications.push(appData);
  }

  save();
  form.reset();
  renderTable();
  updateDashboard();
});

/* ---------- WEEKLY TARGET ---------- */
weeklyTargetInput.value = weeklyTarget;
weeklyTargetInput.addEventListener("input", e => {
  weeklyTarget = e.target.value;
  save();
});

/* ---------- CSV EXPORT ---------- */
csvExportBtn.addEventListener("click", () => {
  if (!applications.length) return;

  const headers = Object.keys(applications[0]);
  const rows = applications.map(app =>
    headers.map(h => `"${(app[h] || "").replace(/"/g, '""')}"`).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "coopdone_applications.csv";
  a.click();
});

/* ---------- CSV IMPORT ---------- */
csvImportInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const [head, ...lines] = reader.result.split("\n");
    const headers = head.split(",");

    applications = lines.filter(Boolean).map(line => {
      const values = line.split(",").map(v => v.replace(/^"|"$/g, ""));
      const obj = {};
      headers.forEach((h, i) => (obj[h] = values[i]));
      return obj;
    });

    save();
    renderTable();
    updateDashboard();
  };
  reader.readAsText(file);
});

/* ---------- CHART ---------- */
function updateChart(counts) {
  const ctx = document.getElementById("statusChart");
  if (!ctx) return;

  if (statusChart) statusChart.destroy();

  statusChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ["#6366f1", "#facc15", "#22c55e", "#38bdf8", "#ef4444"]
      }]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });
}

/* ---------- INIT ---------- */
setDailyQuote();
updateDayCounter();
renderTable();
updateDashboard();
