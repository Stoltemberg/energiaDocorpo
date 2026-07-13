# Responsive Images and Minimap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir o enquadramento das fotografias no desktop, centralizar o logotipo no mobile e transformar o minimapa em uma composição não repetitiva com o logotipo oficial como marcador.

**Architecture:** As fotografias continuam como fundos CSS para preservar a composição e recebem posições focais específicas. O minimapa permanece decorativo e local, usando três ruas CSS únicas e um `Image` do Next.js dentro do marcador; nenhuma biblioteca ou serviço externo será adicionado.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS responsivo, Node Test Runner.

## Global Constraints

- Renderizar as fotografias com `next/image` e `object-fit: contain` no desktop e mobile para impedir cortes e sobreposição de gradientes.
- Não alterar a altura atual das seções para mostrar a imagem inteira.
- Centralizar o logotipo somente em telas de até 640 px.
- Reutilizar `public/logo-energia-do-corpo.png`; não criar novos ativos.
- O minimapa continua decorativo, sem interação, mapa real ou dependências externas.
- Não alterar textos, CTAs ou destinos de links.

---

### Task 1: Enquadramento desktop e logotipo mobile

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: classes existentes `.hero-photo`, `.split-photo`, `.site-header` e `.wordmark`.
- Produces: fotografias completas com `contain`, hero em largura total e centralização absoluta de `.site-header .wordmark` no breakpoint mobile.

- [ ] **Step 1: Escrever o teste que falha**

Adicionar a `tests/site.test.mjs`:

```js
test("preserva o atleta no desktop e centraliza o logo no mobile", async () => {
  const css = await read("app/globals.css");

  assert.match(
    css,
    /url\("\/hero-producao\.png"\) right center \/ cover no-repeat/i,
  );
  assert.match(
    css,
    /\.split-photo\s*\{[\s\S]*?url\("\/hero-producao\.png"\) right center \/ cover no-repeat/i,
  );
  assert.match(
    css,
    /@media \(max-width: 640px\)[\s\S]*?\.site-header \.wordmark\s*\{[\s\S]*?position:\s*absolute[\s\S]*?left:\s*50%[\s\S]*?translateX\(-50%\)/i,
  );
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha correta**

Run: `npm test`

Expected: FAIL em `preserva o atleta no desktop e centraliza o logo no mobile`, pois os fundos ainda usam `center`/`72% center` e o logotipo mobile não tem centralização absoluta.

- [ ] **Step 3: Implementar o menor ajuste CSS**

Em `app/globals.css`, alterar somente os enquadramentos desktop:

```css
.hero-photo {
  /* propriedades existentes preservadas */
  background:
    linear-gradient(90deg, var(--ink-950) 0%, rgba(9,11,10,.78) 12%, transparent 42%),
    url("/hero-producao.png") right center / cover no-repeat;
}

.split-photo {
  /* propriedades existentes preservadas */
  background:
    linear-gradient(0deg, rgba(9,11,10,.25), rgba(9,11,10,.05)),
    url("/hero-producao.png") right center / cover no-repeat;
}
```

Dentro de `@media (max-width: 640px)`, adicionar:

```css
.site-header .wordmark {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

- [ ] **Step 4: Executar os testes e confirmar o verde**

Run: `npm test`

Expected: 5 testes aprovados, incluindo o novo teste responsivo.

- [ ] **Step 5: Versionar a tarefa**

Commit message: `fix: improve responsive image framing`

Arquivos: `app/globals.css`, `tests/site.test.mjs`.

---

### Task 2: Minimapa não repetitivo com marcador de logotipo

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: componente `Image` já importado e ativo `/logo-energia-do-corpo.png`.
- Produces: `.map-grid` com três ruas CSS únicas e `.map-pin img` contendo o logotipo oficial.

- [ ] **Step 1: Escrever o teste que falha**

Adicionar a `tests/site.test.mjs`:

```js
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
```

- [ ] **Step 2: Executar o teste e confirmar a falha correta**

Run: `npm test`

Expected: FAIL em `renderiza um minimapa sem mosaico e com o logo no marcador`, pois o mapa ainda usa `background-size` repetitivo e o marcador contém a letra `E`.

- [ ] **Step 3: Substituir a marcação do minimapa**

Em `app/page.tsx`, substituir os dois elementos atuais por:

```tsx
<div className="map-grid" aria-hidden="true">
  <span />
</div>
<div className="map-pin" aria-hidden="true">
  <Image
    src="/logo-energia-do-corpo.png"
    alt=""
    width={900}
    height={900}
    unoptimized
  />
</div>
```

- [ ] **Step 4: Implementar ruas únicas e o novo marcador**

Em `app/globals.css`, substituir `.map-grid`, `.map-pin` e a antiga regra `.map-pin span` por:

```css
.map-grid {
  position: absolute;
  inset: 7%;
  opacity: .82;
  transform: rotate(-5deg);
}
.map-grid::before,
.map-grid::after,
.map-grid span {
  content: "";
  position: absolute;
  display: block;
  background: rgba(48, 55, 48, .62);
  border: 2px solid #343c35;
  border-radius: 999px;
}
.map-grid::before {
  width: 118%;
  height: 76px;
  left: -9%;
  top: 22%;
  transform: rotate(11deg);
}
.map-grid::after {
  width: 84%;
  height: 62px;
  right: -18%;
  bottom: 20%;
  transform: rotate(-28deg);
}
.map-grid span {
  width: 74%;
  height: 54px;
  left: -20%;
  bottom: 18%;
  transform: rotate(68deg);
}
.map-pin {
  position: relative;
  z-index: 2;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: var(--brand-red);
  display: grid;
  place-items: center;
  box-shadow: 0 0 0 20px rgba(227,32,32,.1), 0 18px 42px rgba(0,0,0,.36);
}
.map-pin img {
  width: 78%;
  height: 78%;
  object-fit: contain;
}
```

- [ ] **Step 5: Executar os testes e confirmar o verde**

Run: `npm test`

Expected: 6 testes aprovados, incluindo o minimapa sem mosaico e com o logotipo.

- [ ] **Step 6: Versionar a tarefa**

Commit message: `feat: refine decorative location map`

Arquivos: `app/page.tsx`, `app/globals.css`, `tests/site.test.mjs`.

---

### Task 3: Qualidade, responsividade e publicação

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/globals.css`
- Verify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: resultado das Tasks 1 e 2.
- Produces: build validado, commits no `main` e nova publicação Vercel verificada.

- [ ] **Step 1: Executar a verificação completa local**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: 6 testes aprovados, lint sem erros e build Next.js concluído com a rota `/` estática.

- [ ] **Step 2: Validar desktop no navegador**

Fluxo: `/` → primeira dobra → seção intermediária → minimapa.

Verificar em viewport desktop:

- atleta visível sem corte do rosto, tronco ou braços;
- fotografia intermediária com o ponto focal preservado;
- minimapa sem repetição em mosaico;
- marcador vermelho exibindo o logotipo oficial;
- ausência de overlay do Next.js e erros relevantes no console.

- [ ] **Step 3: Validar mobile no navegador**

Fluxo: `/` → cabeçalho mobile → rolagem até o CTA contextual.

Verificar em viewport mobile:

- logotipo centralizado na largura da tela;
- CTA principal e CTA contextual continuam funcionando sem sobreposição;
- fotografia mobile não sofre regressão de enquadramento;
- minimapa e marcador permanecem legíveis.

- [ ] **Step 4: Enviar os commits ao GitHub**

Branch: `main`

Repositório: `Stoltemberg/energiaDocorpo`

Expected: árvore remota contém as alterações das Tasks 1 e 2 e os documentos de design/plano.

- [ ] **Step 5: Publicar e verificar a Vercel**

Projeto: `energia-do-corpo`

Expected: deployment `READY`, framework `nextjs`, build sem erros e domínio principal servindo a nova versão.
