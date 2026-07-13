const fs = require("fs");
const path = require("path");

const root = __dirname;
const out = path.join(root, "public");

const include = [
  "admin",
  "assets",
  "content",
  "en",
  "pt",
  "index.html",
  "favicon.ico",
  "favicon.svg",
  "apple-touch-icon.png"
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

for (const item of include) {
  const srcPath = path.join(root, item);
  const destPath = path.join(out, item);
  if (fs.existsSync(srcPath)) copyRecursive(srcPath, destPath);
}

function readJSON(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hasField(page, name, lang) {
  return Boolean(page) && (
    Object.prototype.hasOwnProperty.call(page, `${name}_${lang}`) ||
    Object.prototype.hasOwnProperty.call(page, name)
  );
}

function field(page, name, lang) {
  if (!page) return "";
  const localized = `${name}_${lang}`;
  if (Object.prototype.hasOwnProperty.call(page, localized)) {
    return String(page[localized] ?? "");
  }
  if (Object.prototype.hasOwnProperty.call(page, name)) {
    return String(page[name] ?? "");
  }
  return "";
}

function attributeValue(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return match ? match[1] : "";
}

function replaceElementContent(html, attribute, content) {
  const pattern = new RegExp(
    `(<([a-zA-Z][a-zA-Z0-9-]*)\\b[^>]*\\b${attribute}\\b[^>]*>)[\\s\\S]*?(<\\/\\2>)`,
    "i"
  );
  return pattern.test(html) ? html.replace(pattern, `$1${content}$3`) : html;
}

function linkHTML(label, url) {
  if (!label || !url) return "";
  const external = String(url).startsWith("http")
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";
  return `<a href="${escapeHTML(url)}"${external}>${escapeHTML(label)}</a>`;
}

function paragraphHTML(text) {
  if (!text) return "";
  return String(text)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHTML(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function sectionsHTML(page, lang) {
  return [1, 2, 3, 4]
    .map((number) => ({
      title: field(page, `section${number}_title`, lang),
      text: field(page, `section${number}_text`, lang),
      linkLabel: field(page, `section${number}_link_label`, lang),
      linkUrl: field(page, `section${number}_link_url`, lang)
    }))
    .filter((section) =>
      section.title || section.text || section.linkLabel || section.linkUrl
    )
    .map((section) => `
    <article class="section-row">
      <h2>${escapeHTML(section.title)}</h2>
      <div>
        ${paragraphHTML(section.text)}
        ${linkHTML(section.linkLabel, section.linkUrl)}
      </div>
    </article>`)
    .join("");
}

function updateMeta(html, page, lang) {
  const title = field(page, "meta_title", lang) || field(page, "title", lang);
  const description = field(page, "meta_description", lang);

  if (title) {
    html = html.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${escapeHTML(title)} — Ronaldo Gomes Jr.</title>`
    );
  }

  if (hasField(page, "meta_description", lang)) {
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?\s*>/i,
      `<meta name="description" content="${escapeHTML(description)}" />`
    );
  }

  return html;
}

function updatePhoto(html, page, lang) {
  if (!html.includes("data-about-photo")) return html;
  const photoURL = page.foto || page.photo || "";
  if (!photoURL) return html;
  const alt = lang === "en" ? "Photo of Ronaldo Gomes Jr." : "Foto de Ronaldo Gomes Jr.";
  return replaceElementContent(
    html,
    "data-about-photo",
    `<img src="${escapeHTML(photoURL)}" alt="${alt}">`
  );
}

const pagesData = readJSON(path.join(root, "content", "pages.json"), { items: [] });
const pages = Array.isArray(pagesData.items) ? pagesData.items : [];
const publicationPages = readJSON(path.join(root, "content", "publication-pages.json"), {});

function findPage(pageId, slug, lang) {
  const general = pages.find((item) => {
    if (pageId && item.id === pageId) return true;
    if (lang === "en") return item.slug_en === slug || item.slug === slug;
    return item.slug_pt === slug || item.slug === slug;
  }) || null;
  const dedicated = pageId ? publicationPages[pageId] || null : null;
  return dedicated ? { ...(general || {}), ...dedicated } : general;
}

function walkHtml(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

let synchronized = 0;
for (const filePath of [...walkHtml(path.join(out, "pt")), ...walkHtml(path.join(out, "en"))]) {
  let html = fs.readFileSync(filePath, "utf8");
  const shellMatch = html.match(/<main\b[^>]*\bdata-page-shell\b[^>]*>/i);
  if (!shellMatch) continue;

  const shellTag = shellMatch[0];
  const pageId = attributeValue(shellTag, "data-page-id");
  const slug = attributeValue(shellTag, "data-page-slug");
  const lang = attributeValue(shellTag, "data-lang") || (filePath.includes(`${path.sep}en${path.sep}`) ? "en" : "pt");
  const page = findPage(pageId, slug, lang);
  if (!page) continue;

  html = html.replace(shellTag, shellTag.replace(/>$/, ' data-content-ready="93">'));

  if (hasField(page, "title", lang)) {
    html = replaceElementContent(html, "data-page-title", escapeHTML(field(page, "title", lang)));
  }

  if (hasField(page, "intro", lang)) {
    const intro = field(page, "intro", lang);
    html = replaceElementContent(
      html,
      "data-page-intro",
      escapeHTML(intro)
    );
  }

  if (html.includes("data-page-sections")) {
    html = replaceElementContent(html, "data-page-sections", sectionsHTML(page, lang));
  }

  html = updateMeta(html, page, lang);
  html = updatePhoto(html, page, lang);
  fs.writeFileSync(filePath, html, "utf8");
  synchronized += 1;
  console.log(`Conteúdo inicial sincronizado: ${path.relative(out, filePath)}`);
}


const conceptPages = [
  {
    id: "design",
    rootAttribute: "data-design-page",
    selectors: {
      title: ["data-design-title", "data-design-center-title"],
      intro: ["data-design-intro"],
      section1_title: ["data-perspective-title"],
      section1_text: ["data-perspective-text"]
    }
  },
  {
    id: "tecnologia-digital",
    rootAttribute: "data-tech-page",
    selectors: {
      title: ["data-tech-title"],
      intro: ["data-tech-intro"],
      section1_title: ["data-tech-perspective-title"],
      section1_text: ["data-tech-perspective-text"]
    }
  },
  {
    id: "educacao-linguistica",
    rootAttribute: "data-language-page",
    selectors: {
      title: ["data-language-title"],
      intro: ["data-language-intro"],
      section1_title: ["data-language-perspective-title"],
      section1_text: ["data-language-perspective-text"]
    }
  }
];

for (const config of conceptPages) {
  const page = pages.find((item) => item && item.id === config.id);
  if (!page) continue;

  for (const lang of ["pt", "en"]) {
    const slug = lang === "en" ? page.slug_en : page.slug_pt;
    if (!slug) continue;
    const filePath = path.join(out, lang, slug, "index.html");
    if (!fs.existsSync(filePath)) continue;

    let html = fs.readFileSync(filePath, "utf8");
    const rootPattern = new RegExp(`<main\\b[^>]*\\b${config.rootAttribute}\\b[^>]*>`, "i");
    const rootMatch = html.match(rootPattern);
    if (!rootMatch) continue;

    html = html.replace(
      rootMatch[0],
      rootMatch[0].replace(/>$/, ' data-content-ready="93">')
    );

    for (const [fieldName, attributes] of Object.entries(config.selectors)) {
      const value = field(page, fieldName, lang);
      for (const attribute of attributes) {
        html = replaceElementContent(html, attribute, escapeHTML(value));
      }
    }

    html = updateMeta(html, page, lang);
    fs.writeFileSync(filePath, html, "utf8");
    synchronized += 1;
    console.log(`Conteúdo conceitual sincronizado: ${path.relative(out, filePath)}`);
  }
}

console.log(`Static site copied to /public; ${synchronized} dynamic pages synchronized.`);
