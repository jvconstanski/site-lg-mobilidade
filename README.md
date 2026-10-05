# Site institucional da LG Mobilidade Urbana

Site estático da LG Mobilidade Urbana, consultoria técnica em planejamento, gestão e operação de transporte público. É HTML, CSS e JavaScript puros: não tem build, não tem dependência e não tem banco de dados.

Endereço publicado: https://sitelg.consultoriasdigitais.com.br

## Estrutura de pastas

```
/
├── index.html              Home
├── quem-somos.html         Quem Somos
├── servicos.html           Serviços
├── areas-de-atuacao.html   Áreas de Atuação
├── 404.html                página de erro (usa caminhos absolutos, funciona em qualquer rota)
├── favicon.ico             ícone pedido pelo navegador na raiz
├── site.webmanifest        nome, cores e ícones do site para celular
├── robots.txt              regras para buscadores
├── sitemap.xml             lista das páginas para o Google
├── llms.txt                resumo do site para assistentes de IA
├── llms-full.txt           versão completa do texto do site para assistentes de IA
├── vercel.json             headers de segurança e de cache
└── assets/
    ├── css/site.css        todo o estilo do site
    ├── js/site.js          menu, animações, modal e envio do formulário
    ├── fonts/              Archivo e IBM Plex Sans (servidas pelo próprio site)
    ├── img/                imagem de compartilhamento (og-lg.png) e ilustrações
    └── logo/               logos, favicons e ícone da tela inicial
```

Os links internos usam a extensão `.html`. Mantenha assim: o `site.js` depende disso para a transição entre páginas.

## Rodar no computador

Com Python 3 instalado, abra um terminal na pasta do repositório e rode:

```bash
python -m http.server 8000
```

Depois abra http://localhost:8000 no navegador. O servidor do Python não devolve a `404.html` em rota inexistente; na Vercel isso acontece sozinho.

## Publicar na Vercel

1. Suba este repositório para a sua conta do GitHub.
2. Na Vercel, clique em **Add New > Project** e importe o repositório.
3. Em **Framework Preset**, escolha **Other**.
4. Deixe **Build Command** e **Output Directory** vazios, sem build. O **Root Directory** é a raiz do repositório.
5. Clique em **Deploy**.

O `vercel.json` já traz os headers de segurança (CSP, HSTS e afins) e as regras de cache. Não precisa configurar nada no painel. A cada push na branch `main`, a Vercel publica de novo.

## Ligar o domínio

1. No projeto da Vercel, abra **Settings > Domains** e adicione `sitelg.consultoriasdigitais.com.br`.
2. No painel de DNS do domínio `consultoriasdigitais.com.br`, crie um registro **CNAME** com o nome `sitelg` apontando para `cname.vercel-dns.com` (ou o valor que a Vercel mostrar na tela).
3. Espere a Vercel marcar o domínio como válido. O certificado HTTPS sai sozinho.

Para conferir depois de publicado:

```bash
curl -sI https://sitelg.consultoriasdigitais.com.br/
curl -sI https://sitelg.consultoriasdigitais.com.br/pasta/rota-que-nao-existe
```

A primeira deve responder 200 e a segunda, 404 com a página de erro do site.

## Formulário de contato

O formulário "Fale com a LG" envia pelo Formspree. O endereço do formulário fica na constante `FORMSPREE_ENDPOINT`, na linha 1 de `assets/js/site.js`. Hoje as mensagens chegam em lg@lgmobilidadeurbana.com.

Para trocar de conta:

1. Crie uma conta no Formspree (https://formspree.io) e um formulário novo, com o e-mail que vai receber os contatos.
2. Copie o endereço do formulário que o Formspree gerar.
3. Troque o valor de `FORMSPREE_ENDPOINT` na linha 1 de `assets/js/site.js`.
4. Suba a mudança. Mande uma mensagem de teste pelo site e confirme a chegada no e-mail.

Se o endereço novo não for de `https://formspree.io`, ajuste também o `connect-src` e o `form-action` do header `Content-Security-Policy` no `vercel.json`. Sem isso, o navegador bloqueia o envio.

## SEO e GEO

Estes arquivos ajudam o Google e os assistentes de IA a entender o site:

- `sitemap.xml`: lista das páginas com o endereço completo.
- `robots.txt`: libera a leitura do site e aponta para o sitemap.
- `llms.txt` e `llms-full.txt`: texto do site organizado para assistentes de IA.
- Em cada página HTML: `<link rel="canonical">`, as tags `og:` de compartilhamento (com a imagem `assets/img/og-lg.png`) e os dados estruturados em JSON-LD.

### Se o domínio mudar

O endereço `https://sitelg.consultoriasdigitais.com.br` aparece escrito por extenso nestes arquivos. Troque em todos:

- `index.html`, `quem-somos.html`, `servicos.html`, `areas-de-atuacao.html` e `404.html` (canonical, `og:url`, `og:image` e JSON-LD)
- `sitemap.xml`
- `robots.txt` (linha do sitemap)
- `llms.txt` e `llms-full.txt`

Uma busca por `sitelg.consultoriasdigitais.com.br` no repositório mostra todos os pontos. Depois de publicar, envie o sitemap novo no Google Search Console.
