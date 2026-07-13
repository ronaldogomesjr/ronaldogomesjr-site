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

  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
  }
}

/*
 * Sincroniza o conteúdo inicial dos HTMLs publicados com content/pages.json.
 *
 * Isso elimina o flash porque o navegador já recebe o conteúdo atual.
 * Os arquivos-fonte em /pt e /en não são modificados: apenas a cópia em /public.
 */

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function field(page, name, lang) {
  return page[`${name}_${lang}`] || page[name] || "";
}

function replaceElementContent(html, dataAttribute, newContent) {
  const pattern = new RegExp(
    `(<([a-zA-Z][a-zA-Z0-9-]*)\\b[^>]*\\b${dataAttribute}\\b[^>]*>)[\\s\\S]*?(<\\/\\2>)`,
    "i"
  );

  if (!pattern.test(html)) {
    return { html, changed: false };
  }

  return {
    html: html.replace(pattern, `$1${newContent}$3`),
    changed: true
  };
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
        ${paragraphHTML(section.text)}
        ${linkHTML(section.linkLabel, section.linkUrl)}
      </div>
    </article>`
    )
    .join("");
}

function syncPage(page, lang, slug) {
  const relativePath = path.join(lang, slug, "index.html");
  const filePath = path.join(out, relativePath);

  if (!fs.existsSync(filePath)) {
    return;
  }

  let html = fs.readFileSync(filePath, "utf8");
  let changed = false;

  const title = field(page, "title", lang);
  const intro = field(page, "intro", lang);

  if (title) {
    const result = replaceElementContent(
      html,
      "data-page-title",
      escapeHTML(title)
    );
    html = result.html;
    changed = changed || result.changed;
  }

  if (intro) {
    const result = replaceElementContent(
      html,
      "data-page-intro",
      escapeHTML(intro).replaceAll("\n", "<br>")
    );
    html = result.html;
    changed = changed || result.changed;
  }

  const sections = sectionsHTML(page, lang);
  const sectionsResult = replaceElementContent(
    html,
    "data-page-sections",
    sections
  );

  html = sectionsResult.html;
  changed = changed || sectionsResult.changed;

  if (changed) {
    fs.writeFileSync(filePath, html, "utf8");
    console.log(`Conteúdo sincronizado: ${relativePath}`);
  }
}

const pagesPath = path.join(root, "content", "pages.json");

if (fs.existsSync(pagesPath)) {
  const data = JSON.parse(fs.readFileSync(pagesPath, "utf8"));
  const pages = Array.isArray(data.items) ? data.items : [];

  for (const page of pages) {
    if (page && page.slug_pt) {
      syncPage(page, "pt", page.slug_pt);
    }

    if (page && page.slug_en) {
      syncPage(page, "en", page.slug_en);
    }
  }
} else {
  console.warn("Aviso: content/pages.json não foi encontrado.");
}

console.log("Static site copied and current page content synchronized to /public");
