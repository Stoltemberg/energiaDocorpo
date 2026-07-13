import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("preserva a jornada de conversão e os destinos", async () => {
  const page = await read("app/page.tsx");

  assert.match(page, /Mais energia\. Mais resultados\./i);
  assert.match(page, /Musculação e cardio/i);
  assert.match(page, /Rua Gildo de Freitas, 627/i);
  assert.match(page, /const whatsappNumber = "5551985920038"/i);
  assert.match(page, /https:\/\/wa\.me\/\$\{whatsappNumber\}/i);
  assert.match(page, /Conheça nossos planos/i);
  assert.doesNotMatch(page, /treino experimental|experimental/i);
  assert.doesNotMatch(page, /Academia em Canoas/i);
});

test("preserva o sistema visual aprovado", async () => {
  const [css, page, icon] = await Promise.all([
    read("app/globals.css"),
    read("app/page.tsx"),
    read("app/ArrowUpRightIcon.tsx"),
  ]);

  assert.match(css, /--brand-red:\s*#e32020/i);
  assert.match(css, /@font-face[\s\S]*font-family:\s*"Anton"/i);
  assert.doesNotMatch(page, /\p{Extended_Pictographic}/u);
  assert.match(icon, /viewBox="0 0 24 24"/);
  assert.match(page, /logo-energia-do-corpo\.png/);
});

test("mantém o CTA móvel contextual e animado", async () => {
  const [page, component, css] = await Promise.all([
    read("app/page.tsx"),
    read("app/MobileStickyCta.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(page, /id="hero-plans-cta"/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /setVisible\(!entry\.isIntersecting\)/);
  assert.match(css, /@keyframes\s+mobile-cta-rise/i);
  assert.match(css, /animation:\s*mobile-cta-rise\s+\.42s/i);
  assert.match(css, /\.final-plans-cta\s*\{\s*display:\s*none/i);
});

test("inclui os ativos essenciais", async () => {
  await Promise.all([
    access(new URL("../public/hero-producao-v2.webp", import.meta.url)),
    access(new URL("../public/logo-energia-do-corpo.png", import.meta.url)),
    access(new URL("../public/fonts/anton-latin.woff2", import.meta.url)),
    access(new URL("../public/fonts/geist-latin.woff2", import.meta.url)),
  ]);
});

test("usa uma fotografia WebP versionada e leve", async () => {
  const [page, css, image] = await Promise.all([
    read("app/page.tsx"),
    read("app/globals.css"),
    readFile(new URL("../public/hero-producao-v2.webp", import.meta.url)),
  ]);
  assert.match(page, /hero-producao-v2\.webp/g);
  assert.match(css, /hero-producao-v2\.webp/);
  assert.doesNotMatch(`${page}\n${css}`, /hero-producao\.png/);
  assert.deepEqual(image.subarray(0, 4), Buffer.from("RIFF"));
  assert.equal(image.toString("ascii", 8, 12), "WEBP");
  assert.ok(image.length < 700_000, "a fotografia deve permanecer abaixo do limite de transporte");
});

test("exibe as fotografias completas e centraliza o logo no mobile", async () => {
  const [page, css] = await Promise.all([
    read("app/page.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(
    page,
    /<Image[\s\S]*?className="hero-image"[\s\S]*?src="\/hero-producao-v2\.webp"[\s\S]*?fill[\s\S]*?priority/,
  );
  assert.match(
    page,
    /<Image[\s\S]*?className="split-image"[\s\S]*?src="\/hero-producao-v2\.webp"[\s\S]*?fill/,
  );
  assert.match(css, /\.hero-image\s*\{[\s\S]*?object-fit:\s*contain/i);
  assert.match(css, /\.split-image\s*\{[\s\S]*?object-fit:\s*contain/i);
  assert.doesNotMatch(
    css.match(/\.hero-photo\s*\{[\s\S]*?\}/)?.[0] ?? "",
    /url\("\/hero-producao\.png"\)/i,
  );
  assert.doesNotMatch(
    css.match(/\.split-photo\s*\{[\s\S]*?\}/)?.[0] ?? "",
    /url\("\/hero-producao\.png"\)/i,
  );
  assert.match(
    css,
    /@media \(max-width: 960px\)[\s\S]*?\.hero-photo\s*\{\s*inset:\s*380px 0 110px 0;\s*\}/i,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\)[\s\S]*?\.hero-shade\s*\{\s*display:\s*none;\s*\}/i,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\)[\s\S]*?\.site-header \.wordmark\s*\{[\s\S]*?position:\s*absolute[\s\S]*?left:\s*50%[\s\S]*?translateX\(-50%\)/i,
  );
});

test("renderiza um minimapa sem mosaico e com o logo no marcador", async () => {
  const [page, css] = await Promise.all([
    read("app/page.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(page, /<div className="map-grid" aria-hidden="true">\s*<span \/>\s*<\/div>/);
  assert.match(
    page,
    /className="map-pin"[\s\S]*?<Image[\s\S]*?src="\/logo-energia-do-corpo\.png"[\s\S]*?alt=""/,
  );
  assert.doesNotMatch(page, /className="map-pin"[\s\S]*?<span>E<\/span>/);
  assert.match(css, /\.map-grid::before,[\s\S]*?\.map-grid::after,[\s\S]*?\.map-grid span/);
  assert.doesNotMatch(
    css.match(/\.map-grid\s*\{[\s\S]*?\}/)?.[0] ?? "",
    /background-size/i,
  );
  assert.match(css, /\.map-pin img\s*\{[\s\S]*?object-fit:\s*contain/i);
});
