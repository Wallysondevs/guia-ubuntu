# Como escrever uma página do Guia Ubuntu

O guia é uma **escola**, não uma lista de comandos. O leitor é iniciante: nunca mostre um comando completo sem antes explicar cada parte, o que ele devolve e o que fazer quando não funciona. A página-modelo é **`criar.html`**: copie a estrutura dela.

## 1. Esqueleto do arquivo

```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ubuntu TEMA — descrição curta | Guia Ubuntu</title>
<meta name="description" content="Uma frase sobre a página.">
<link rel="stylesheet" href="assets/style.css">
<script>try{var t=localStorage.getItem("tema");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
</head>
<body>
<div class="layout">
<nav class="sidebar" id="sidebar" aria-label="Tópicos"></nav>
<main class="main">
<div class="content">
<div class="pager"></div>
<h1>Ubuntu <span class="hl">TEMA</span></h1>
… conteúdo …
<div class="pager"></div>
</div>
</main>
</div>
<script src="assets/site.js"></script>
</body>
</html>
```

O menu, o selo de nível (Nível 1/2/3) e os botões Anterior/Próximo são gerados por `assets/site.js` a partir da lista `NIVEIS`. Página nova = adicionar na `NIVEIS`.

## 2. Ordem de uma aula

1. **Intro** (`p.intro`): o que é, para que serve, em 2–3 frases.
2. **"Você vai aprender"** (`div.note` com lista de 3–5 itens).
3. **Conceito antes do comando**: explique a ideia (o que é um processo, uma permissão…) antes da sintaxe.
4. **Do simples ao completo**: primeiro a forma mais simples; depois **uma opção nova por vez**. Cada forma nova ganha uma `dl.anatomy` explicando cada parte.
5. **Toda saída explicada**: depois de cada sessão, diga o que o leitor está vendo. Use anotações `«` nas linhas importantes e tabelas para colunas (ex.: colunas do `ps aux`).
6. **O que o comando devolve**: saída + código de saída (`echo $?`), principalmente quando o comando não imprime nada (ex.: `pgrep` sem resultado devolve 1).
7. **Formas diferentes de fazer** a mesma tarefa, com tabela "Qual usar?".
8. **Experimente** (`div.try`) com missão, sempre que o simulador suportar o comando.
9. **Quando não funciona** (`div.cenario`): mensagem real → o que aconteceu → como confirmar → como resolver. Inclua o caso "não apareceu nada".
10. **Referência de opções** (`table.ref`).
11. **Exercícios** (3 ou mais: `.exercise` e `.mc`).
12. **Resumo** (lista curta).

## 3. Componentes

### Sessão de terminal (máquina fictícia)
```html
<pre class="term">$ ps
    PID TTY          TIME CMD
   3001 pts/0    00:00:00 bash        « o seu terminal
   3100 pts/0    00:00:00 ps          « o próprio ps
$ cd Documentos
$ ls
#> apt update
</pre>
```
- `$ ` = comando do usuário (vira `ana@notebook:~$`). `#> ` = comando como root (`root@notebook:~#`).
- O prompt acompanha os `cd` da sessão. Pasta inicial: `data-cwd="~/projeto"`.
- `data-user`, `data-host` (ex.: `data-host="servidor"`), `data-title` mudam a janela.
- `«` inicia uma anotação (aparece como etiqueta laranja, não é copiada).
- Comentário dentro da sessão: linha `# texto` (sem `$`) aparece como saída; prefira explicar no texto.
- Use `pre.file data-file="nome"` para mostrar o conteúdo de um arquivo (scripts, configurações).
- **Não use** `pre.cmd`/`pre.out` (formato antigo).

### Anatomia do comando
```html
<dl class="anatomy">
  <dt>pgrep</dt><dd>O programa: procura processos pelo nome.</dd>
  <dt>-a</dt><dd>Mostra a linha de comando completa.</dd>
  <dt>chrome</dt><dd>O nome a procurar.</dd>
</dl>
```

### Experimente (simulador interativo)
```html
<div class="try" data-setup="mkdir semestre;;cd semestre" data-goal="dir:~/semestre/jan,dir:~/semestre/fev">
<p class="try-task"><strong>Missão:</strong> crie as pastas jan e fev.</p>
</div>
```
- `data-setup`: comandos rodados antes, separados por `;;`.
- `data-goal` (todas precisam ser verdade): `dir:CAMINHO`, `file:CAMINHO`, `absent:CAMINHO`, `cwd:CAMINHO`, `contains:CAMINHO=texto`, `noproc:nome`, `ran:regex`.
- Garanta que a missão **não** já esteja cumprida pelo setup.

**O que o simulador sabe fazer:** `pwd cd pushd popd ls tree mkdir touch rmdir rm cp mv cat head tail wc grep sort uniq cut tr find echo printf seq xargs chmod date whoami hostname id groups uname uptime lsb_release free df history clear type which alias unalias export env printenv source test [ [[ sudo exit ps pgrep pkill kill killall help` + pipes, `> >> 2> 2>&1 < /dev/null`, `; && ||`, `$VAR`, `${VAR…}` (`${#v}`, `${v%.*}`, `${v:-x}`, `${v/a/b}`), `$(cmd)`, `$((conta))`, `$?`, chaves, curingas, `for …; do …; done`, `if …; then …; else …; fi`, funções de uma linha `f() { …; }`, Tab, histórico, `sudo -i`.
**Não sabe:** apt, snap, systemctl, redes, editores, chown, tar, sed, awk, ln, du, `while`, `read`… Para esses, use só `pre.term` (nunca finja um `.try`).

**Máquina fictícia (estado inicial):** usuária `ana` (grupos ana adm cdrom sudo dip plugdev users lpadmin), máquina `notebook`, pasta `/home/ana` com `Área de trabalho/ Documentos/ Downloads/ Imagens/ Modelos/ Música/ Público/ Vídeos/ frutas.txt .bashrc .profile`; `Documentos/` tem `notas.txt acesso.log relatorio.odt projetos/{backup.sh, site/{index.html, style.css}}`; `Downloads/` tem `ubuntu-26.04-desktop-amd64.iso manual.pdf foto.jpg musica.mp3 fotos-viagem.zip`; `Imagens/` tem `ferias.jpg perfil.png`. `/etc` tem `hostname hosts os-release passwd shadow apt/`. `/root` é proibido para a ana. Processos: systemd(1), NetworkManager(812), gnome-shell(1534), chrome(2210, 2251; linha de comando `/snap/chromium/…/chrome`), nautilus(2304), gnome-text-edit(2388), ptyxis(2950), bash(3001).

### Outros blocos
| Bloco | Uso |
| --- | --- |
| `div.note` / `div.tip` / `div.warning` | Nota / dica / perigo (todo comando destrutivo leva `warning`) |
| `div.cenario` | Problema real: `<strong>título</strong>` + sessão + o que aconteceu + como resolver |
| `ol.passo` | Passo a passo numerado (projetos, procedimentos) |
| `div.table-wrap > table.ref` | Tabelas |
| `.exercise > .ex-code > input[data-answer="a\|b"]` | Exercício de completar |
| `.mc[data-answer="2"]` | Múltipla escolha (posição da certa, começando em 1; `name` único) |

## 4. Fidelidade ao Ubuntu 26.04

- Os comandos básicos são do **rust-coreutils** e o sudo é o **sudo-rs**. Mensagens são misturadas: `ls`, `rm`, `cp`, `mv`, `bash`, `grep`, `find`, `apt` em português; `cat`, `head`, `tail`, `rmdir`, `ln`, `chown`, `du` e parte do `mkdir`/`touch` em inglês.
- `ls`: ordem por código de caractere (maiúsculas antes, acentos no fim), nomes com espaço entre aspas, mês em inglês no `-l` (`Oct 15 10:30`).
- O prompt do sudo é `[sudo: authenticate] Senha:`.
- Gere saídas exatas de `ls` e afins com o simulador:
  `node -e "const S=require('./assets/sim.js');const sh=new S.Shell();['mkdir x','ls'].forEach(l=>sh.rodar(l).forEach(r=>process.stdout.write((r.texto||'').replace(/\u0001./g,'').replace(/\u0002/g,''))))"`
- Para conferir no sistema real, rode num shell limpo (sem apelidos): `env -i LANG=pt_BR.UTF-8 PATH=/usr/bin:/bin bash --norc -c '...'`, só numa pasta temporária, sem sudo e sem alterar o sistema.
- O que não dá para rodar (root, hardware, serviços) leva saída típica; quando números e versões variam, diga no texto que a saída é ilustrativa.

## 5. Escrita

- Português do Brasil, frases curtas, um assunto por parágrafo.
- Explique a origem em inglês de cada comando (`mkdir` = *make directory*).
- Termo técnico novo → explique na hora ou link para `glossario.html`.
- Dentro de qualquer `<pre>`, escreva `&lt;` `&gt;` `&amp;`.
- Links internos só para páginas que existem na `NIVEIS`.
