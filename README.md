# Guia Ubuntu para Iniciantes

Curso de Ubuntu em português, do zero ao avançado, organizado em **3 níveis + projetos**. Cada aula explica o comando parte por parte (anatomia), mostra a sessão de terminal com a resposta real do Ubuntu 26.04, apresenta formas diferentes de fazer, cenários de erro e exercícios. Um **terminal simulado** (máquina fictícia "notebook") roda no navegador para praticar sem risco.

Site 100% estático (HTML + CSS + JS, sem build e sem dependências externas). Funciona abrindo o `index.html` direto no navegador e no GitHub Pages.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `guia-ubuntu`).
2. Envie o conteúdo desta pasta para a branch `main`.
3. No repositório: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** · pasta **/ (root)**
4. Em 1–2 minutos o site fica em `https://<seu-usuario>.github.io/guia-ubuntu/`.

## Estrutura

```
index.html            página inicial
<tema>.html           uma página por tema (ls.html, apt.html, ssh.html…)
assets/style.css      visual (tema claro/escuro automático)
assets/site.js        níveis/menu, Anterior/Próximo, sessões de terminal, anatomia, exercícios
assets/sim.js         terminal simulado (carregado só nas páginas com "Experimente")
CONTRIBUINDO.md       como escrever uma aula
.nojekyll             faz o GitHub Pages servir os arquivos como estão
```

## Adicionar uma página nova

Leia **`CONTRIBUINDO.md`** (padrão de aula, componentes e regras de fidelidade). Resumo:

1. Copie `criar.html` (a página-modelo) e troque o conteúdo de `<div class="content">`.
2. Adicione a página na lista `NIVEIS` no topo de `assets/site.js`. O menu, o selo de nível e os botões Anterior/Próximo saem dela.

## Componentes

Sessão de terminal (`pre.term`), anatomia do comando (`dl.anatomy`), terminal simulado com missão (`div.try`), cenários de erro (`div.cenario`), passo a passo (`ol.passo`), avisos, tabelas, exercícios e múltipla escolha. Todos estão documentados, com exemplos, em **`CONTRIBUINDO.md`**.
