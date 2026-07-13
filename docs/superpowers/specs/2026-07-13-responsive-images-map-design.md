# Ajustes responsivos de imagens, cabeçalho e minimapa

## Objetivo

Corrigir o enquadramento das fotografias na versão desktop, centralizar o logotipo no cabeçalho mobile e substituir o aspecto repetitivo do minimapa por uma composição mais intencional, usando o logotipo oficial como marcador.

## Escopo aprovado

### Fotografias no desktop

- Manter as fotografias preenchendo integralmente suas seções com `background-size: cover`.
- Ajustar separadamente o `background-position` da imagem principal e da imagem intermediária.
- Preservar o atleta como ponto focal, evitando cortes no rosto, tronco e braços sempre que a proporção da seção permitir.
- Não adicionar faixas vazias ou alterar a altura atual das seções apenas para mostrar a imagem inteira.
- Manter os enquadramentos mobile existentes, salvo pequenos ajustes necessários para evitar regressões.

### Logotipo no mobile

- Centralizar visualmente o logotipo no cabeçalho em telas de até 640 px.
- A centralização deve ser independente da presença ou largura de outros elementos do cabeçalho.
- Preservar o tamanho atual do logotipo e a área de toque do link para o início da página.
- Não alterar o alinhamento do cabeçalho desktop.

### Minimapa

- Remover o padrão em mosaico produzido por fundos repetidos.
- Criar uma composição abstrata de ruas com linhas únicas, assimétricas e sem repetição perceptível.
- Manter o minimapa decorativo, sem interação, dados geográficos reais ou dependências externas.
- Preservar a identidade escura da seção, com contraste suficiente entre fundo, ruas e marcador.

### Marcador do minimapa

- Substituir a letra `E` pelo logotipo oficial da Energia do Corpo.
- Usar o logotipo dentro de um marcador vermelho circular, com respiro interno e boa legibilidade.
- Manter uma sombra ou halo discreto para separar o marcador das linhas do mapa.
- Fornecer texto alternativo apenas se o marcador deixar de ser puramente decorativo; na implementação atual ele continuará com `aria-hidden`.

## Estratégia técnica

- Concentrar as alterações em `app/globals.css` e `app/page.tsx`.
- Reutilizar `public/logo-energia-do-corpo.png`; não criar um novo ativo visual.
- Representar as ruas com pseudo-elementos e gradientes sem repetição, evitando bibliotecas de mapas.
- Adicionar testes de fonte para confirmar os novos seletores, o uso do logotipo no marcador e a ausência do antigo `E`.

## Validação

- Executar os testes automatizados, lint e build de produção.
- Verificar a página renderizada em uma largura desktop e uma largura mobile.
- Confirmar que as imagens mantêm o ponto focal, o logotipo mobile está centralizado e o minimapa não apresenta mosaico.
- Confirmar que o marcador usa o logotipo oficial e que não surgiram erros relevantes no console.

## Fora do escopo

- Integração com mapas reais ou geolocalização.
- Troca das fotografias atuais.
- Redesenho das demais seções da landing page.
- Alteração de textos, CTAs ou destinos dos links.
