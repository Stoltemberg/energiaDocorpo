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

- Converter a fotografia íntegra para WebP de alta qualidade e salvá-la como `public/hero-producao-v2.webp`.
- Atualizar todas as referências da fotografia para o novo caminho, forçando a invalidação do cache do arquivo corrompido.
- Manter o arquivo abaixo de 700 KB para evitar truncamento durante o transporte em Base64.
- Preservar o comportamento atual de `next/image` com `object-fit: contain`.
- Remover `public/hero-producao.png` somente depois que nenhuma referência ao caminho antigo permanecer.

## Validação

- Confirmar que o WebP é decodificado integralmente por uma ferramenta independente.
- Confirmar dimensões, formato RGB e tamanho inferior a 700 KB.
- Comparar o hash Git do arquivo local com o hash retornado pelo GitHub após a publicação; os valores devem ser idênticos.
- Executar testes, lint e build do projeto.
- Confirmar o deploy de produção como `READY` antes da entrega.
