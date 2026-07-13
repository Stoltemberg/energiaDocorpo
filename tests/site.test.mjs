import assert from "node:assert/strict";
import test from "node:test";
import { access, readFile } from "node:fs/promises";
import { inflateSync } from "node:zlib";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function inspectRgbPng(path) {
  const png = await readFile(new URL(path, import.meta.url));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);

  let offset = 8;
  let width = 0;
  let height = 0;
  const idat = [];
  while (offset + 12 <= png.length) {
    const length = png.readUInt32BE(offset);
    const end = offset + 12 + length;
    assert.ok(end <= png.length, "chunk PNG truncado");
    const type = png.toString("ascii", offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      assert.equal(data[8], 8);
      assert.equal(data[9], 2);
    }
    if (type === "IDAT") idat.push(data);
    offset = end;
    if (type === "IEND") break;
  }

  const pixels = inflateSync(Buffer.concat(idat));
  const rowLength = 1 + width * 3;
  assert.equal(pixels.length, rowLength * height);
  for (let row = 0; row < height; row += 1) {
    assert.ok(pixels[row * rowLength] <= 4, `filtro PNG inválido na linha ${row}`);
  }
  return { width, height };
}

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
    access(new URL("../public/hero-producao.png", import.meta.url)),
    access(new URL("../public/logo-energia-do-corpo.png", import.meta.url)),
    access(new URL("../public/fonts/anton-latin.woff2", import.meta.url)),
    access(new URL("../public/fonts/geist-latin.woff2", import.meta.url)),
  ]);
});

test("mantém a fotografia principal como PNG íntegro e completo", async () => {
  const image = await inspectRgbPng("../public/hero-producao.png");
  assert.ok(image.width > image.height, "a fotografia deve ser horizontal");
  assert.ok(image.width >= 1200, "a fotografia deve ter resolução suficiente");
});

test("exibe as fotografias completas e centraliza o logo no mobile", async () => {
  const [page, css] = await Promise.all([
    read("app/page.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(
    page,
    /<Image[\s\S]*?className="hero-image"[\s\S]*?src="\/hero-producao\.png"[\s\S]*?fill[\s\S]*?priority/,
  );
  assert.match(
    page,
    /<Image[\s\S]*?className="split-image"[\s\S]*?src="\/hero-producao\.png"[\s\S]*?fill/,
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
