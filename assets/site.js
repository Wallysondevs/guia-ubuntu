/* =========================================================
   Guia Ubuntu — navegação e componentes
   NIVEIS é a única fonte do menu lateral, do selo de nível e
   dos botões Anterior/Próximo. Para adicionar uma página,
   inclua-a aqui.
   ========================================================= */
var NIVEIS = [
  { id: "n1", nome: "Nível 1 · Iniciante", curto: "Iniciante", desc: "Usar o Ubuntu no dia a dia com segurança", grupos: [
    { grupo: "Começando", itens: [
      ["index.html", "Início"],
      ["introducao.html", "Introdução"],
      ["instalacao.html", "Instalação"],
      ["desktop.html", "O Desktop"],
      ["terminal.html", "O Terminal"],
      ["simulador.html", "Terminal Simulado"],
      ["sintaxe.html", "Sintaxe dos Comandos"],
      ["ajuda.html", "Obtendo Ajuda"],
      ["primeiros-comandos.html", "Primeiros Comandos"]
    ]},
    { grupo: "Navegação", itens: [
      ["estrutura-diretorios.html", "Estrutura de Diretórios"],
      ["caminhos.html", "Caminhos"],
      ["navegar.html", "pwd e cd"],
      ["ls.html", "ls"]
    ]},
    { grupo: "Arquivos", itens: [
      ["criar.html", "touch e mkdir"],
      ["copiar-mover.html", "cp e mv"],
      ["remover.html", "rm e rmdir"],
      ["ver-arquivos.html", "cat, less, head, tail"],
      ["curingas.html", "Curingas"],
      ["editores.html", "nano e vim"]
    ]},
    { grupo: "Programas", itens: [
      ["apt.html", "apt"],
      ["snap.html", "Snap"],
      ["atualizacoes.html", "Atualizações"]
    ]},
    { grupo: "Usuários", itens: [
      ["sudo.html", "sudo"],
      ["permissoes.html", "Entendendo Permissões"]
    ]},
    { grupo: "Socorro", itens: [
      ["travamentos.html", "Quando o Sistema Trava"],
      ["processos.html", "ps, pgrep, top"],
      ["kill.html", "Encerrar Programas (kill)"]
    ]}
  ]},
  { id: "n2", nome: "Nível 2 · Intermediário", curto: "Intermediário", desc: "Dominar o terminal e administrar a própria máquina", grupos: [
    { grupo: "Arquivos", itens: [
      ["find.html", "find e locate"],
      ["links.html", "Links (ln)"],
      ["compactar.html", "tar, zip, gzip"]
    ]},
    { grupo: "Texto", itens: [
      ["grep.html", "grep"],
      ["texto.html", "sort, uniq, cut, wc, tr"],
      ["sed.html", "sed"],
      ["awk.html", "awk"],
      ["redirecionamento.html", "Redirecionamento"],
      ["pipes.html", "Pipes e xargs"]
    ]},
    { grupo: "Usuários e Permissões", itens: [
      ["usuarios.html", "Usuários e Grupos"],
      ["chmod.html", "chmod"],
      ["chown.html", "chown, chgrp, umask"]
    ]},
    { grupo: "Pacotes", itens: [
      ["dpkg.html", "dpkg e .deb"],
      ["repositorios.html", "Repositórios e PPAs"],
      ["flatpak.html", "Flatpak"]
    ]},
    { grupo: "Processos e Serviços", itens: [
      ["jobs.html", "Jobs, nohup, tmux"],
      ["systemctl.html", "systemctl"],
      ["criar-servico.html", "Criar um Serviço"],
      ["journalctl.html", "Logs (journalctl)"]
    ]},
    { grupo: "Redes", itens: [
      ["redes.html", "Conceitos de Rede"],
      ["ip.html", "ip, ping, ss"],
      ["curl-wget.html", "curl, wget, dig"],
      ["configurar-rede.html", "Configurar a Rede"],
      ["wifi.html", "Wi-Fi"],
      ["wifi-problemas.html", "Wi-Fi que Não Funciona"],
      ["celular-modem.html", "Celular e Modem 4G"],
      ["ssh.html", "SSH"],
      ["scp-rsync.html", "scp e rsync"]
    ]},
    { grupo: "Discos", itens: [
      ["discos.html", "lsblk, df, du"],
      ["montar.html", "mount e fstab"],
      ["backup.html", "Backup"]
    ]},
    { grupo: "Shell Script", itens: [
      ["bashrc.html", ".bashrc, alias, PATH"],
      ["script-intro.html", "Primeiro Script"],
      ["script-variaveis.html", "Variáveis e Argumentos"],
      ["script-condicionais.html", "Condicionais"],
      ["script-lacos.html", "Laços"],
      ["script-funcoes.html", "Funções"],
      ["cron.html", "Agendar Tarefas (cron)"]
    ]}
  ]},
  { id: "n3", nome: "Nível 3 · Avançado", curto: "Avançado", desc: "Servidores, infraestrutura e recuperação", grupos: [
    { grupo: "Segurança", itens: [
      ["ufw.html", "Firewall (ufw)"],
      ["seguranca.html", "Segurança do Servidor"],
      ["nftables.html", "nftables"],
      ["wireguard.html", "VPN (WireGuard)"]
    ]},
    { grupo: "Sistema", itens: [
      ["info-sistema.html", "Informações do Sistema"],
      ["desempenho.html", "Desempenho e Monitoramento"],
      ["manutencao.html", "Manutenção"],
      ["boot-grub.html", "Boot, GRUB e Kernel"],
      ["recuperacao.html", "Recuperar um Sistema"]
    ]},
    { grupo: "Armazenamento", itens: [
      ["particionar.html", "Particionar e Formatar"],
      ["lvm.html", "LVM"],
      ["raid.html", "RAID (mdadm)"],
      ["zfs.html", "ZFS"]
    ]},
    { grupo: "Servidores", itens: [
      ["nginx.html", "Servidor Web (nginx)"],
      ["https.html", "HTTPS (Let's Encrypt)"],
      ["banco-dados.html", "Bancos de Dados"]
    ]},
    { grupo: "Containers e VMs", itens: [
      ["docker.html", "Docker"],
      ["docker-compose.html", "Docker Compose"],
      ["lxd.html", "LXD"],
      ["kvm.html", "KVM e virt-manager"]
    ]},
    { grupo: "Automação", itens: [
      ["git.html", "Git"],
      ["ansible.html", "Ansible"],
      ["cloud-init.html", "cloud-init"]
    ]}
  ]},
  { id: "proj", nome: "Projetos", curto: "Projetos", desc: "Laboratórios passo a passo", grupos: [
    { grupo: "Laboratórios", itens: [
      ["projetos.html", "Como Usar os Projetos"],
      ["projeto-servidor-web.html", "Servidor Web do Zero"],
      ["projeto-backup.html", "Backup Automático"],
      ["projeto-quebre-conserte.html", "Quebre e Conserte"],
      ["projeto-servidor-arquivos.html", "Servidor de Arquivos"],
      ["projeto-docker.html", "App com Docker"]
    ]}
  ]},
  { id: "ref", nome: "Referência", curto: "Referência", desc: "Consulta rápida", grupos: [
    { grupo: "Consulta", itens: [
      ["ref-comandos.html", "Referência de Comandos"],
      ["ref-atalhos.html", "Atalhos de Teclado"],
      ["glossario.html", "Glossário"],
      ["problemas.html", "Solução de Problemas"],
      ["quiz.html", "Quiz"]
    ]}
  ]}
];

(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var atual = location.pathname.split("/").pop() || "index.html";

  // Lista linear de páginas (para Anterior/Próximo) e localização da atual
  var plano = [], aqui = null;
  NIVEIS.forEach(function (n) {
    n.grupos.forEach(function (g) {
      g.itens.forEach(function (i) {
        var item = { href: i[0], titulo: i[1], nivel: n, grupo: g.grupo };
        plano.push(item);
        if (i[0] === atual) aqui = item;
      });
    });
  });
  var pos = aqui ? plano.indexOf(aqui) : -1;

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function semAcento(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  /* ---------- Barra superior ---------- */
  var links = NIVEIS.map(function (n) {
    return '<a class="top-link' + (aqui && aqui.nivel === n ? " ativo" : "") + '" href="' + n.grupos[0].itens[0][0] + '">' + n.curto + "</a>";
  }).join("");
  var header = el("header", { "class": "topbar" },
    '<button class="icon-btn" id="menu-btn" aria-label="Abrir menu" aria-expanded="false">&#9776;</button>' +
    '<a class="brand" href="index.html"><span class="brand-mark">U</span>Guia Ubuntu</a>' +
    '<nav class="top-links" aria-label="Níveis">' + links + "</nav>" +
    '<span class="spacer"></span>' +
    '<button class="icon-btn" id="theme-btn" aria-label="Alternar tema claro/escuro" title="Alternar tema"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>');
  body.insertBefore(header, body.firstChild);

  /* ---------- Menu lateral com abas de nível ---------- */
  var sidebar = document.getElementById("sidebar");
  if (sidebar) {
    var nivelAtivo = aqui ? aqui.nivel.id : "n1";
    var html = '<div class="sidebar-filter"><input type="search" placeholder="Buscar em todos os níveis…" aria-label="Buscar tópicos"></div>';
    html += '<div class="nivel-tabs" role="tablist">' + NIVEIS.map(function (n) {
      return '<button type="button" role="tab" data-nivel="' + n.id + '" class="tab-' + n.id + '">' + n.curto + "</button>";
    }).join("") + "</div>";
    NIVEIS.forEach(function (n) {
      html += '<div class="nivel-lista" data-nivel="' + n.id + '"><p class="nivel-desc">' + n.desc + "</p>";
      n.grupos.forEach(function (g) {
        html += '<div class="grupo"><h2>' + g.grupo + "</h2><ul>";
        g.itens.forEach(function (i) {
          html += '<li><a href="' + i[0] + '"' + (i[0] === atual ? ' class="active" aria-current="page"' : "") + ">" + i[1] + "</a></li>";
        });
        html += "</ul></div>";
      });
      html += "</div>";
    });
    sidebar.innerHTML = html;

    var mostrar = function (id) {
      sidebar.querySelectorAll(".nivel-lista").forEach(function (l) { l.hidden = l.getAttribute("data-nivel") !== id; });
      sidebar.querySelectorAll(".nivel-tabs button").forEach(function (b) {
        var on = b.getAttribute("data-nivel") === id;
        b.classList.toggle("on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
    };
    mostrar(nivelAtivo);
    sidebar.querySelectorAll(".nivel-tabs button").forEach(function (b) {
      b.addEventListener("click", function () { mostrar(b.getAttribute("data-nivel")); sidebar.scrollTop = 0; });
    });

    var ativo = sidebar.querySelector("a.active");
    if (ativo) sidebar.scrollTop = ativo.offsetTop - sidebar.clientHeight / 2;

    sidebar.querySelector(".sidebar-filter input").addEventListener("input", function () {
      var q = semAcento(this.value.trim());
      if (!q) { mostrar(nivelAtivo); sidebar.querySelectorAll(".grupo, li").forEach(function (x) { x.style.display = ""; }); sidebar.classList.remove("buscando"); return; }
      sidebar.classList.add("buscando");
      sidebar.querySelectorAll(".nivel-lista").forEach(function (l) {
        var algumNivel = false;
        l.querySelectorAll(".grupo").forEach(function (g) {
          var algum = false;
          g.querySelectorAll("li").forEach(function (li) {
            var ok = semAcento(li.textContent + " " + g.querySelector("h2").textContent).indexOf(q) !== -1;
            li.style.display = ok ? "" : "none";
            if (ok) algum = true;
          });
          g.style.display = algum ? "" : "none";
          if (algum) algumNivel = true;
        });
        l.hidden = !algumNivel;
      });
    });
  }

  /* ---------- Selo de nível abaixo do título ---------- */
  var h1 = document.querySelector(".content h1");
  if (h1 && aqui && atual !== "index.html") {
    var selo = el("p", { "class": "selo selo-" + aqui.nivel.id }, '<span class="selo-nivel">' + aqui.nivel.nome + '</span><span class="selo-grupo">' + aqui.grupo + "</span>");
    h1.parentNode.insertBefore(selo, h1.nextSibling);
  }

  /* ---------- Anterior / Próximo ---------- */
  document.querySelectorAll(".pager").forEach(function (p) {
    var h = "";
    if (pos > 0) h += '<a class="prev" href="' + plano[pos - 1].href + '">&#10094; Anterior</a>';
    if (pos >= 0 && pos < plano.length - 1) h += '<a class="next" href="' + plano[pos + 1].href + '">Próximo &#10095;</a>';
    p.innerHTML = h;
  });

  /* ---------- Rodapé ---------- */
  var content = document.querySelector(".content");
  if (content) {
    content.appendChild(el("footer", { "class": "site-footer" },
      "Guia Ubuntu para Iniciantes · Referência: Ubuntu 26.04 LTS · Os exemplos são para estudo; confira sempre antes de rodar em produção."));
  }

  /* ---------- Tema ---------- */
  document.getElementById("theme-btn").addEventListener("click", function () {
    var t = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var novo = t === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", novo);
    try { localStorage.setItem("tema", novo); } catch (e) {}
  });

  /* ---------- Menu no celular ---------- */
  var menuBtn = document.getElementById("menu-btn");
  menuBtn.addEventListener("click", function () {
    var aberto = body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", aberto ? "true" : "false");
  });

  /* ---------- Copiar ---------- */
  function botaoCopiar(bloco, texto) {
    var b = el("button", { "class": "copy-btn", "type": "button" }, "copiar");
    b.addEventListener("click", function () {
      var feito = function () { b.textContent = "copiado!"; setTimeout(function () { b.textContent = "copiar"; }, 1500); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(feito);
      } else {
        var t = el("textarea"); t.value = texto; body.appendChild(t); t.select();
        try { document.execCommand("copy"); feito(); } catch (e) {}
        body.removeChild(t);
      }
    });
    bloco.appendChild(b);
  }

  /* ---------- Sessão de terminal (máquina fictícia) ----------
     <pre class="term">$ comando
     saída do comando        « anotação opcional
     #> comando como root
     </pre>
     data-user (ana) · data-host (notebook) · data-cwd (~)
     O prompt acompanha os "cd" da própria sessão. */
  function resolver(cwd, alvo, home) {
    if (!alvo || alvo === "~") return home;
    if (alvo === "-") return cwd;
    if (alvo.indexOf("~/") === 0) alvo = home + alvo.slice(1);
    var partes = (alvo[0] === "/" ? alvo : cwd + "/" + alvo).split("/"), out = [];
    partes.forEach(function (x) { if (!x || x === ".") return; if (x === "..") out.pop(); else out.push(x); });
    return "/" + out.join("/");
  }
  function curto(p, home) { return p === home ? "~" : p.indexOf(home + "/") === 0 ? "~" + p.slice(home.length) : p; }

  document.querySelectorAll("pre.term").forEach(function (pre) {
    var user = pre.getAttribute("data-user") || "ana",
      host = pre.getAttribute("data-host") || "notebook",
      homeUser = user === "root" ? "/root" : "/home/" + user,
      cwd = resolver("/", (pre.getAttribute("data-cwd") || "~").replace(/^~/, homeUser), homeUser);
    var linhas = pre.textContent.replace(/^\n+|\s+$/g, "").split("\n"), html = [], cmds = [];
    var tituloCwd = curto(cwd, homeUser), primeiroUser = user;
    linhas.forEach(function (l) {
      var m = /^(\$|#>) ?(.*)$/.exec(l);
      if (m) {
        var root_ = m[1] === "#>", u = root_ ? "root" : user, home = root_ ? "/root" : homeUser;
        var nota = "", ia = m[2].indexOf("«");
        if (ia !== -1) { nota = '<span class="t-a">← ' + esc(m[2].slice(ia + 1).trim()) + "</span>"; m[2] = m[2].slice(0, ia).replace(/\s+$/, ""); }
        html.push('<span class="t-p"><span class="t-u">' + u + "@" + host + '</span>:<span class="t-d">' + esc(curto(cwd, home)) + "</span>" + (root_ ? "#" : "$") + " </span>" + '<span class="t-c">' + esc(m[2]) + "</span>" + (nota ? "   " + nota : ""));
        cmds.push(m[2]);
        // acompanha cd simples (cd x; cd x && ...)
        var cd = /^\s*cd(?:\s+("[^"]*"|'[^']*'|\S+))?\s*(?:$|&&|;)/.exec(m[2]);
        if (cd) cwd = resolver(cwd, cd[1] ? cd[1].replace(/^["']|["']$/g, "") : "", home);
        if (/^\s*sudo -i\s*$/.test(m[2])) cwd = "/root";
        return;
      }
      var a = l.indexOf("«");
      if (a !== -1) html.push('<span class="t-o">' + esc(l.slice(0, a)) + '</span><span class="t-a">← ' + esc(l.slice(a + 1).trim()) + "</span>");
      else html.push('<span class="t-o">' + esc(l) + "</span>");
    });
    var janela = el("div", { "class": "term-win" });
    var titulo = pre.getAttribute("data-title") || (primeiroUser + "@" + host + ": " + tituloCwd);
    janela.innerHTML = '<div class="term-bar"><span class="sim-dots"><i></i><i></i><i></i></span><span class="term-title">' + esc(titulo) + "</span></div>";
    pre.parentNode.insertBefore(janela, pre);
    pre.innerHTML = html.join("\n");
    janela.appendChild(pre);
    if (cmds.join("").trim()) botaoCopiar(janela, cmds.filter(function (c) { return c.trim(); }).join("\n"));
  });

  /* ---------- Anatomia do comando ----------
     <dl class="anatomy">
       <dt>pgrep</dt><dd>o programa que procura processos</dd>
       <dt>-a</dt><dd>mostra a linha de comando completa</dd>
     </dl> */
  document.querySelectorAll("dl.anatomy").forEach(function (dl) {
    var dts = dl.querySelectorAll("dt"), linha = el("div", { "class": "anat-cmd" });
    dts.forEach(function (dt, i) {
      var n = i + 1;
      dt.setAttribute("data-n", n);
      dt.classList.add("anat-" + (i % 6));
      var parte = el("span", { "class": "anat-parte anat-" + (i % 6), "data-n": n }, esc(dt.textContent));
      linha.appendChild(parte);
      if (i < dts.length - 1) linha.appendChild(document.createTextNode(" "));
    });
    dl.parentNode.insertBefore(linha, dl);
    var caixa = el("div", { "class": "anat-box" });
    dl.parentNode.insertBefore(caixa, linha);
    caixa.appendChild(el("p", { "class": "anat-label" }, "Anatomia do comando"));
    caixa.appendChild(linha);
    caixa.appendChild(dl);
  });

  /* ---------- Blocos antigos pre.cmd (ainda suportados) ---------- */
  document.querySelectorAll("pre.cmd").forEach(function (pre) {
    var linhas = pre.textContent.replace(/^\n+|\s+$/g, "").split("\n"), continua = false, copiaveis = [];
    pre.innerHTML = linhas.map(function (l) {
      var out;
      if (/^\s*#/.test(l)) out = '<span class="cmt">' + esc(l) + "</span>";
      else if (continua || l.trim() === "") { out = esc(l); copiaveis.push(l); }
      else { out = '<span class="prompt">$ </span>' + esc(l); copiaveis.push(l); }
      continua = /\\\s*$/.test(l);
      return out;
    }).join("\n");
    botaoCopiar(pre, copiaveis.join("\n"));
  });
  document.querySelectorAll("pre.file").forEach(function (pre) {
    botaoCopiar(pre, pre.textContent.replace(/^\n+|\s+$/g, ""));
  });

  /* ---------- Experimente: carrega o simulador só quando necessário ---------- */
  var tries = document.querySelectorAll(".try");
  if (tries.length) {
    tries.forEach(function (t) {
      if (!t.querySelector(".try-head")) t.insertBefore(el("p", { "class": "try-head" }, "Experimente você mesmo"), t.firstChild);
    });
    var s = el("script", { src: "assets/sim.js" });
    body.appendChild(s);
  }

  /* ---------- Exercícios de completar ----------
     <div class="exercise"><div class="ex-code">ls <input data-answer="-a|-A"> ~</div></div> */
  document.querySelectorAll(".exercise").forEach(function (ex) {
    var inputs = ex.querySelectorAll(".ex-code input");
    if (!inputs.length) return;
    inputs.forEach(function (i) {
      i.setAttribute("autocomplete", "off");
      i.setAttribute("spellcheck", "false");
      i.setAttribute("autocapitalize", "off");
      var maior = 0;
      i.getAttribute("data-answer").split("|").forEach(function (r) { maior = Math.max(maior, r.length); });
      i.style.width = Math.max(4, maior + 2) + "ch";
    });
    var acoes = el("div", { "class": "ex-actions" },
      '<button type="button" class="ex-check">Verificar</button>' +
      '<button type="button" class="secondary ex-show">Mostrar resposta</button>' +
      '<span class="ex-result" aria-live="polite"></span>');
    ex.appendChild(acoes);
    var res = acoes.querySelector(".ex-result");
    function norm(s) { return s.trim().replace(/\s+/g, " "); }
    acoes.querySelector(".ex-check").addEventListener("click", function () {
      var tudo = true;
      inputs.forEach(function (i) {
        var certas = i.getAttribute("data-answer").split("|").map(norm);
        var ok = certas.indexOf(norm(i.value)) !== -1;
        i.classList.toggle("ok", ok);
        i.classList.toggle("bad", !ok);
        if (!ok) tudo = false;
      });
      res.textContent = tudo ? "Correto!" : "Ainda não. Tente de novo.";
      res.className = "ex-result " + (tudo ? "ok" : "bad");
    });
    acoes.querySelector(".ex-show").addEventListener("click", function () {
      inputs.forEach(function (i) {
        i.value = i.getAttribute("data-answer").split("|")[0];
        i.classList.remove("bad"); i.classList.add("ok");
      });
      res.textContent = "";
    });
    inputs.forEach(function (i) {
      i.addEventListener("keydown", function (e) { if (e.key === "Enter") acoes.querySelector(".ex-check").click(); });
    });
  });

  /* ---------- Múltipla escolha ----------
     <div class="mc" data-answer="2"><p class="mc-q">…</p><label><input type="radio" name="q1"> …</label>…</div> */
  document.querySelectorAll(".mc").forEach(function (mc) {
    var certa = parseInt(mc.getAttribute("data-answer"), 10) - 1;
    var labels = mc.querySelectorAll("label");
    var fb = el("p", { "class": "mc-feedback", "aria-live": "polite" });
    mc.appendChild(fb);
    labels.forEach(function (lb, n) {
      lb.querySelector("input").addEventListener("change", function () {
        labels.forEach(function (x) { x.classList.remove("ok", "bad"); });
        if (n === certa) { lb.classList.add("ok"); fb.textContent = "Correto!"; fb.style.color = "var(--ok)"; }
        else { lb.classList.add("bad"); fb.textContent = "Não é essa. Tente outra opção."; fb.style.color = "var(--bad)"; }
        var placar = document.getElementById("placar");
        if (placar) placar.textContent = document.querySelectorAll(".mc label.ok").length + " de " + document.querySelectorAll(".mc").length;
      });
    });
  });
})();
