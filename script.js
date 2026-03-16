const MY_NAME_NORMALIZED = normalizeName("Zican Dong");

const news = [
  "2025.12: Completed internship on foundation models at ModelBest.",
  "2025.08: Multiple papers accepted by ACL / EMNLP / NeurIPS.",
  "2024.06: Long-context and positional-encoding work selected as NeurIPS Spotlight.",
  "2024.01: Joined Baichuan for pretraining-related LLM research."
];
const PUB_VIEW_KEY = "pub_view_mode";
const PUBLICATION_SUMMARIES = {
  "DBLP:journals/corr/abs-2303-18223": [
    "This survey reviews the modern LLM landscape from pre-training to adaptation, usage, and evaluation.",
    "It also organizes practical resources and highlights open challenges that shape future LLM research."
  ],
  "DBLP:conf/emnlp/TangLCHYDZNW22": [
    "TextBox 2.0 presents a unified toolkit for text generation with pre-trained language models and common training/evaluation workflows.",
    "It lowers engineering overhead and makes controlled, reproducible generation experiments easier across tasks."
  ],
  "DBLP:conf/emnlp/JiangZDYZW23": [
    "StructGPT proposes an iterative reading-then-reasoning framework for solving questions over structured data with LLMs.",
    "By separating evidence collection from reasoning, it substantially improves zero-shot performance on multiple structured QA settings."
  ],
  "DBLP:journals/corr/abs-2302-14502": [
    "This survey systematically analyzes transformer-based long-text modeling methods across architecture, training, and evaluation.",
    "It summarizes representative solutions for handling long-range dependencies and points out key bottlenecks for future work."
  ],
  "DBLP:conf/coling/DongTLZW24": [
    "BAMBOO introduces a comprehensive benchmark to evaluate how well LLMs handle long-context understanding and reasoning.",
    "It provides diversified tasks and analyses that expose important capability gaps not visible in short-context evaluation."
  ],
  "DBLP:journals/corr/abs-2405-18009": [
    "This work studies context-window extension through decomposed positional vectors to better understand positional behavior in LLMs.",
    "The method improves long-context generalization and offers practical insights for robust position encoding design."
  ],
  "DBLP:conf/emnlp/PengJDZF25": [
    "CAFE introduces a retrieval-head-driven coarse-to-fine information seeking strategy for multi-document QA.",
    "It improves evidence selection efficiency and boosts answer quality by progressively narrowing the search space."
  ],
  "DBLP:journals/corr/abs-2602-03203": [
    "ForesightKV is a training-based KV-cache eviction framework for long reasoning traces in LLM inference.",
    "By learning long-term token contribution signals, it preserves performance under tight cache budgets while improving efficiency."
  ],
  "EASY-EP": [
    "EASY-EP explores domain-specific expert specialization in large MoE models and uses few-shot demonstrations to localize useful experts.",
    "It prunes redundant experts with minimal quality loss, enabling substantially faster and lighter domain deployment."
  ],
  "DBLP:conf/acl/DongLJXZWC25": [
    "LongReD addresses the short-text degradation issue that can appear when training long-context LLMs.",
    "It uses restoration distillation to retain short-context quality while preserving long-context capability."
  ],
  "DBLP:conf/acl/HuS0DW00JDLMZW25": [
    "YuLan-Mini studies data-efficient pretraining for open language models with a strong emphasis on quality per training token.",
    "It demonstrates competitive performance under constrained data budgets and provides practical scaling evidence."
  ],
  "DBLP:conf/emnlp/ChenJMDWZW25": [
    "Sticker-TTS proposes a sticker-driven test-time scaling framework that leverages historical experience during inference.",
    "The approach improves adaptive reasoning at test time and consistently strengthens downstream performance."
  ],
  "DBLP:journals/corr/abs-2510-18480": [
    "This paper critically examines how efficiency is evaluated for diffusion language models and where current practice can be misleading.",
    "It provides a clearer evaluation perspective and recommendations for fairer, more informative efficiency comparisons."
  ]
};
const researchHighlights = [
  {
    topic: "Long-Text Efficiency",
    keywords: ["foresightkv"]
  },
  {
    topic: "Long-Text Training",
    keywords: ["longred"]
  },
  {
    topic: "Attention and Positional Encoding",
    keywords: ["exploring context window", "decomposed positional vectors", "exploring"]
  },
  {
    topic: "Long-Text Evaluation",
    keywords: ["bamboo"]
  },
  {
    topic: "MoE",
    keywords: ["domain specific pruning", "easy-ep", "domain-specirci", "domain-specific"]
  }
];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanTex(value) {
  return String(value || "")
    .replace(/\{\-\}/g, "-")
    .replace(/[{}]/g, "")
    .replace(/\\&/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(name) {
  let n = cleanTex(name).toLowerCase();
  if (n.includes(",")) {
    const parts = n.split(",");
    if (parts.length >= 2) {
      n = `${parts[1].trim()} ${parts[0].trim()}`;
    }
  }
  return n.replace(/[^a-z]/g, "");
}

function parseAuthors(authorField) {
  return cleanTex(authorField)
    .split(/\s+and\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitBibEntries(text) {
  const entries = [];
  let i = 0;
  while (i < text.length) {
    const at = text.indexOf("@", i);
    if (at === -1) {
      break;
    }

    const typeMatch = text.slice(at + 1).match(/^([a-zA-Z]+)/);
    if (!typeMatch) {
      i = at + 1;
      continue;
    }
    const entryType = typeMatch[1].toLowerCase();
    let j = at + 1 + entryType.length;
    while (j < text.length && /\s/.test(text[j])) j += 1;
    if (text[j] !== "{") {
      i = j + 1;
      continue;
    }

    let depth = 0;
    let end = j;
    for (; end < text.length; end += 1) {
      if (text[end] === "{") depth += 1;
      else if (text[end] === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    if (end >= text.length) break;

    const body = text.slice(j + 1, end).trim();
    entries.push(parseBibBody(entryType, body));
    i = end + 1;
  }
  return entries.filter(Boolean);
}

function parseBibBody(entryType, body) {
  const firstComma = body.indexOf(",");
  if (firstComma === -1) {
    return null;
  }
  const key = body.slice(0, firstComma).trim();
  const content = body.slice(firstComma + 1);
  const fields = {};
  let i = 0;

  while (i < content.length) {
    while (i < content.length && /[\s,]/.test(content[i])) i += 1;
    if (i >= content.length) break;

    const keyStart = i;
    while (i < content.length && /[a-zA-Z0-9_\-]/.test(content[i])) i += 1;
    const fieldName = content.slice(keyStart, i).toLowerCase();
    while (i < content.length && /\s/.test(content[i])) i += 1;
    if (content[i] !== "=") {
      while (i < content.length && content[i] !== ",") i += 1;
      continue;
    }
    i += 1;
    while (i < content.length && /\s/.test(content[i])) i += 1;

    let value = "";
    if (content[i] === "{") {
      let depth = 0;
      i += 1;
      const start = i;
      while (i < content.length) {
        if (content[i] === "{") depth += 1;
        else if (content[i] === "}") {
          if (depth === 0) break;
          depth -= 1;
        }
        i += 1;
      }
      value = content.slice(start, i);
      i += 1;
    } else if (content[i] === "\"") {
      i += 1;
      const start = i;
      while (i < content.length && content[i] !== "\"") i += 1;
      value = content.slice(start, i);
      i += 1;
    } else {
      const start = i;
      while (i < content.length && content[i] !== ",") i += 1;
      value = content.slice(start, i).trim();
    }
    fields[fieldName] = cleanTex(value);
    while (i < content.length && content[i] !== ",") i += 1;
    if (content[i] === ",") i += 1;
  }

  return { entryType, key, fields };
}

function isArxivPaper(entry) {
  const journal = (entry.fields.journal || "").toLowerCase();
  return entry.entryType === "article" || journal.includes("corr") || journal.includes("arxiv");
}

function extractArxivId(entry) {
  const volume = entry.fields.volume || "";
  const eprint = entry.fields.eprint || "";
  const key = entry.key || "";
  const regex = /(\d{4}\.\d{4,5}(?:v\d+)?)/;

  const fromEprint = eprint.match(regex);
  if (fromEprint) return fromEprint[1];

  const fromVolume = volume.match(regex);
  if (fromVolume) return fromVolume[1];

  const fromKey = key.match(/abs-(\d{4}\.\d{4,5}(?:v\d+)?)/);
  if (fromKey) return fromKey[1];

  return "";
}

function getArxivUrlFromBib(entry) {
  const rawUrl = cleanTex(entry.fields.url || "");
  if (!rawUrl) return "";

  const absMatch = rawUrl.match(/https?:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5}(?:v\d+)?)/i);
  if (absMatch) {
    return `https://arxiv.org/abs/${absMatch[1]}`;
  }

  const doiMatch = rawUrl.match(/10\.48550\/arXiv\.(\d{4}\.\d{4,5}(?:v\d+)?)/i);
  if (doiMatch) {
    return `https://arxiv.org/abs/${doiMatch[1]}`;
  }

  return "";
}

function buildArxivUrl(entry) {
  const fromBibUrl = getArxivUrlFromBib(entry);
  if (fromBibUrl) {
    return fromBibUrl;
  }
  const id = extractArxivId(entry);
  if (id) {
    return `https://arxiv.org/abs/${id}`;
  }
  const title = entry.fields.title || "";
  if (!title) return "";
  return `https://arxiv.org/search/?query=${encodeURIComponent(title)}&searchtype=all`;
}

function renderAuthors(authors) {
  const html = authors.map((author) => {
    const escaped = escapeHtml(author);
    const isMe = normalizeName(author) === MY_NAME_NORMALIZED;
    return isMe ? `<strong>${escaped}</strong>` : escaped;
  });
  return html.join(", ");
}

function isFirstAuthorMine(entry) {
  const authors = parseAuthors(entry.fields.author || "");
  if (!authors.length) return false;
  return normalizeName(authors[0]) === MY_NAME_NORMALIZED;
}

function isCoFirstAuthorMine(entry) {
  const key = String(entry.key || "").toLowerCase();
  const title = String(entry.fields.title || "").toLowerCase();
  return key.includes("pengjdzf25") || title.includes("cafe: retrieval head-based coarse-to-fine information seeking to enhance multi-document qa capability");
}

function sortByYearDesc(a, b) {
  const y1 = Number(a.fields.year || 0);
  const y2 = Number(b.fields.year || 0);
  if (y1 !== y2) return y2 - y1;
  const f1 = isFirstAuthorMine(a) ? 1 : 0;
  const f2 = isFirstAuthorMine(b) ? 1 : 0;
  if (f1 !== f2) return f2 - f1;
  return (a.fields.title || "").localeCompare(b.fields.title || "");
}

function normalizeVenueLabel(rawVenue) {
  const venue = cleanTex(rawVenue || "");
  if (!venue) return "";
  if (/LREC\/COLING/i.test(venue)) return "LREC/COLING";
  if (/\bACL\b/i.test(venue) || /Association for Computational Linguistics/i.test(venue)) return "ACL";
  if (/EMNLP/i.test(venue)) return "EMNLP";
  if (/NeurIPS/i.test(venue)) return "NeurIPS";
  if (/CoRR|arXiv/i.test(venue)) return "CoRR";
  return venue;
}

function getPublicationSummary(entry) {
  const key = String(entry.key || "");
  const summary = PUBLICATION_SUMMARIES[key];
  if (Array.isArray(summary) && summary.length >= 2) {
    return `${summary[0]} ${summary[1]}`;
  }
  return "This paper addresses an important problem in language modeling and reports validated empirical improvements.";
}

function findEntryByKeywords(entries, keywords) {
  const normalized = keywords.map((k) => String(k || "").toLowerCase()).filter(Boolean);
  return entries.find((entry) => {
    const key = String(entry.key || "").toLowerCase();
    const title = String(entry.fields.title || "").toLowerCase();
    return normalized.some((needle) => key.includes(needle) || title.includes(needle));
  });
}

function renderResearchHighlights(entries) {
  const container = document.getElementById("research-list");
  if (!container) return;
  container.innerHTML = "";

  researchHighlights.forEach((item) => {
    const entry = findEntryByKeywords(entries, item.keywords);
    const li = document.createElement("li");
    li.className = "research-item";

    if (!entry) {
      li.innerHTML = `
        <h3 class="research-topic-title">${escapeHtml(item.topic)}</h3>
        <p class="research-paper">Representative work: Not found in current bibliography.</p>
      `;
      container.appendChild(li);
      return;
    }

    const title = escapeHtml(entry.fields.title || "Untitled");
    const venueRaw = entry.fields.venue || entry.fields.booktitle || entry.fields.journal || "";
    const venue = escapeHtml(normalizeVenueLabel(venueRaw));
    const year = escapeHtml(entry.fields.year || "");
    const url = cleanTex(entry.fields.url || "");
    const titleHtml = url
      ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${title}</a>`
      : title;
    const meta = `${venue}${venue && year ? ", " : ""}${year}`;

    li.innerHTML = `
      <h3 class="research-topic-title">${escapeHtml(item.topic)}</h3>
      <p class="research-paper">
        Representative work: ${titleHtml}. ${escapeHtml(meta)}
      </p>
    `;
    container.appendChild(li);
  });
}

function renderPublicationList(targetId, entries, type) {
  const container = document.getElementById(targetId);
  container.innerHTML = "";

  entries.sort(sortByYearDesc).forEach((entry) => {
    const li = document.createElement("li");
    li.className = "pub-item";

    const title = escapeHtml(entry.fields.title || "Untitled");
    const rawVenue = entry.fields.venue || entry.fields.booktitle || entry.fields.journal || "";
    const venue = escapeHtml(normalizeVenueLabel(rawVenue));
    const year = escapeHtml(entry.fields.year || "");
    const arxivUrl = buildArxivUrl(entry);
    const authors = renderAuthors(parseAuthors(entry.fields.author || ""));
    const summary = escapeHtml(getPublicationSummary(entry));
    const isFirstMine = isFirstAuthorMine(entry);
    const isCoFirstMine = !isFirstMine && isCoFirstAuthorMine(entry);
    const tagClass = type === "arxiv" ? "tag-arxiv" : "tag-conf";
    const tagText = type === "arxiv" ? "arXiv" : "Conference";
    const compactMeta = `${venue}${venue && year ? ", " : ""}${year}`;

    li.innerHTML = `
      <div class="pub-compact">
        ${isFirstMine ? `<span class="first-author-marker">[First Author]</span> ` : ""}
        ${isCoFirstMine ? `<span class="co-first-author-marker">[Co-First Author]</span> ` : ""}
        ${title}. ${escapeHtml(compactMeta)}
        <a href="${arxivUrl}" target="_blank" rel="noopener noreferrer">[arXiv]</a>
      </div>
      <span class="pub-tag ${tagClass}">${tagText}</span>
      ${isFirstMine ? `<span class="pub-tag tag-first">First Author</span>` : ""}
      ${isCoFirstMine ? `<span class="pub-tag tag-cofirst">Co-First Author</span>` : ""}
      <div class="pub-title"><a href="${arxivUrl}" target="_blank" rel="noopener noreferrer">${title}</a></div>
      <div class="pub-meta">${venue}${venue && year ? " · " : ""}${year}</div>
      <div class="pub-authors">${authors}</div>
      <div class="pub-summary">${summary}</div>
      <div class="pub-links"><a href="${arxivUrl}" target="_blank" rel="noopener noreferrer">arXiv Link</a></div>
    `;
    container.appendChild(li);
  });
}

async function loadBibTextByIframe() {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "own-bib.bib";
    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        const text = doc?.body?.innerText || "";
        iframe.remove();
        if (text.trim()) {
          resolve(text);
        } else {
          reject(new Error("Empty bib content from iframe."));
        }
      } catch (e) {
        iframe.remove();
        reject(e);
      }
    };
    iframe.onerror = () => {
      iframe.remove();
      reject(new Error("Unable to load own-bib.bib via iframe."));
    };
    document.body.appendChild(iframe);
  });
}

async function loadBibText() {
  try {
    const res = await fetch("own-bib.bib");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text();
  } catch (_) {
    return await loadBibTextByIframe();
  }
}

async function loadPublications() {
  const bibText = await loadBibText();
  const entries = splitBibEntries(bibText);
  if (!entries.length) {
    throw new Error("No valid entries found in own-bib.bib");
  }
  renderResearchHighlights(entries);
  const arxiv = entries.filter(isArxivPaper);
  const conference = entries.filter((entry) => !isArxivPaper(entry));
  renderPublicationList("pub-conf", conference, "conf");
  renderPublicationList("pub-arxiv", arxiv, "arxiv");
}

function renderNews() {
  const newsContainer = document.getElementById("news-list");
  news.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    newsContainer.appendChild(li);
  });
}

function renderFooterYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

function applyPublicationView(view) {
  const section = document.getElementById("publications");
  if (!section) return;
  const normalized = view === "list" ? "list" : "cards";
  section.classList.remove("view-list", "view-cards");
  section.classList.add(`view-${normalized}`);

  const cardBtn = document.getElementById("pub-view-cards");
  const listBtn = document.getElementById("pub-view-list");
  if (cardBtn && listBtn) {
    const cardActive = normalized === "cards";
    cardBtn.classList.toggle("is-active", cardActive);
    listBtn.classList.toggle("is-active", !cardActive);
    cardBtn.setAttribute("aria-pressed", String(cardActive));
    listBtn.setAttribute("aria-pressed", String(!cardActive));
  }
}

function initPublicationViewToggle() {
  const cardBtn = document.getElementById("pub-view-cards");
  const listBtn = document.getElementById("pub-view-list");
  if (!cardBtn || !listBtn) return;

  const saved = localStorage.getItem(PUB_VIEW_KEY) || "cards";
  applyPublicationView(saved);

  [cardBtn, listBtn].forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view === "list" ? "list" : "cards";
      localStorage.setItem(PUB_VIEW_KEY, view);
      applyPublicationView(view);
    });
  });
}

function initMobileNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!header || !toggle || !links) return;

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    const open = !header.classList.contains("nav-open");
    setOpen(open);
  });

  links.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      setOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("nav-open")) return;
    if (!header.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
}

async function bootstrap() {
  initMobileNav();
  initPublicationViewToggle();
  renderNews();
  renderFooterYear();
  try {
    await loadPublications();
  } catch (error) {
    const conf = document.getElementById("pub-conf");
    const arxiv = document.getElementById("pub-arxiv");
    const tip = window.location.protocol === "file:"
      ? " Tip: run a local server in this folder, e.g. `python -m http.server 8000`, then open http://localhost:8000/"
      : "";
    const message = `<li class="pub-item">Publication loading failed: ${escapeHtml(error.message)}.${tip}</li>`;
    conf.innerHTML = message;
    arxiv.innerHTML = message;
  }
}

bootstrap();


