# Substituição da fotografia principal

## Objetivo

Substituir `public/hero-producao.png`, que está estruturalmente corrompido, por uma fotografia íntegra que preserve a identidade visual já aprovada para a landing page da Energia do Corpo.

## Direção visual

- Homem adulto treinando com equipamento de musculação em uma academia.
- Ambiente predominantemente preto, com iluminação e elementos arquitetônicos vermelhos.
- Estética fotográfica realista, intensa e profissional.
- Roupa esportiva preta, sem marcas identificáveis.
- Sem textos, logotipos, marcas-d'água ou elementos gráficos incorporados à fotografia.
- Expressão de esforço natural, sem deformações anatômicas.

## Composição e enquadramento

- Formato horizontal, adequado a uma seção hero de tela larga.
- Atleta posicionado principalmente na metade direita da imagem.
- Metade esquerda mais escura e visualmente limpa para receber o título e o CTA do site.
- Cabeça, tronco, braços e equipamento principal completamente visíveis.
- Margens de segurança ao redor do atleta para permitir a exibição integral com `object-fit: contain` no desktop e mobile.
- Fundo escuro contínuo nas bordas para integrar naturalmente às áreas pretas do layout.

## Integração

- Substituir somente o conteúdo binário de `public/hero-producao.png`, mantendo o caminho atual para não alterar componentes ou referências existentes.
- Exportar como PNG válido em RGB, sem corrupção ou dados truncados.
- Preservar o comportamento atual de `next/image` com `object-fit: contain`.

## Validação

- Confirmar que o arquivo é decodificado integralmente por uma ferramenta independente.
- Confirmar dimensões, formato RGB e integridade do PNG.
- Executar testes, lint e build do projeto.
- Confirmar o deploy de produção como `READY` antes da entrega.
