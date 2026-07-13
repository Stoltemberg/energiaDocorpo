# Replacement Hero Photo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o PNG corrompido da fotografia principal por uma nova imagem íntegra de um homem treinando em uma academia preta e vermelha.

**Architecture:** Manter o caminho público `public/hero-producao.png` e os componentes atuais, trocando somente o ativo binário. Adicionar uma verificação automatizada que percorre os chunks PNG, valida a descompressão completa e rejeita filtros de scanline inválidos, impedindo que outra imagem truncada seja publicada.

**Tech Stack:** Next.js 16, Node.js Test Runner, `node:zlib`, geração de imagem raster.

## Global Constraints

- Homem adulto treinando com equipamento de musculação em uma academia.
- Ambiente predominantemente preto, com iluminação e elementos arquitetônicos vermelhos.
- Fotografia horizontal, realista, sem textos, logos ou marcas-d'água.
- Atleta principalmente à direita e espaço escuro à esquerda para o conteúdo da página.
- Preservar `public/hero-producao.png` e o comportamento existente de `next/image` com `object-fit: contain`.
- O arquivo final deve ser PNG RGB válido e integralmente decodificável.
- Não alterar layout, textos, CTAs ou outros ativos.

---

### Task 1: Proteção contra PNG corrompido

**Files:**
- Modify: `tests/site.test.mjs`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: arquivo binário `public/hero-producao.png`.
- Produces: teste `mantém a fotografia principal como PNG íntegro e completo`.

- [ ] **Step 1: Adicionar imports e helper de validação**

Adicionar `readFile` e `inflateSync` aos imports e incluir o helper abaixo:

```js
import { readFile } from "node:fs/promises";
import { inflateSync } from "node:zlib";

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
```

- [ ] **Step 2: Escrever o teste de regressão**

```js
test("mantém a fotografia principal como PNG íntegro e completo", async () => {
  const image = await inspectRgbPng("../public/hero-producao.png");
  assert.ok(image.width > image.height, "a fotografia deve ser horizontal");
  assert.ok(image.width >= 1200, "a fotografia deve ter resolução suficiente");
});
```

- [ ] **Step 3: Executar o teste e confirmar a falha atual**

Run: `npm test`

Expected: FAIL em `chunk PNG truncado` ou `unexpected end of file`, demonstrando que o teste reproduz a corrupção existente.

- [ ] **Step 4: Commitar o teste de regressão**

```bash
git add tests/site.test.mjs
git commit -m "test: reject corrupted hero images"
```

### Task 2: Gerar e instalar a fotografia substituta

**Files:**
- Modify: `public/hero-producao.png`

**Interfaces:**
- Consumes: direção visual de `docs/superpowers/specs/2026-07-13-replacement-hero-photo-design.md`.
- Produces: PNG RGB horizontal íntegro no caminho já usado pela página.

- [ ] **Step 1: Gerar a nova fotografia**

Usar o gerador de imagens com este prompt:

```text
Fotografia publicitária horizontal, realista e cinematográfica de um homem adulto atlético treinando em uma máquina de cabos em uma academia moderna. O atleta veste camiseta esportiva preta sem logotipos e ocupa principalmente a metade direita da composição; cabeça, tronco, braços e equipamento principal aparecem completos, com margens de segurança. A metade esquerda é escura, limpa e pouco detalhada para receber texto branco de uma landing page. Ambiente predominantemente preto com iluminação vermelha dramática e estruturas vermelhas ao fundo, alto contraste, pele e anatomia naturais, expressão real de esforço, fotografia profissional nítida. Bordas escuras contínuas. Sem texto, sem letras, sem logotipos, sem marcas-d'água, sem molduras e sem artefatos digitais.
```

- [ ] **Step 2: Salvar o resultado aprovado no caminho público**

Substituir o arquivo existente por `public/hero-producao.png`, preservando o nome e convertendo para PNG RGB caso o resultado use outro formato.

- [ ] **Step 3: Executar o teste de integridade**

Run: `npm test`

Expected: PASS para `mantém a fotografia principal como PNG íntegro e completo` e todos os demais testes.

- [ ] **Step 4: Verificar o arquivo com ferramenta independente**

Run: `identify public/hero-producao.png`

Expected: uma única imagem PNG, RGB, horizontal, com largura mínima de 1200 px e sem erros de decodificação.

- [ ] **Step 5: Commitar a substituição**

```bash
git add public/hero-producao.png
git commit -m "fix: replace corrupted hero photograph"
```

### Task 3: Validar e publicar

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/globals.css`
- Verify: `public/hero-producao.png`
- Verify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: ativo íntegro e testes atualizados.
- Produces: commit no branch `main` e deploy de produção `READY`.

- [ ] **Step 1: Executar a validação completa**

Run: `npm test && npm run lint && npm run build && git diff --check`

Expected: todos os testes aprovados, lint sem erros, build estático concluído e `git diff --check` sem saída.

- [ ] **Step 2: Confirmar escopo do diff**

Run: `git status --short`

Expected: árvore limpa após os commits; nenhuma alteração em layout, textos ou CTAs.

- [ ] **Step 3: Publicar no GitHub**

Atualizar `main` de `Stoltemberg/energiaDocorpo` sem force push e confirmar o SHA remoto.

- [ ] **Step 4: Publicar na Vercel**

Criar deployment de produção para `energia-do-corpo`, aguardar `READY` e confirmar `aliasError: null` para `energia-do-corpo.vercel.app`.

- [ ] **Step 5: Registrar evidências finais**

Informar quantidade de testes aprovados, resultado do lint e build, SHA remoto e ID do deployment.
