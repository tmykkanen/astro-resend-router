const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const textToHtml = (text: string) => {
  const escaped = escapeHtml(text);

  return escaped
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.replace(/\r?\n/g, "<br>"))
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
};
