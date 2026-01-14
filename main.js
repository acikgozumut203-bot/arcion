const API_URL = "http://localhost:3000/api/codes";

const codeList = document.getElementById("codeList");
const searchInput = document.getElementById("searchInput");

let allCodes = [];

/* =========================
   BACKEND'DEN KODLARI ÇEK
========================= */
async function fetchCodes() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allCodes = data;
    renderCodes(allCodes);
    loadLanguages(allCodes);
  } catch (err) {
    codeList.innerHTML = "<p>❌ Kodlar yüklenemedi</p>";
    console.error(err);
  }
}

/* =========================
   KODLARI EKRANA BAS
========================= */
function renderCodes(codes) {
  codeList.innerHTML = "";

  if (!codes || codes.length === 0) {
    codeList.innerHTML = "<p>Henüz kod paylaşılmadı</p>";
    return;
  }

  codes.forEach(code => {
    const card = document.createElement("div");
    card.className = "code-card";

    card.innerHTML = `
      <h2>${code.title}</h2>
      <span class="language">${code.language}</span>
      <p class="description">${code.description}</p>
      <pre><code class="language-${code.language.toLowerCase()}">
${escapeHtml(code.code)}
      </code></pre>
    `;

    codeList.appendChild(card);
  });

  if (window.hljs) {
    hljs.highlightAll();
  }
}

/* =========================
   ARAMA (BAŞLIĞA GÖRE)
========================= */
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();

  const filtered = allCodes.filter(code =>
    code.title.toLowerCase().includes(value)
  );

  renderCodes(filtered);
});

/* =========================
   DİLLERİ SIDEBAR'A YÜKLE
========================= */
function loadLanguages(codes) {
  const languageList = document.getElementById("languageList");
  if (!languageList) return;

  const languages = [...new Set(codes.map(c => c.language))];
  languageList.innerHTML = "";

  languages.forEach(lang => {
    const li = document.createElement("li");
    li.textContent = lang;

    li.addEventListener("click", () => {
      const filtered = allCodes.filter(c => c.language === lang);
      renderCodes(filtered);
    });

    languageList.appendChild(li);
  });
}

/* =========================
   GÜVENLİ HTML
========================= */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* =========================
   SAYFA AÇILINCA
========================= */
fetchCodes();
