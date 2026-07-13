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
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

for (const item of include) {
  const srcPath = path.join(root, item);
  const destPath = path.join(out, item);

  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
  }
}

/*
 * SINCRONIZAÇÃO DO CONTEÚDO INICIAL
 *
 * As páginas HTML continham textos antigos de reserva. O navegador mostrava
 * esses textos e, depois, page-content.js os substituía pelos dados atuais.
 *
 * Durante o build, esta etapa grava os dados atuais de content/pages.json
 * diretamente nos HTMLs da pasta public. Assim, o primeiro conteúdo mostrado
 * já é o conteúdo atual.
 */

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function field(page, name, lang) {
  return page[`${name}_${lang}`] || page[name] || "";
}

function replaceDataElement(html, attribute, content) {
  const pattern = new RegExp(
    `(<([a-zA-Z0-9-]+)[^>]*\\s${attribute}(?:=(?:"[^"]*"|'[^']*'|[^\\s>]+))?[^>]*>)[\\s\\S]*?(<\\/\\2>)`,
    "i"
  );

  return html.replace(pattern, `$1${content}$3`);
}

function linkHTML(label, url) {
  if (!label || !url) return "";

  const external = String(url).startsWith("http")
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";

  return `<a href="${escapeHTML(url)}"${external}>${escapeHTML(label)}</a>`;
}

function sectionsHTML(page, lang) {
  return [1, 2, 3, 4]
    .map((number) => ({
      title: field(page, `section${number}_title`, lang),
      text: field(page, `section${number}_text`, lang),
      linkLabel: field(page, `section${number}_link_label`, lang),
      linkUrl: field(page, `section${number}_link_url`, lang)
    }))
    .filter(
      (section) =>
        section.title ||
        section.text ||
        section.linkLabel ||
        section.linkUrl
    )
    .map(
      (section) => `
    <article class="section-row">
      <h2>${escapeHTML(section.title)}</h2>
      <div>
        ${section.text ? `<p>${escapeHTML(section.text)}</p>` : ""}
        ${linkHTML(section.linkLabel, section.linkUrl)}
      </div>
    </article>`
    )
    .join("");
}

function updateMetaDescription(html, description) {
  if (!description) return html;

  return html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${escapeHTML(description)}" />`
  );
}

function updateTitle(html, title) {
  if (!title) return html;

  return html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHTML(title)} — Ronaldo Gomes Jr.</title>`
  );
}

function updateAboutPhoto(html, page, lang) {
  const photoURL = page.foto || page.photo || "";
  if (!photoURL || !html.includes("data-about-photo")) return html;

  const alt =
    lang === "en"
      ? "Photo of Ronaldo Gomes Jr."
      : "Foto de Ronaldo Gomes Jr.";

  const pattern =
    /(<div[^>]*data-about-photo[^>]*>)[\s\S]*?(<\/div>)/i;

  return html.replace(
    pattern,
    `$1<img src="${escapeHTML(photoURL)}" alt="${alt}">$2`
  );
}

function syncPage(page, lang, slug) {
  const relativePath = path.join(lang, slug, "index.html");
  const filePath = path.join(out, relativePath);

  if (!fs.existsSync(filePath)) {
    return;
  }

  let html = fs.readFileSync(filePath, "utf8");

  const title = field(page, "title", lang);
  const intro = field(page, "intro", lang);
  const metaTitle = field(page, "meta_title", lang) || title;
  const metaDescription = field(page, "meta_description", lang) || intro;

  html = replaceDataElement(
    html,
    "data-page-title",
    escapeHTML(title)
  );

  html = replaceDataElement(
    html,
    "data-page-intro",
    escapeHTML(intro)
  );

  html = replaceDataElement(
    html,
    "data-page-sections",
    sectionsHTML(page, lang)
  );

  html = updateTitle(html, metaTitle);
  html = updateMetaDescription(html, metaDescription);
  html = updateAboutPhoto(html, page, lang);

  fs.writeFileSync(filePath, html, "utf8");
  console.log(`Conteúdo inicial sincronizado: ${relativePath}`);
}

const pagesFile = path.join(root, "content", "pages.json");

if (fs.existsSync(pagesFile)) {
  const pagesData = JSON.parse(fs.readFileSync(pagesFile, "utf8"));
  const pages = Array.isArray(pagesData.items) ? pagesData.items : [];

  for (const page of pages) {
    if (page.slug_pt) {
      syncPage(page, "pt", page.slug_pt);
    }

    if (page.slug_en) {
      syncPage(page, "en", page.slug_en);
    }
  }
}

console.log("Static site copied and current page content written to /public");
