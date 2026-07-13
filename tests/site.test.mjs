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
    access(new URL("../public/hero-producao.png", import.meta.url)),
    access(new URL("../public/logo-energia-do-corpo.png", import.meta.url)),
    access(new URL("../public/fonts/anton-latin.woff2", import.meta.url)),
    access(new URL("../public/fonts/geist-latin.woff2", import.meta.url)),
  ]);
});
