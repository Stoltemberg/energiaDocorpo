# Replacement Hero Photo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o PNG corrompido da fotografia principal por uma nova imagem WebP íntegra de um homem treinando em uma academia preta e vermelha.

**Architecture:** Converter a fotografia aprovada para `public/hero-producao-v2.webp`, atualizar todas as referências e remover o PNG corrompido. O novo nome invalida o cache antigo; o tamanho abaixo de 700 KB evita truncamento no transporte e a publicação compara o hash Git local com o remoto antes do deploy.

**Tech Stack:** Next.js 16, Node.js Test Runner, ImageMagick, WebP.

## Global Constraints

- Homem adulto treinando com equipamento de musculação em uma academia.
- Ambiente predominantemente preto, com iluminação e elementos arquitetônicos vermelhos.
- Fotografia horizontal, realista, sem textos, logos ou marcas-d'água.
- Atleta principalmente à direita e espaço escuro à esquerda para o conteúdo da página.
- Usar `public/hero-producao-v2.webp` e preservar o comportamento existente de `next/image` com `object-fit: contain`.
- O arquivo final deve ser WebP RGB válido, integralmente decodificável e menor que 700 KB.
- O hash Git local deve ser idêntico ao hash retornado pelo GitHub após o envio.
- Não alterar layout, textos, CTAs ou outros ativos.

---

### Task 1: Proteção contra ativo incorreto

**Files:**
- Modify: `tests/site.test.mjs`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: arquivo binário `public/hero-producao.png`.
- Produces: teste `usa uma fotografia WebP versionada e leve`.

- [ ] **Step 1: Escrever o teste de regressão**

```js
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
```

- [ ] **Step 2: Executar o teste e confirmar a falha atual**

Run: `npm test`

Expected: FAIL porque `hero-producao-v2.webp` ainda não existe e as referências ainda apontam para o PNG.

- [ ] **Step 3: Commitar o teste de regressão**

```bash
git add tests/site.test.mjs
git commit -m "test: require versioned lightweight hero"
```

### Task 2: Converter e instalar a fotografia substituta

**Files:**
- Create: `public/hero-producao-v2.webp`
- Delete: `public/hero-producao.png`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: direção visual de `docs/superpowers/specs/2026-07-13-replacement-hero-photo-design.md`.
- Produces: WebP RGB horizontal íntegro, versionado e menor que 700 KB.

- [ ] **Step 1: Converter a fotografia aprovada para WebP**

Run: `convert public/hero-producao.png -strip -quality 86 public/hero-producao-v2.webp`

Expected: WebP RGB horizontal abaixo de 700 KB.

- [ ] **Step 2: Atualizar as referências e remover o PNG**

Substituir `/hero-producao.png` por `/hero-producao-v2.webp` em `app/page.tsx` e `app/globals.css`, depois remover `public/hero-producao.png`.

- [ ] **Step 3: Executar o teste de integridade**

Run: `npm test && identify public/hero-producao-v2.webp && wc -c public/hero-producao-v2.webp`

Expected: todos os testes aprovados; WebP RGB 1586×992 decodificável e menor que 700000 bytes.

- [ ] **Step 4: Commitar a substituição**

```bash
git add -A app/page.tsx app/globals.css public/hero-producao-v2.webp public/hero-producao.png
git commit -m "fix: serve lightweight versioned hero image"
```

### Task 3: Validar e publicar

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/globals.css`
- Verify: `public/hero-producao-v2.webp`
- Verify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: ativo íntegro e testes atualizados.
- Produces: commit no branch `main`, hash remoto idêntico e deploy de produção `READY`.

- [ ] **Step 1: Executar a validação completa**

Run: `npm test && npm run lint && npm run build && git diff --check`

Expected: todos os testes aprovados, lint sem erros, build estático concluído e `git diff --check` sem saída.

- [ ] **Step 2: Confirmar escopo do diff**

Run: `git status --short`

Expected: árvore limpa após os commits; nenhuma alteração em layout, textos ou CTAs.

- [ ] **Step 3: Publicar no GitHub e comparar hashes**

Atualizar `main` de `Stoltemberg/energiaDocorpo` sem force push. Comparar `git hash-object public/hero-producao-v2.webp` com o SHA retornado pelo GitHub para esse arquivo; os valores devem ser idênticos antes do deploy.

- [ ] **Step 4: Publicar na Vercel**

Criar deployment de produção para `energia-do-corpo`, aguardar `READY` e confirmar `aliasError: null` para `energia-do-corpo.vercel.app`.

- [ ] **Step 5: Registrar evidências finais**

Informar quantidade de testes aprovados, resultado do lint e build, SHA remoto e ID do deployment.
