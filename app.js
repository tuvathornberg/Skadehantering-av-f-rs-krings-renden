const STORAGE_KEY = "taf-skadeflode-cases-v1";

const stageNames = ["Mottaget", "Akutåtgärd", "Uppdrag", "Utredning", "Bedömning", "Försäkring", "Besked", "Åtgärd", "Kostnad", "Avslut"];
const seedCases = [
  { id:"SK-26091", association:"Brf Sjögläntan", property:"Parkvägen 18 · lgh 1202", contact:"Anna Lindström", received:"2026-09-28", description:"Vatten droppar från taket i badrummet. Fastighetsskötare är kontaktad.", priority:"urgent", status:2, statusLabel:"Akutåtgärd krävs", statusTone:"orange", owner:"Matthias", updated:"För 12 min sedan", next:"Säkerställ skadebegränsning", scope:"full", orderChannel:"phone", insuranceModel:"undecided", insurer:"" },
  { id:"SK-26088", association:"Brf Eken", property:"Storgatan 4 · lgh 0901", contact:"Johan Ek", received:"2026-09-25", description:"Fuktutredning klar, åtgärdsförslag inväntar styrelsens beslut.", priority:"normal", status:5, statusLabel:"Beslut krävs", statusTone:"violet", owner:"Matthias", updated:"Igår kl. 15:42", next:"Presentera åtgärdsförslag", scope:"full", orderChannel:"system", insuranceModel:"taf", insurer:"Folksam" },
  { id:"SK-26084", association:"Brf Utsikten", property:"Höjdvägen 7 · lgh 0302", contact:"Sara Nyberg", received:"2026-09-22", description:"Skadeanmälan inskickad. Fuktutredning bifogad.", priority:"normal", status:6, statusLabel:"Försäkring pågår", statusTone:"blue", owner:"Matthias", updated:"Igår kl. 10:16", next:"Avvakta försäkringsbesked", scope:"full", orderChannel:"email", insuranceModel:"undecided", insurer:"Länsförsäkringar" },
  { id:"SK-26079", association:"Brf Linden", property:"Lindgatan 11 · lgh 0103", contact:"Erik Berg", received:"2026-09-18", description:"Torkning pågår enligt entreprenörens plan.", priority:"normal", status:8, statusLabel:"Åtgärd pågår", statusTone:"green", owner:"Matthias", updated:"26 sep kl. 09:03", next:"Följ upp egenkontroll", scope:"full", orderChannel:"system", insuranceModel:"insurer", insurer:"If" }
];

let cases = loadCases();
let activeView = "overview";
let activeFilter = null;
const newCaseTemplate = document.querySelector(".modal-card").innerHTML;

function loadCases() {
  try { const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(stored) && stored.length ? stored : seedCases; }
  catch { return seedCases; }
}
function saveCases() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cases)); }
function today() { return new Date().toISOString().slice(0, 10); }
function formatDate(value) { if (!value) return ""; return new Intl.DateTimeFormat("sv-SE", { day:"numeric", month:"short" }).format(new Date(`${value}T12:00:00`)); }
function activeCases() { return cases.filter(item => item.status < 10); }
function getStatusTone(item) { return item.statusTone || (item.status <= 2 ? "orange" : item.status <= 5 ? "violet" : item.status <= 7 ? "blue" : "green"); }
function getStatusLabel(item) { return item.statusLabel || stageNames[item.status - 1]; }
function getPriorityClass(item) { return item.priority === "urgent" ? "urgent" : item.status >= 8 ? "green" : item.status >= 5 ? "violet" : ""; }
function getScopeLabel(value) { return ({ full:"TAF/SBC hanterar hela processen", "acute-only":"TAF/SBC hanterar endast akutåtgärd", "board-takeover":"Styrelsen tar över efter akutåtgärd" }[value] || "Inte angivet"); }
function getOrderLabel(value) { return ({ "not-needed":"Inte aktuell ännu", phone:"Telefon – referens läggs till senare", system:"Beställd via system", email:"E-post med ärendereferens" }[value] || "Inte angivet"); }
function getInsuranceLabel(value) { return ({ undecided:"Inte bedömt ännu", insurer:"Försäkringsbolagets entreprenör", taf:"TAF/SBC:s entreprenör", board:"Styrelsen/boende hanterar" }[value] || "Inte angivet"); }

function render() {
  renderKpis(); renderCases(); renderAttention(); renderTimeline(); renderProcess();
  document.getElementById("navCaseCount").textContent = activeCases().length;
  document.getElementById("breadcrumbCurrent").textContent = activeView === "cases" ? "Alla ärenden" : activeView === "tasks" ? "Mina uppgifter" : "Översikt";
  document.getElementById("pageTitle").innerHTML = activeView === "overview" ? "God morgon, Matthias <span>✦</span>" : activeView === "cases" ? "Alla ärenden" : "Mina uppgifter";
  document.getElementById("pageSubtitle").textContent = activeView === "overview" ? "Här är läget i dina skadeärenden idag." : activeView === "cases" ? "Sök, filtrera och följ upp alla registrerade ärenden." : "Tre uppgifter behöver hanteras av dig idag.";
}
function renderKpis() {
  document.getElementById("activeCount").textContent = activeCases().length;
  document.getElementById("urgentCount").textContent = activeCases().filter(c => c.priority === "urgent").length;
  document.getElementById("waitingCount").textContent = activeCases().filter(c => [3,5,7].includes(c.status)).length;
  document.getElementById("closedCount").textContent = cases.filter(c => c.status >= 10).length;
}
function renderCases() {
  const list = document.getElementById("caseList");
  let visible = activeView === "cases" ? cases : activeCases();
  if (activeFilter) visible = visible.filter(c => c.status === activeFilter || (activeFilter === 1 && c.priority === "urgent"));
  list.innerHTML = visible.map(caseCard).join("");
  document.getElementById("emptyState").classList.toggle("hidden", visible.length > 0);
  list.querySelectorAll(".case-card").forEach(card => card.addEventListener("click", () => openCase(card.dataset.id)));
}
function caseCard(item) {
  return `<article class="case-card" data-id="${item.id}"><div class="case-priority ${getPriorityClass(item)}"></div><div><div class="case-title"><strong>${escapeHtml(item.association)}</strong><span class="case-id">${item.id}</span></div><p class="case-property">${escapeHtml(item.property)}</p><div class="case-meta"><span>◷ ${formatDate(item.received)}</span><span>● ${escapeHtml(item.owner)}</span><span>› ${escapeHtml(item.next || "Nästa steg saknas")}</span></div></div><span class="status-pill ${getStatusTone(item)}">${escapeHtml(getStatusLabel(item))}</span></article>`;
}
function renderAttention() {
  const items = activeCases().filter(c => c.priority === "urgent" || [3,5,7].includes(c.status)).slice(0, 4);
  document.getElementById("attentionCount").textContent = items.length;
  document.getElementById("attentionList").innerHTML = items.length ? items.map(item => `<div class="attention-item" data-id="${item.id}"><div class="attention-symbol">${item.priority === "urgent" ? "!" : "◷"}</div><div><strong>${item.priority === "urgent" ? "Akut åtgärd krävs" : escapeHtml(item.next || "Beslut krävs")}</strong><span>${escapeHtml(item.association)} · ${item.id}</span></div></div>`).join("") : `<p class="muted-copy">Inget kräver omedelbar uppmärksamhet.</p>`;
  document.querySelectorAll(".attention-item").forEach(item => item.addEventListener("click", () => openCase(item.dataset.id)));
}
function renderTimeline() {
  const events = cases.slice(0, 4).map((item, index) => ({ tone:index === 1 ? "green" : index === 2 ? "violet" : "", text:`<strong>${escapeHtml(item.id)}</strong> · ${escapeHtml(item.next || getStatusLabel(item))}`, time:item.updated || "Nyss" }));
  document.getElementById("timeline").innerHTML = events.map(e => `<div class="timeline-item"><span class="timeline-dot ${e.tone}"></span><div><p>${e.text}</p><time>${e.time}</time></div></div>`).join("");
}
function renderProcess() {
  const counts = stageNames.map((_, i) => activeCases().filter(c => c.status === i + 1).length);
  const current = activeCases().length ? Math.max(...activeCases().map(c => c.status)) : 0;
  document.getElementById("processOverview").innerHTML = stageNames.map((name, i) => `<div class="process-stage ${counts[i] ? "current" : i < current ? "done" : ""}" title="${counts[i]} ärenden"><div class="stage-circle">${counts[i] || (i < current ? "✓" : i + 1)}</div><div class="stage-name">${name}</div></div>`).join("");
}
function openCase(id) {
  const item = cases.find(c => c.id === id); if (!item) return;
  const advance = item.status < 10 ? `<button class="primary-button" id="advanceCase">Flytta till nästa steg <span>→</span></button>` : "";
  const checklist = ["Ärendet registrerat i SBC Hemma", "Styrelse och boende kontaktade", "Relevant garanti kontrollerad", "Skaderapport sparad", "Kostnader och fakturor hanterade"];
  const checked = Math.min(Math.max(item.status - 2, 0), checklist.length);
  showModal(`<div class="modal-header"><div><p class="eyebrow">${item.id} · ${escapeHtml(getStatusLabel(item).toUpperCase())}</p><h2>${escapeHtml(item.association)}</h2><p class="detail-subtitle">${escapeHtml(item.property)}</p></div><button class="close-button" id="closeModal" aria-label="Stäng">×</button></div><div class="detail-progress"><div class="detail-progress-top"><strong>Processläge</strong><span>Steg ${item.status} av 10</span></div><div class="progress-track"><i style="width:${item.status * 10}%"></i></div><div class="detail-next"><span class="next-symbol">→</span><div><small>Nästa rekommenderade steg</small><strong>${escapeHtml(item.next || stageNames[Math.min(item.status, 9)])}</strong></div></div></div><div class="detail-info"><div><span>Kontaktperson</span><strong>${escapeHtml(item.contact)}</strong></div><div><span>Inkom</span><strong>${formatDate(item.received)}</strong></div><div><span>Ansvarig</span><strong>${escapeHtml(item.owner)}</strong></div></div><div class="detail-info detail-info-secondary"><div><span>Hanteringsomfattning</span><strong>${escapeHtml(getScopeLabel(item.scope))}</strong></div><div><span>Akutbeställning</span><strong>${escapeHtml(getOrderLabel(item.orderChannel))}</strong></div><div><span>Försäkringsspår</span><strong>${escapeHtml(getInsuranceLabel(item.insuranceModel))}${item.insurer ? ` · ${escapeHtml(item.insurer)}` : ""}</strong></div></div><p class="detail-description">${escapeHtml(item.description)}</p><div class="checklist"><div class="checklist-heading"><strong>Avslutskontroll</strong><span>${checked}/${checklist.length}</span></div>${checklist.map((entry, i) => `<label><input type="checkbox" ${i < checked ? "checked" : ""} /> <span>${entry}</span></label>`).join("")}</div><div class="modal-actions"><button type="button" class="secondary-button" id="closeModalAlt">Stäng</button>${advance}</div>`);
  document.getElementById("advanceCase")?.addEventListener("click", () => { advanceCase(item.id); closeModal(); });
  document.getElementById("closeModalAlt")?.addEventListener("click", closeModal);
}
function advanceCase(id) {
  const item = cases.find(c => c.id === id); if (!item || item.status >= 10) return;
  item.status += 1; item.statusLabel = item.status >= 10 ? "Avslutat" : stageNames[item.status - 1]; item.statusTone = item.status >= 10 ? "green" : getStatusTone(item); item.priority = item.status > 2 ? "normal" : item.priority; item.updated = "Just nu"; item.next = item.status >= 10 ? "Ärendet avslutat" : `Fortsätt med ${stageNames[item.status - 1].toLowerCase()}`; saveCases(); render(); toast(`${item.id} flyttades till steg ${item.status} av 10.`);
}
function bindNewCaseForm() { const form = document.getElementById("caseForm"); if (!form || form.dataset.bound) return; form.dataset.bound = "true"; form.addEventListener("submit", createCase); document.getElementById("cancelModal")?.addEventListener("click", closeModal); }
function showModal(content) { const modal = document.getElementById("caseModal"); modal.querySelector(".modal-card").innerHTML = content; modal.classList.remove("hidden"); modal.querySelector("#closeModal")?.addEventListener("click", closeModal); }
function closeModal() { const modal = document.getElementById("caseModal"); modal.classList.add("hidden"); if (!document.getElementById("caseForm")) { modal.querySelector(".modal-card").innerHTML = newCaseTemplate; bindNewCaseForm(); } }
function openNewCase() { if (!document.getElementById("caseForm")) { document.querySelector(".modal-card").innerHTML = newCaseTemplate; bindNewCaseForm(); } document.getElementById("caseForm").reset(); document.querySelector('[name="received"]').value = today(); document.getElementById("caseModal").classList.remove("hidden"); }
function createCase(event) { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); const number = 26100 + cases.length + 1; cases.unshift({ id:`SK-${number}`, association:data.association, property:data.property, contact:data.contact, received:data.received, description:data.description, priority:data.priority === "normal" ? "normal" : "urgent", status:1, statusLabel:data.priority === "urgent" ? "Akutåtgärd krävs" : "Mottaget", statusTone:data.priority === "urgent" ? "orange" : "blue", owner:data.owner, updated:"Just nu", next:data.priority === "urgent" ? "Säkerställ skadebegränsning" : "Bedöm akutläge", scope:data.scope, orderChannel:data.orderChannel, insuranceModel:data.insuranceModel, insurer:data.insurer }); saveCases(); closeModal(); render(); toast("Ärendet skapades och ligger nu i översikten."); }
function toast(message) { const el = document.getElementById("toast"); el.textContent = message; el.classList.remove("hidden"); setTimeout(() => el.classList.add("hidden"), 3200); }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char])); }

document.getElementById("newCaseButton").addEventListener("click", openNewCase);
document.getElementById("closeModal").addEventListener("click", closeModal);
bindNewCaseForm();
document.getElementById("caseModal").addEventListener("click", event => { if (event.target.id === "caseModal") closeModal(); });
document.getElementById("showAllButton").addEventListener("click", () => { activeView = "cases"; activeFilter = null; document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === "cases")); render(); });
document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => { activeView = button.dataset.view; activeFilter = null; document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b === button)); render(); }));
document.querySelectorAll(".process-link").forEach(button => button.addEventListener("click", () => { activeView = "cases"; activeFilter = Number(button.dataset.process); document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === "cases")); render(); }));
document.getElementById("guideButton").addEventListener("click", () => toast("Processguiden kopplas till det fullständiga processunderlaget i nästa version."));
render();
