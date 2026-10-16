/* =========================================================
   Guia Ubuntu — terminal simulado
   Uma máquina fictícia ("notebook", usuária "ana") que roda
   no navegador. Imita o Ubuntu 26.04 em pt-BR, inclusive as
   mensagens de erro reais (algumas em inglês, como no sistema).
   Nada aqui toca no seu computador.
   ========================================================= */
(function (global) {
  "use strict";

  var USER = "ana", HOST = "notebook", HOME = "/home/ana";
  var GROUPS = ["ana", "adm", "cdrom", "sudo", "dip", "plugdev", "users", "lpadmin"];
  var NOW = new Date(2026, 9, 15, 10, 30, 0);
  var MESES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MESES_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  var DIAS_PT = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
  // Marcadores de cor na saída: \u0001 + letra + texto + \u0002
  var C0 = "\u0001", C1 = "\u0002";
  function cor(letra, txt) { return C0 + letra + txt + C1; }
  function semCor(s) { return s.replace(/\u0001./g, "").replace(/\u0002/g, ""); }

  /* ---------------- Sistema de arquivos ---------------- */
  function d(dono, modo, mt) { return { t: "d", c: {}, m: modo, o: dono, g: dono, mt: mt || NOW }; }
  function f(dono, modo, dados, mt, tam) { return { t: "f", d: dados || "", m: modo, o: dono, g: dono, mt: mt || NOW, sz: tam }; }
  function dt(dia, h, min, mes, ano) { return new Date(ano || 2026, mes == null ? 9 : mes, dia, h, min); }

  var NOTAS = "Comprar café\nLigar para o João\nEstudar Ubuntu\nFazer backup das fotos\n";
  var FRUTAS = "banana\nmaçã\nlaranja\nbanana\nuva\nmaçã\nbanana\n";
  var ACESSO = [
    "192.168.0.10 - - [15/Oct/2026:09:01:12] \"GET / HTTP/1.1\" 200",
    "192.168.0.23 - - [15/Oct/2026:09:01:40] \"GET /contato HTTP/1.1\" 200",
    "192.168.0.10 - - [15/Oct/2026:09:02:03] \"GET /admin HTTP/1.1\" 403",
    "192.168.0.57 - - [15/Oct/2026:09:05:19] \"GET /fotos HTTP/1.1\" 404",
    "192.168.0.10 - - [15/Oct/2026:09:06:44] \"POST /login HTTP/1.1\" 200",
    "192.168.0.23 - - [15/Oct/2026:09:07:02] \"GET / HTTP/1.1\" 200"
  ].join("\n") + "\n";
  var BASHRC = "# ~/.bashrc: executado pelo bash(1) para shells interativos.\n\nHISTSIZE=1000\nHISTFILESIZE=2000\n\nalias ll='ls -alF'\nalias la='ls -A'\nalias l='ls -CF'\n";

  function criarFS() {
    var raiz = d("root", 493);
    function por(caminho, no) {
      var partes = caminho.split("/").filter(Boolean), atual = raiz;
      for (var i = 0; i < partes.length - 1; i++) atual = atual.c[partes[i]];
      atual.c[partes[partes.length - 1]] = no;
      return no;
    }
    ["bin", "boot", "dev", "etc", "home", "media", "mnt", "opt", "proc", "srv", "usr", "var", "snap"].forEach(function (n) { por("/" + n, d("root", 493, dt(1, 8, 0, 3))); });
    por("/root", d("root", 448, dt(26, 9, 0, 2)));
    por("/tmp", d("root", 1023));
    por("/usr/bin", d("root", 493, dt(26, 9, 0, 2)));
    ["bash", "cat", "cp", "find", "grep", "ls", "mkdir", "mv", "rm", "touch", "nano", "python3"].forEach(function (n) {
      por("/usr/bin/" + n, f("root", 493, "", dt(13, 4, 0, 1), 150000));
    });
    por("/usr/share", d("root", 493));
    por("/var/log", d("root", 509));
    var sl = por("/var/log/syslog", f("syslog", 416, "Oct 15 08:00:01 notebook systemd[1]: Started cron.service.\n")); sl.g = "adm";
    por("/etc/hostname", f("root", 420, "notebook\n", dt(26, 9, 0, 2)));
    por("/etc/hosts", f("root", 420, "127.0.0.1\tlocalhost\n127.0.1.1\tnotebook\n", dt(26, 9, 0, 2)));
    por("/etc/os-release", f("root", 420, "PRETTY_NAME=\"Ubuntu 26.04.1 LTS\"\nNAME=\"Ubuntu\"\nVERSION_ID=\"26.04\"\nVERSION=\"26.04.1 LTS (Resolute Raccoon)\"\nVERSION_CODENAME=resolute\nID=ubuntu\nID_LIKE=debian\n", dt(26, 9, 0, 2)));
    por("/etc/passwd", f("root", 420, "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nana:x:1000:1000:Ana:/home/ana:/bin/bash\n", dt(26, 9, 0, 2)));
    var sh = por("/etc/shadow", f("root", 416, "root:*:20500:0:99999:7:::\nana:$y$j9T$...:20500:0:99999:7:::\n", dt(26, 9, 0, 2))); sh.g = "shadow";
    por("/etc/apt", d("root", 493, dt(26, 9, 0, 2)));
    por("/etc/apt/sources.list.d", d("root", 493, dt(26, 9, 0, 2)));
    por("/etc/apt/sources.list.d/ubuntu.sources", f("root", 420, "Types: deb\nURIs: http://br.archive.ubuntu.com/ubuntu/\nSuites: resolute resolute-updates\nComponents: main restricted universe multiverse\n", dt(26, 9, 0, 2)));
    por("/home", d("root", 493, dt(26, 9, 0, 2)));
    var h = por("/home/ana", d(USER, 488, dt(15, 8, 47)));
    ["Área de trabalho", "Documentos", "Downloads", "Imagens", "Modelos", "Música", "Público", "Vídeos"].forEach(function (n) {
      h.c[n] = d(USER, 493, dt(12, 8, 3));
    });
    h.c[".bashrc"] = f(USER, 420, BASHRC, dt(26, 9, 0, 2));
    h.c[".profile"] = f(USER, 420, "# ~/.profile\n", dt(26, 9, 0, 2));
    h.c[".bash_history"] = f(USER, 384, "", dt(15, 8, 40));
    h.c["frutas.txt"] = f(USER, 436, FRUTAS, dt(14, 16, 5));
    h.c["Documentos"].c["notas.txt"] = f(USER, 436, NOTAS, dt(14, 17, 40));
    h.c["Documentos"].c["relatorio.odt"] = f(USER, 436, "", dt(14, 17, 40), 8394);
    h.c["Documentos"].c["acesso.log"] = f(USER, 436, ACESSO, dt(15, 9, 7));
    h.c["Documentos"].c["projetos"] = d(USER, 509, dt(12, 8, 3));
    h.c["Documentos"].c["projetos"].c["site"] = d(USER, 509, dt(12, 8, 3));
    h.c["Documentos"].c["projetos"].c["site"].c["index.html"] = f(USER, 436, "<h1>Olá</h1>\n", dt(12, 8, 3));
    h.c["Documentos"].c["projetos"].c["site"].c["style.css"] = f(USER, 436, "h1 { color: orange; }\n", dt(12, 8, 3));
    h.c["Documentos"].c["projetos"].c["backup.sh"] = f(USER, 509, "#!/usr/bin/env bash\necho \"Fazendo backup...\"\n", dt(15, 9, 15));
    h.c["Downloads"].c["ubuntu-26.04-desktop-amd64.iso"] = f(USER, 436, "", dt(10, 21, 14), 6333579264);
    h.c["Downloads"].c["manual.pdf"] = f(USER, 436, "", dt(13, 11, 2), 2411520);
    h.c["Downloads"].c["foto.jpg"] = f(USER, 436, "", dt(15, 8, 47), 49152);
    h.c["Downloads"].c["musica.mp3"] = f(USER, 436, "", dt(9, 20, 10), 5242880);
    h.c["Downloads"].c["fotos-viagem.zip"] = f(USER, 436, "", dt(1, 19, 30), 104857600);
    h.c["Imagens"].c["ferias.jpg"] = f(USER, 436, "", dt(2, 14, 0, 7), 2097152);
    h.c["Imagens"].c["perfil.png"] = f(USER, 436, "", dt(20, 10, 0, 8), 102400);
    return raiz;
  }

  /* ---------------- Processos fictícios ---------------- */
  function criarProcessos() {
    return [
      { pid: 1, pp: 0, u: "root", tty: "?", cmd: "/sbin/init splash", comm: "systemd", cpu: 0.0, mem: 0.1 },
      { pid: 812, pp: 1, u: "root", tty: "?", cmd: "/usr/sbin/NetworkManager --no-daemon", comm: "NetworkManager", cpu: 0.0, mem: 0.2 },
      { pid: 1534, pp: 1, u: USER, tty: "?", cmd: "/usr/bin/gnome-shell", comm: "gnome-shell", cpu: 3.1, mem: 4.2 },
      { pid: 2210, pp: 1534, u: USER, tty: "?", cmd: "/snap/chromium/3554/usr/lib/chromium-browser/chrome --password-store", comm: "chrome", cpu: 5.4, mem: 6.8 },
      { pid: 2251, pp: 2210, u: USER, tty: "?", cmd: "/snap/chromium/3554/usr/lib/chromium-browser/chrome --type=renderer", comm: "chrome", cpu: 2.0, mem: 3.9 },
      { pid: 2304, pp: 1534, u: USER, tty: "?", cmd: "/usr/bin/nautilus --gapplication-service", comm: "nautilus", cpu: 0.1, mem: 1.5 },
      { pid: 2388, pp: 1534, u: USER, tty: "?", cmd: "/usr/bin/gnome-text-editor", comm: "gnome-text-edit", cpu: 0.0, mem: 1.1 },
      { pid: 2950, pp: 1534, u: USER, tty: "?", cmd: "/usr/bin/ptyxis --gapplication-service", comm: "ptyxis", cpu: 0.3, mem: 0.9 },
      { pid: 3001, pp: 2950, u: USER, tty: "pts/0", cmd: "bash", comm: "bash", cpu: 0.0, mem: 0.1 }
    ];
  }

  /* ---------------- Utilidades ---------------- */
  function pad(s, n, dir) { s = String(s); while (s.length < n) s = dir ? s + " " : " " + s; return s; }
  function dois(n) { return (n < 10 ? "0" : "") + n; }
  function humano(b) {
    if (b < 1024) return String(b);
    var u = ["K", "M", "G", "T"], i = -1, v = b;
    do { v /= 1024; i++; } while (v >= 1024 && i < u.length - 1);
    if (v < 10) { var r = Math.ceil(v * 10) / 10; if (r < 10) return r.toFixed(1).replace(".", ",") + u[i]; return "10" + u[i]; }
    return Math.ceil(v) + u[i];
  }
  function dataLs(mt) {
    var seisMeses = 182 * 24 * 3600 * 1000;
    var s = MESES[mt.getMonth()] + " " + pad(mt.getDate(), 2) + " ";
    return s + (Math.abs(NOW - mt) < seisMeses ? dois(mt.getHours()) + ":" + dois(mt.getMinutes()) : " " + mt.getFullYear());
  }
  function permStr(no) {
    var r = no.t === "d" ? "d" : "-", m = no.m, l = "rwxrwxrwx";
    for (var i = 0; i < 9; i++) r += (m & (256 >> i)) ? l[i] : "-";
    if (m & 512) r = r.slice(0, 9) + (m & 1 ? "t" : "T");
    return r;
  }
  function tamanho(no) { return no.t === "d" ? 4096 : (no.sz != null ? no.sz : utf8len(no.d)); }
  function utf8len(s) { var n = 0; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); n += c < 128 ? 1 : c < 2048 ? 2 : (c >= 0xd800 && c < 0xdc00) ? (i++, 4) : 3; } return n; }
  function cmpBytes(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
  // Ordem do bash em pt_BR (curingas): ignora pontuação, minúscula antes de maiúscula
  var COLL_PT = typeof Intl !== "undefined" ? new Intl.Collator("pt-BR", { ignorePunctuation: true, caseFirst: "lower" }) : { compare: cmpBytes };
  function precisaAspas(n) { return /[\s'"$`\\!*?&;|<>(){}\[\]#~]/.test(n); }
  function aspas(n) { return n.indexOf("'") === -1 ? "'" + n + "'" : '"' + n + '"'; }
  function base(p) { var s = p.replace(/\/+$/, ""); return s.slice(s.lastIndexOf("/") + 1) || "/"; }

  /* =========================================================
     Shell
     ========================================================= */
  function Shell() { this.reset(); }

  Shell.prototype.reset = function () {
    this.fs = criarFS();
    this.procs = criarProcessos();
    this.user = USER;
    this.cwd = HOME;
    this.oldpwd = null;
    this.vars = { HOME: HOME, USER: USER, LOGNAME: USER, SHELL: "/bin/bash", HOSTNAME: HOST, LANG: "pt_BR.UTF-8", PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin", EDITOR: "nano" };
    this.status = 0;
    this.hist = [];
    this.sudoOk = false;
    this.pilha = [];
    this.proxPid = 3100;
    this.aliases = { ll: "ls -alF", la: "ls -A", l: "ls -CF", ls: "ls --color=auto", grep: "grep --color=auto" };
    this.funcoes = {};
    this.posicionais = [];
  };

  Shell.prototype.prompt = function () {
    var p = this.cwd, home = this.user === "root" ? "/root" : HOME;
    if (p === home) p = "~"; else if (p.indexOf(home + "/") === 0) p = "~" + p.slice(home.length);
    return { user: this.user, host: HOST, path: p, sym: this.user === "root" ? "#" : "$" };
  };

  /* ---------- caminhos ---------- */
  Shell.prototype.abs = function (p) {
    if (p === "") return this.cwd;
    var partes = (p[0] === "/" ? p : this.cwd + "/" + p).split("/"), out = [];
    partes.forEach(function (x) { if (!x || x === ".") return; if (x === "..") out.pop(); else out.push(x); });
    return "/" + out.join("/");
  };
  Shell.prototype.pode = function (no, bit) { // bit: 4 r, 2 w, 1 x
    if (this.user === "root") return true;
    if (no.o === this.user) return !!(no.m & (bit << 6));
    if (GROUPS.indexOf(no.g) !== -1) return !!(no.m & (bit << 3));
    return !!(no.m & bit);
  };
  // Retorna {no, pai, nome, err}  err: ENOENT | ENOTDIR | EACCES
  Shell.prototype.achar = function (p) {
    var a = this.abs(p), partes = a.split("/").filter(Boolean), no = this.fs, pai = null;
    for (var i = 0; i < partes.length; i++) {
      if (no.t !== "d") return { err: "ENOTDIR", abs: a };
      if (!this.pode(no, 1)) return { err: "EACCES", abs: a };
      pai = no;
      no = no.c[partes[i]];
      if (!no) return { err: "ENOENT", pai: i === partes.length - 1 ? pai : null, nome: partes[i], abs: a };
    }
    return { no: no, pai: pai, nome: partes[partes.length - 1] || "/", abs: a };
  };
  Shell.prototype.vazio = function (no) { return Object.keys(no.c).length === 0; };

  /* ---------- expansão ---------- */
  function expandirChaves(s) {
    var i = -1, prof = 0, j = -1, ini = -1;
    for (var k = 0; k < s.length; k++) {
      if (s[k] === "{") { if (prof === 0) ini = k; prof++; }
      else if (s[k] === "}" && prof > 0) {
        prof--;
        if (prof === 0) {
          var dentro = s.slice(ini + 1, k), alts = dividirTopo(dentro), seq = dentro.match(/^(-?\d+)\.\.(-?\d+)$/), letras = dentro.match(/^([a-zA-Z])\.\.([a-zA-Z])$/);
          if (alts.length > 1 || seq || letras) { i = ini; j = k; break; }
        }
      }
    }
    if (i < 0) return [s];
    var pre = s.slice(0, i), pos = s.slice(j + 1), meio = s.slice(i + 1, j), lista;
    var m = meio.match(/^(-?\d+)\.\.(-?\d+)$/), ml = meio.match(/^([a-zA-Z])\.\.([a-zA-Z])$/);
    if (m) {
      var a = parseInt(m[1], 10), b = parseInt(m[2], 10), larg = (/^-?0\d/.test(m[1]) || /^-?0\d/.test(m[2])) ? Math.max(m[1].length, m[2].length) : 0;
      lista = [];
      for (var n = a; a <= b ? n <= b : n >= b; n += a <= b ? 1 : -1) { var t = String(Math.abs(n)); while (t.length < larg - (n < 0 ? 1 : 0)) t = "0" + t; lista.push((n < 0 ? "-" : "") + t); }
    } else if (ml) {
      var x = ml[1].charCodeAt(0), y = ml[2].charCodeAt(0); lista = [];
      for (var c = x; x <= y ? c <= y : c >= y; c += x <= y ? 1 : -1) lista.push(String.fromCharCode(c));
    } else lista = dividirTopo(meio);
    var res = [];
    lista.forEach(function (alt) { expandirChaves(pre + alt + pos).forEach(function (r) { res.push(r); }); });
    return res;
  }
  function dividirTopo(s) {
    var out = [], prof = 0, atual = "";
    for (var k = 0; k < s.length; k++) {
      var ch = s[k];
      if (ch === "{") prof++; else if (ch === "}") prof--;
      if (ch === "," && prof === 0) { out.push(atual); atual = ""; } else atual += ch;
    }
    out.push(atual);
    return out;
  }
  function globRegex(seg) {
    var r = "^", i = 0;
    while (i < seg.length) {
      var ch = seg[i];
      if (ch === "*") r += "[^/]*";
      else if (ch === "?") r += "[^/]";
      else if (ch === "[") {
        var fim = seg.indexOf("]", i + 2);
        if (fim < 0) { r += "\\["; }
        else { var cls = seg.slice(i + 1, fim); if (cls[0] === "!") cls = "^" + cls.slice(1); r += "[" + cls.replace(/\\/g, "\\\\") + "]"; i = fim; }
      } else r += ch.replace(/[.+^${}()|\\\/]/g, "\\$&");
      i++;
    }
    return new RegExp(r + "$");
  }
  Shell.prototype.glob = function (pad_) {
    if (!/[*?\[]/.test(pad_)) return null;
    var absoluto = pad_[0] === "/", segs = pad_.split("/").filter(Boolean), self = this, barraFinal = /\/$/.test(pad_);
    var res = [];
    function anda(dirAbs, prefixo, i) {
      if (i === segs.length) {
        if (barraFinal) { var q = self.achar(dirAbs); if (q.no && q.no.t === "d") res.push(prefixo + "/"); }
        else res.push(prefixo);
        return;
      }
      var r = self.achar(dirAbs); if (!r.no || r.no.t !== "d" || !self.pode(r.no, 4)) return;
      var seg = segs[i];
      if (!/[*?\[]/.test(seg)) {
        if (seg === "." || seg === ".." || r.no.c[seg]) anda(self.abs(dirAbs + "/" + seg), prefixo + (prefixo && prefixo !== "/" ? "/" : "") + seg, i + 1);
        return;
      }
      var re = globRegex(seg);
      Object.keys(r.no.c).sort(COLL_PT.compare).forEach(function (n) {
        if (n[0] === "." && seg[0] !== ".") return;
        if (re.test(n)) anda(dirAbs + "/" + n, prefixo + (prefixo && prefixo !== "/" ? "/" : "") + n, i + 1);
      });
    }
    anda(absoluto ? "/" : this.cwd, absoluto ? "/" : "", 0);
    return res.length ? res : null;
  };

  /* ---------- tokenização ---------- */
  Shell.prototype.tokenizar = function (linha) {
    var toks = [], partes = null, i = 0, self = this;
    function fecha() { if (partes) { toks.push({ w: partes }); partes = null; } }
    function add(s, q) { if (!partes) partes = []; partes.push({ s: s, q: q }); }
    function variavel(j) { // retorna [valor, novoIndice]
      var m;
      if (linha[j + 1] === "(" && linha[j + 2] === "(") { // $(( ... ))
        var prof2 = 2, k2 = j + 3;
        while (k2 < linha.length && prof2) { if (linha[k2] === "(") prof2++; else if (linha[k2] === ")") prof2--; k2++; }
        return [self.aritmetica(linha.slice(j + 3, k2 - 2)), k2];
      }
      if (linha[j + 1] === "(") { // $(...)
        var prof = 1, k = j + 2;
        while (k < linha.length && prof) { if (linha[k] === "(") prof++; else if (linha[k] === ")") prof--; k++; }
        var dentro = linha.slice(j + 2, k - 1);
        return [self.capturar(dentro).replace(/\n+$/, ""), k];
      }
      if (linha[j + 1] === "{") { var fim = linha.indexOf("}", j); return [self.parametro(linha.slice(j + 2, fim)), fim + 1]; }
      if ((m = /^[A-Za-z_][A-Za-z0-9_]*|^[?$#0-9@*]/.exec(linha.slice(j + 1)))) return [self.valorVar(m[0]), j + 1 + m[0].length];
      return ["$", j + 1];
    }
    while (i < linha.length) {
      var ch = linha[i];
      if (ch === " " || ch === "\t") { fecha(); i++; continue; }
      if (ch === "#" && !partes) break;
      if (ch === "'") { var f2 = linha.indexOf("'", i + 1); if (f2 < 0) f2 = linha.length; add(linha.slice(i + 1, f2), 1); i = f2 + 1; continue; }
      if (ch === '"') {
        var j = i + 1, acc = "";
        while (j < linha.length && linha[j] !== '"') {
          if (linha[j] === "\\" && /["\\$`]/.test(linha[j + 1] || "")) { acc += linha[j + 1]; j += 2; continue; }
          if (linha[j] === "$") { var v = variavel(j); acc += v[0]; j = v[1]; continue; }
          acc += linha[j]; j++;
        }
        add(acc, 2); i = j + 1; continue;
      }
      if (ch === "\\") { add(linha[i + 1] || "", 1); i += 2; continue; }
      if (ch === "$") { var vv = variavel(i); add(vv[0], 0); i = vv[1]; continue; }
      var op = /^(2>&1|&>|2>>|2>|>>|>|<|\|\||&&|\||;|&)/.exec(linha.slice(i));
      if (op) { fecha(); toks.push({ op: op[0] }); i += op[0].length; continue; }
      add(ch, 0); i++;
    }
    fecha();
    return toks;
  };
  Shell.prototype.valorVar = function (n) {
    if (n === "?") return String(this.status);
    if (n === "$") return "3001";
    if (n === "#") return String(this.posicionais.length);
    if (n === "0") return "bash";
    if (/^[1-9]$/.test(n)) return this.posicionais[+n - 1] || "";
    if (n === "@" || n === "*") return this.posicionais.join(" ");
    if (n === "PWD") return this.cwd;
    if (n === "OLDPWD") return this.oldpwd || "";
    if (n === "RANDOM") return String(Math.floor(Math.random() * 32768));
    return this.vars[n] != null ? this.vars[n] : "";
  };
  // ${VAR}, ${#VAR}, ${VAR:-padrão}, ${VAR%sufixo}, ${VAR#prefixo}, ${VAR/de/para}, ${VAR:0:3}
  Shell.prototype.parametro = function (e) {
    var self = this, m;
    if ((m = /^#(\w+)$/.exec(e))) return String(Array.from(this.valorVar(m[1])).length);
    if ((m = /^(\w+|[?$#])$/.exec(e))) return this.valorVar(m[1]);
    if ((m = /^(\w+):?([-=+?])(.*)$/.exec(e))) {
      var v = this.valorVar(m[1]), vazio = e.indexOf(":") !== -1 ? !v : this.vars[m[1]] == null;
      if (m[2] === "-") return vazio ? m[3] : v;
      if (m[2] === "=") { if (vazio) this.vars[m[1]] = m[3]; return vazio ? m[3] : v; }
      if (m[2] === "+") return vazio ? "" : m[3];
      return v;
    }
    function re(glob, inicio, fim, guloso) {
      var src = glob.replace(/[.+^${}()|\\]/g, "\\$&").replace(/\*/g, guloso ? ".*" : ".*?").replace(/\?/g, ".");
      return new RegExp((inicio ? "^" : "") + "(" + src + ")" + (fim ? "$" : ""));
    }
    if ((m = /^(\w+)(##?|%%?)(.*)$/.exec(e))) {
      var val = this.valorVar(m[1]), op = m[2], pat = m[3];
      if (op[0] === "#") { var mm = re(pat, true, false, op === "##").exec(val); return mm ? val.slice(mm[0].length) : val; }
      for (var i = op === "%%" ? 0 : val.length; op === "%%" ? i <= val.length : i >= 0; i += op === "%%" ? 1 : -1) {
        if (re(pat, true, true, true).test(val.slice(i))) return val.slice(0, i);
      }
      return val;
    }
    if ((m = /^(\w+)\/(\/?)([^\/]*)\/?(.*)$/.exec(e))) {
      var v2 = this.valorVar(m[1]), de = re(m[3], false, false, true);
      return m[2] ? v2.split(new RegExp(de.source, "g")).join(m[4]) : v2.replace(de, m[4]);
    }
    if ((m = /^(\w+):(-?\d+)(?::(\d+))?$/.exec(e))) {
      var v3 = this.valorVar(m[1]), ini = +m[2]; if (ini < 0) ini = Math.max(0, v3.length + ini);
      return m[3] != null ? v3.substr(ini, +m[3]) : v3.slice(ini);
    }
    return this.valorVar(e);
  };
  Shell.prototype.aritmetica = function (expr) {
    var self = this;
    var e = expr.replace(/\$?([A-Za-z_]\w*)/g, function (x, n) { var v = self.valorVar(n); return /^-?\d+$/.test(v) ? v : "0"; });
    if (!/^[\d\s+\-*\/%()<>=!&|]*$/.test(e)) return "0";
    var z = /(\d+)\s*[\/%]\s*0(?!\d)/.exec(e);
    if (z) { this._erroAtual && this._erroAtual("bash: " + expr.trim() + ": divisão por 0 (token de erro é \"0\")\n"); this._abortar = true; return ""; }
    try {
      var r = Function('"use strict";return (' + e.replace(/(\d+)\s*\/\s*(\d+)/g, "Math.trunc($1/$2)") + ")")();
      return String(typeof r === "boolean" ? (r ? 1 : 0) : Math.trunc(r));
    } catch (er) { return "0"; }
  };

  Shell.prototype.expandirPalavra = function (w) {
    var todasSemAspas = w.every(function (p) { return p.q === 0; });
    var texto = w.map(function (p) { return p.s; }).join("");
    var home = this.vars.HOME;
    function til(s) { return s === "~" ? home : s.indexOf("~/") === 0 ? home + s.slice(1) : s; }
    if (!todasSemAspas) {
      if (w[0].q === 0 && (w[0].s === "~" || w[0].s.indexOf("~/") === 0)) texto = til(w[0].s) + w.slice(1).map(function (p) { return p.s; }).join("");
      return [texto];
    }
    var self = this, out = [];
    expandirChaves(texto).forEach(function (s) {
      s = til(s);
      var g = self.glob(s);
      if (g) g.forEach(function (x) { out.push(x); }); else out.push(s);
    });
    return out;
  };

  /* ---------- execução ---------- */
  Shell.prototype.capturar = function (linha) {
    var buf = [];
    this.executarLista(linha, { saida: function (s) { buf.push(semCor(s)); }, erro: this._erroAtual || function () {} }, false);
    return buf.join("");
  };

  // Executa uma linha digitada. Retorna lista de {tipo: 'out'|'err'|'info', texto}
  Shell.prototype.rodar = function (linha) {
    var res = [], self = this;
    if (linha.trim()) this.hist.push(linha);
    var esc = { saida: function (s) { res.push({ tipo: "out", texto: s }); }, erro: function (s) { res.push({ tipo: "err", texto: s }); } };
    this._erroAtual = esc.erro;
    try { this.executarLista(linha, esc, true); }
    catch (e) {
      if (e && e.limpar) return [{ tipo: "clear" }];
      res.push({ tipo: "err", texto: "(simulador) erro interno: " + (e && e.message) + "\n" });
      this.status = 1;
    }
    return res;
  };

  Shell.prototype.executarLista = function (linha, esc, tty) {
    var mi = /^\s*if\s+(.+?)\s*;\s*then\s+(.+?)\s*;?\s*(?:else\s+(.+?)\s*;?\s*)?fi\s*$/.exec(linha);
    if (mi) {
      this.executarLista(mi[1], { saida: esc.saida, erro: esc.erro }, tty);
      if (this.status === 0) this.executarLista(mi[2], esc, tty);
      else if (mi[3]) this.executarLista(mi[3], esc, tty);
      else this.status = 0;
      return;
    }
    var mf = /^\s*(?:function\s+)?([A-Za-z_][\w-]*)\s*\(\)\s*\{\s*(.+?)\s*;?\s*\}\s*$/.exec(linha);
    if (mf) { this.funcoes[mf[1]] = mf[2]; this.status = 0; return; }
    var m = /^\s*for\s+([A-Za-z_]\w*)\s+in\s+(.+?)\s*;\s*do\s+(.+?)\s*;?\s*done\s*$/.exec(linha);
    if (m) {
      var self = this, itens = [];
      this.tokenizar(m[2]).forEach(function (t) { if (t.w) self.expandirPalavra(t.w).forEach(function (x) { itens.push(x); }); });
      itens.forEach(function (it) { self.vars[m[1]] = it; self.executarLista(m[3], esc, tty); });
      return;
    }
    var partes = dividir(linha, false);
    for (var g = 0; g < partes.length; g++) {
      if (!partes[g].raw.trim()) continue;
      var opAnt = g ? partes[g - 1].op : null;
      if (opAnt === "&&" && this.status !== 0) continue;
      if (opAnt === "||" && this.status === 0) continue;
      var raw = partes[g].raw;
      if (partes.length > 1 && /^\s*(if|for|while|function)\s|^\s*[A-Za-z_][\w-]*\s*\(\)/.test(raw)) this.executarLista(raw, esc, tty);
      else this.executarPipeline(raw, esc, tty);
    }
  };

  // Divide a linha em partes de nível superior, respeitando aspas e $( ).
  // soPipe=false: separa por ; && || &   soPipe=true: separa só por |
  function dividir(linha, soPipe) {
    var out = [], atual = "", q = null, prof = 0, bloco = 0, palavra = "";
    var ABRE = { "if": 1, "for": 1, "while": 1, "until": 1, "case": 1, "{": 1 }, FECHA = { "fi": 1, "done": 1, "esac": 1, "}": 1 };
    function fimPalavra() { if (ABRE[palavra]) bloco++; else if (FECHA[palavra] && bloco) bloco--; palavra = ""; }
    for (var i = 0; i < linha.length; i++) {
      var ch = linha[i], dois = linha.substr(i, 2);
      if (!q && /[\s;&|]/.test(ch)) fimPalavra();
      else if (!q && ch !== "'" && ch !== '"') palavra += ch;
      if (bloco && !q && ch !== "'" && ch !== '"') { atual += ch; if (i === linha.length - 1) fimPalavra(); continue; }
      if (q) { atual += ch; if (ch === "\\" && q === '"') { atual += linha[++i] || ""; } else if (ch === q) q = null; continue; }
      if (ch === "\\") { atual += ch + (linha[i + 1] || ""); i++; continue; }
      if (ch === "'" || ch === '"') { q = ch; atual += ch; continue; }
      if (dois === "$(") { prof++; atual += dois; i++; continue; }
      if (ch === ")" && prof) { prof--; atual += ch; continue; }
      if (prof) { atual += ch; continue; }
      if (ch === "#" && (!atual || /\s$/.test(atual))) break;
      if (soPipe) {
        if (ch === "|" && dois !== "||" && linha[i - 1] !== "|") { out.push({ raw: atual }); atual = ""; continue; }
      } else {
        if (dois === "&&" || dois === "||") { out.push({ raw: atual, op: dois }); atual = ""; i++; continue; }
        if (ch === ";") { out.push({ raw: atual, op: ";" }); atual = ""; continue; }
        if (ch === "&" && linha[i - 1] !== ">" && linha[i + 1] !== ">" && linha[i - 1] !== "&") { out.push({ raw: atual, op: "&" }); atual = ""; continue; }
      }
      atual += ch;
    }
    out.push({ raw: atual });
    return out;
  }

  Shell.prototype.executarPipeline = function (raw, esc, tty) {
    var cmds = dividir(raw, true).map(function (x) { return x.raw; });
    var entrada = null, self = this;
    this._pipeline = cmds;
    for (var i = 0; i < cmds.length; i++) {
      var ultimo = i === cmds.length - 1, argv = [], redir = [];
      this._abortar = false;
      var toksCmd = this.tokenizar(cmds[i]); // expande $VAR e $? só agora
      if (this._abortar) { this.status = 1; return; }
      for (var k = 0; k < toksCmd.length; k++) {
        var t = toksCmd[k];
        if (t.op) {
          var alvo = toksCmd[k + 1];
          if (t.op === "2>&1") { redir.push({ op: t.op }); continue; }
          if (!alvo || !alvo.w) { esc.erro("bash: erro de sintaxe próximo ao token inesperado `newline'\n"); this.status = 2; return; }
          redir.push({ op: t.op, alvo: this.expandirPalavra(alvo.w)[0] }); k++;
          continue;
        }
        this.expandirPalavra(t.w).forEach(function (x) { argv.push(x); });
      }
      // atribuições VAR=valor
      while (argv.length && /^[A-Za-z_]\w*=/.test(argv[0]) && argv.length === 1) {
        var eq = argv[0].indexOf("="); this.vars[argv[0].slice(0, eq)] = argv[0].slice(eq + 1); argv.shift(); this.status = 0;
      }
      if (!argv.length) continue;

      var bufOut = [], bufErr = [], paraArquivo = null, errArquivo = null, errNoOut = false, errNull = false, outNull = false, errDestino = null;
      var falhou = false;
      redir.forEach(function (r) {
        if (falhou) return;
        if (r.op === "<") {
          var a = self.achar(r.alvo);
          if (a.err || a.no.t !== "f") { esc.erro("bash: " + r.alvo + ": Arquivo ou diretório inexistente\n"); falhou = true; return; }
          entrada = a.no.d;
        } else if (r.op === "2>&1") { errNoOut = true; errDestino = paraArquivo ? "arquivo" : outNull ? "nulo" : "tela"; }
        else if (r.op === "&>") { if (r.alvo === "/dev/null") { outNull = errNull = true; } else { paraArquivo = { p: r.alvo, ap: false }; errNoOut = true; } }
        else if (r.op === "2>" || r.op === "2>>") { if (r.alvo === "/dev/null") errNull = true; else errArquivo = { p: r.alvo, ap: r.op === "2>>" }; }
        else { if (r.alvo === "/dev/null") outNull = true; else paraArquivo = { p: r.alvo, ap: r.op === ">>" }; }
      });
      if (falhou) { this.status = 1; return; }
      [paraArquivo, errArquivo].forEach(function (pa) {
        if (!pa || falhou) return;
        var a = self.achar(pa.p);
        if (a.err === "ENOENT" && a.pai && !self.pode(a.pai, 2)) { esc.erro("bash: " + pa.p + ": Permissão negada\n"); falhou = true; return; }
        if (a.err === "ENOENT" && a.pai) { a.pai.c[a.nome] = f(self.user, self.user === "root" ? 420 : 436, ""); return; }
        if (a.err === "ENOENT") { esc.erro("bash: " + pa.p + ": Arquivo ou diretório inexistente\n"); falhou = true; return; }
        if (a.err === "EACCES" || (a.no && !self.pode(a.no, 2))) { esc.erro("bash: " + pa.p + ": Permissão negada\n"); falhou = true; return; }
        if (a.no && a.no.t === "d") { esc.erro("bash: " + pa.p + ": É um diretório\n"); falhou = true; return; }
        if (!pa.ap) a.no.d = "";
      });
      if (falhou) { this.status = 1; return; }

      var vaiParaTela = ultimo && !paraArquivo && !outNull;
      var io = {
        tty: vaiParaTela && tty,
        stdin: entrada,
        out: function (s) { if (outNull) return; if (vaiParaTela) esc.saida(s); else bufOut.push(s); },
        err: function (s) {
          if (errNull) return;
          if (errNoOut) {
            if (errDestino === "tela" && (paraArquivo || outNull)) { esc.erro(s); return; }
            if (errDestino === "nulo") return;
            io.out(s); return;
          }
          if (errArquivo) { bufErr.push(s); return; }
          esc.erro(s);
        }
      };
      this.status = this.comando(argv, io);
      if (paraArquivo) { var dest = this.achar(paraArquivo.p).no; dest.d += semCor(bufOut.join("")); dest.mt = NOW; }
      if (errArquivo) { var de = this.achar(errArquivo.p).no; de.d += bufErr.join(""); }
      entrada = ultimo ? null : semCor(bufOut.join(""));
    }
  };

  /* ---------- opções ---------- */
  // Separa opções curtas/longas dos argumentos. "--" encerra opções.
  function opcoes(argv, comValor) {
    var o = {}, args = [], fim = false;
    comValor = comValor || "";
    for (var i = 1; i < argv.length; i++) {
      var a = argv[i];
      if (fim || a === "-" || a[0] !== "-") { args.push(a); continue; }
      if (a === "--") { fim = true; continue; }
      if (a.slice(0, 2) === "--") { var eq = a.indexOf("="); if (eq > 0) o[a.slice(2, eq)] = a.slice(eq + 1); else o[a.slice(2)] = true; continue; }
      if (/^-\d+$/.test(a)) { o.num = a.slice(1); continue; }
      for (var j = 1; j < a.length; j++) {
        var c = a[j];
        if (comValor.indexOf(c) !== -1) { o[c] = a.slice(j + 1) || argv[++i]; break; }
        o[c] = true;
      }
    }
    return { o: o, a: args };
  }
  function invalida(io, cmd, o, validas) {
    for (var k in o) {
      if (k === "num") continue;
      if (validas.indexOf(k) === -1) {
        io.err(cmd + ": (simulador) a opção '" + (k.length > 1 ? "--" : "-") + k + "' não existe neste simulador. Teste no seu Ubuntu.\n");
        return true;
      }
    }
    return false;
  }

  /* =========================================================
     Comandos
     ========================================================= */
  var CMDS = {};
  var INTERATIVOS = { top: 1, htop: 1, nano: 1, vim: 1, vi: 1, less: 1, more: 1, man: 1, info: 1, tmux: 1, ssh: 1, python3: 1, watch: 1 };
  var SO_REAL = { apt: 1, "apt-get": 1, snap: 1, flatpak: 1, dpkg: 1, systemctl: 1, journalctl: 1, ping: 1, ip: 1, curl: 1, wget: 1, mount: 1, reboot: 1, shutdown: 1, ufw: 1, chown: 1, tar: 1, zip: 1, unzip: 1, ln: 1, du: 1, sed: 1, awk: 1, crontab: 1 };

  Shell.prototype.comando = function (argv, io) {
    var nome = argv[0], self = this;
    if (this.aliases[nome] && !this._dentroAlias) {
      var novos = [];
      this.tokenizar(this.aliases[nome]).forEach(function (t) { if (t.w) self.expandirPalavra(t.w).forEach(function (x) { novos.push(x); }); });
      this._dentroAlias = true;
      try { return this.comando(novos.concat(argv.slice(1)), io); } finally { this._dentroAlias = false; }
    }
    if (argv[1] === "--help" && CMDS[nome]) {
      io.out("(simulador) Para a ajuda completa, rode \"" + nome + " --help\" ou \"man " + nome + "\" no seu Ubuntu, ou veja a página deste comando no guia.\n");
      return 0;
    }
    if (this.funcoes[nome]) {
      var antes = this.posicionais; this.posicionais = argv.slice(1);
      try { this.executarLista(this.funcoes[nome], { saida: io.out, erro: io.err }, io.tty); } finally { this.posicionais = antes; }
      return this.status;
    }
    if (CMDS[nome]) return CMDS[nome].call(this, argv, io);
    if (INTERATIVOS[nome]) { io.err("(simulador) \"" + nome + "\" é um programa interativo de tela cheia e não roda aqui. Experimente no seu terminal.\n"); return 1; }
    if (SO_REAL[nome]) { io.err("(simulador) \"" + nome + "\" não está disponível nesta máquina fictícia. Pratique no seu Ubuntu ou numa VM.\n"); return 1; }
    if (nome.indexOf("/") !== -1) {
      var r = this.achar(nome);
      if (r.err) { io.err("bash: " + nome + ": Arquivo ou diretório inexistente\n"); return 127; }
      if (r.no.t === "d") { io.err("bash: " + nome + ": É um diretório\n"); return 126; }
      if (!this.pode(r.no, 1)) { io.err("bash: " + nome + ": Permissão negada\n"); return 126; }
      var corpo = r.no.d.split("\n").filter(function (l) { return l && l[0] !== "#"; });
      var self = this;
      corpo.forEach(function (l) { self.executarLista(l, { saida: io.out, erro: io.err }, io.tty); });
      return this.status;
    }
    io.err(nome + ": comando não encontrado\n");
    return 127;
  };

  /* ---------- navegação ---------- */
  CMDS.pwd = function (argv, io) { io.out(this.cwd + "\n"); return 0; };

  CMDS.cd = function (argv, io) {
    var args = argv.slice(1).filter(function (a) { return a !== "-P" && a !== "-L"; });
    if (args.length > 1) { io.err("bash: cd: número excessivo de argumentos\n"); return 1; }
    var alvo = args[0];
    if (alvo === undefined || alvo === "~") alvo = this.vars.HOME;
    if (alvo === "-") {
      if (!this.oldpwd) { io.err("bash: cd: OLDPWD não definida\n"); return 1; }
      alvo = this.oldpwd; io.out(alvo + "\n");
    }
    var r = this.achar(alvo);
    if (r.err === "ENOENT") { io.err("bash: cd: " + alvo + ": Arquivo ou diretório inexistente\n"); return 1; }
    if (r.err === "ENOTDIR" || (r.no && r.no.t !== "d")) { io.err("bash: cd: " + alvo + ": Não é um diretório\n"); return 1; }
    if (r.err === "EACCES" || !this.pode(r.no, 1)) { io.err("bash: cd: " + alvo + ": Permissão negada\n"); return 1; }
    this.oldpwd = this.cwd;
    this.cwd = r.abs;
    return 0;
  };

  CMDS.pushd = function (argv, io) {
    var antes = this.cwd, st = CMDS.cd.call(this, ["cd", argv[1]], io);
    if (st === 0) { this.pilha.unshift(antes); io.out([this.cwd].concat(this.pilha).map(this.curto.bind(this)).join(" ") + "\n"); }
    return st;
  };
  CMDS.popd = function (argv, io) {
    if (!this.pilha.length) { io.err("bash: popd: pilha de diretórios vazia\n"); return 1; }
    this.oldpwd = this.cwd; this.cwd = this.pilha.shift();
    io.out([this.cwd].concat(this.pilha).map(this.curto.bind(this)).join(" ") + "\n");
    return 0;
  };
  Shell.prototype.curto = function (p) { return p === HOME ? "~" : p.indexOf(HOME + "/") === 0 ? "~" + p.slice(HOME.length) : p; };

  /* ---------- ls ---------- */
  CMDS.ls = function (argv, io) {
    var p = opcoes(argv), o = p.o, self = this;
    if (o.num === "1") { o["1"] = true; delete o.num; }
    if (o.all) o.a = true; if (o["almost-all"]) o.A = true; if (o["human-readable"]) o.h = true; if (o.recursive) o.R = true;
    if (o.directory) o.d = true; if (o.classify) o.F = true; if (o.reverse) o.r = true;
    delete o.all; delete o["almost-all"]; delete o["human-readable"]; delete o.recursive; delete o.directory; delete o.classify; delete o.reverse; delete o.color; delete o["group-directories-first"];
    if (invalida(io, "ls", o, ["l", "a", "A", "h", "t", "S", "r", "R", "d", "1", "F", "C", "X", "i"])) return 2;
    var alvos = p.a.length ? p.a : ["."], st = 0, arquivos = [], pastas = [];
    alvos.forEach(function (a) {
      var r = self.achar(a);
      if (r.err === "EACCES" && !r.no) { io.err("ls: não é possível acessar '" + a + "': Permissão negada\n"); st = 2; return; }
      if (r.err) { io.err("ls: não é possível acessar '" + a + "': Arquivo ou diretório inexistente\n"); st = 2; return; }
      if (r.no.t === "d" && !o.d) pastas.push({ rot: a, no: r.no, abs: r.abs }); else arquivos.push({ nome: a, no: r.no });
    });
    var multi = alvos.length > 1 || o.R, saida = [];
    function ordenar(lista) {
      lista.sort(function (x, y) { return cmpBytes(x.nome, y.nome); });
      if (o.t) lista.sort(function (x, y) { return y.no.mt - x.no.mt || cmpBytes(x.nome, y.nome); });
      if (o.S) lista.sort(function (x, y) { return tamanho(y.no) - tamanho(x.no) || cmpBytes(x.nome, y.nome); });
      if (o.X) lista.sort(function (x, y) { var ex = x.nome.indexOf(".") > 0 ? x.nome.slice(x.nome.lastIndexOf(".")) : "", ey = y.nome.indexOf(".") > 0 ? y.nome.slice(y.nome.lastIndexOf(".")) : ""; return cmpBytes(ex, ey) || cmpBytes(x.nome, y.nome); });
      if (o.r) lista.reverse();
      return lista;
    }
    function nomeFmt(it, alinhar) {
      var n = it.nome, q = io.tty && precisaAspas(n), txt = q ? aspas(n) : n, c = null;
      if (it.no.t === "d") c = "d";
      else if (it.no.m & 73) c = "x";
      else if (/\.(zip|gz|tgz|xz|bz2|tar|7z|deb|iso)$/i.test(n)) c = "z";
      else if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(n)) c = "m";
      else if (/\.(mp3|ogg|wav|flac)$/i.test(n)) c = "a";
      if (o.F) txt += it.no.t === "d" ? "/" : (it.no.m & 73 ? "*" : "");
      var vis = (alinhar && !q ? " " : "") + txt;
      return { txt: io.tty && c ? (alinhar && !q ? " " : "") + cor(c, q ? aspas(n) : n) + (o.F ? (it.no.t === "d" ? "/" : (it.no.m & 73 ? "*" : "")) : "") : vis, len: vis.length };
    }
    function longo(lista) {
      var alinhar = io.tty && lista.some(function (it) { return precisaAspas(it.nome); });
      var cols = lista.map(function (it) {
        var no = it.no, links = no.t === "d" ? 2 + Object.keys(no.c).filter(function (k) { return no.c[k].t === "d"; }).length : 1;
        var tam = tamanho(no);
        return [(o.i ? (100000 + tam % 90000) + " " : "") + permStr(no), String(links), no.o, no.g, o.h ? humano(tam) : String(tam), dataLs(no.mt), nomeFmt(it, alinhar).txt];
      });
      var w = [0, 0, 0, 0, 0];
      cols.forEach(function (c) { for (var k = 1; k < 5; k++) w[k] = Math.max(w[k], c[k].length); });
      return cols.map(function (c) { return c[0] + " " + pad(c[1], w[1]) + " " + pad(c[2], w[2], 1) + " " + pad(c[3], w[3], 1) + " " + pad(c[4], w[4]) + " " + c[5] + " " + c[6]; });
    }
    function colunas(lista) {
      if (!lista.length) return [];
      if (!io.tty || o["1"]) return lista.map(function (it) { return nomeFmt(it, false).txt; });
      var alinhar = lista.some(function (it) { return precisaAspas(it.nome); });
      var fmt = lista.map(function (it) { return nomeFmt(it, alinhar); }), n = fmt.length, largura = 80;
      for (var nc = n; nc >= 1; nc--) {
        var linhas = Math.ceil(n / nc), larg = [], total = 0;
        if (Math.ceil(n / linhas) < nc) continue;
        for (var c = 0; c < nc; c++) {
          var m = 0;
          for (var l = 0; l < linhas; l++) { var idx = c * linhas + l; if (idx < n) m = Math.max(m, fmt[idx].len); }
          larg.push(m); total += m + (c < nc - 1 ? 2 : 0);
        }
        if (total <= largura || nc === 1) {
          var out = [];
          for (var l2 = 0; l2 < linhas; l2++) {
            var s = "";
            for (var c2 = 0; c2 < nc; c2++) {
              var i2 = c2 * linhas + l2; if (i2 >= n) continue;
              var ult = c2 === nc - 1 || (c2 + 1) * linhas + l2 >= n;
              s += fmt[i2].txt + (ult ? "" : new Array(larg[c2] - fmt[i2].len + 3).join(" "));
            }
            out.push(s);
          }
          return out;
        }
      }
    }
    function blocos(lista) { var t = 0; lista.forEach(function (it) { t += Math.ceil(tamanho(it.no) / 4096) * 4; }); return o.h ? humano(t * 1024) : String(t); }
    function listarPasta(pasta, mostrarCab) {
      if (!self.pode(pasta.no, 4)) { io.err("ls: não é possível abrir o diretório '" + pasta.rot + "': Permissão negada\n"); st = 2; return; }
      var itens = Object.keys(pasta.no.c).filter(function (n) { return o.a || o.A || n[0] !== "."; }).map(function (n) { return { nome: n, no: pasta.no.c[n] }; });
      if (o.a) { itens.push({ nome: ".", no: pasta.no }); var pai = self.achar(pasta.abs + "/..").no; itens.push({ nome: "..", no: pai }); }
      itens = ordenar(itens);
      if (mostrarCab) saida.push(pasta.rot + ":");
      if (o.l) { saida.push("total " + blocos(itens)); saida = saida.concat(longo(itens)); }
      else saida = saida.concat(colunas(itens));
      if (o.R) itens.forEach(function (it) {
        if (it.no.t === "d" && it.nome !== "." && it.nome !== "..") {
          saida.push("");
          listarPasta({ rot: (pasta.rot === "/" ? "" : pasta.rot.replace(/\/$/, "")) + "/" + it.nome, no: it.no, abs: pasta.abs + "/" + it.nome }, true);
        }
      });
    }
    arquivos = ordenar(arquivos);
    if (arquivos.length) saida = saida.concat(o.l ? longo(arquivos) : colunas(arquivos));
    pastas.sort(function (x, y) { return cmpBytes(x.rot, y.rot); });
    pastas.forEach(function (pa, k) { if (saida.length) saida.push(""); listarPasta(pa, multi); });
    if (saida.length) io.out(saida.join("\n") + "\n");
    return st;
  };

  CMDS.tree = function (argv, io) {
    var p = opcoes(argv, "L"), o = p.o, self = this, nd = 0, nf = 0, linhas = [];
    var alvo = p.a[0] || ".", r = this.achar(alvo);
    if (r.err || r.no.t !== "d") { io.out(alvo + "  [error opening dir]\n\n0 directories, 0 files\n"); return 2; }
    var max = o.L ? parseInt(o.L, 10) : 99;
    function anda(no, prefixo, nivel) {
      if (nivel > max) return;
      var nomes = Object.keys(no.c).filter(function (n) { return o.a || n[0] !== "."; }).filter(function (n) { return !o.d || no.c[n].t === "d"; }).sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
      nomes.forEach(function (n, i) {
        var ult = i === nomes.length - 1, filho = no.c[n];
        var nomeTxt = io.tty && filho.t === "d" ? cor("d", n) : (io.tty && filho.m & 73 && filho.t === "f" ? cor("x", n) : n);
        linhas.push(prefixo + (ult ? "└── " : "├── ") + nomeTxt);
        if (filho.t === "d") { nd++; anda(filho, prefixo + (ult ? "    " : "│   "), nivel + 1); } else nf++;
      });
    }
    linhas.push(io.tty ? cor("d", alvo) : alvo);
    anda(r.no, "", 1);
    io.out(linhas.join("\n") + "\n\n" + nd + (nd === 1 ? " directory" : " directories") + (o.d ? "" : ", " + nf + (nf === 1 ? " file" : " files")) + "\n");
    return 0;
  };

  /* ---------- criar / remover / copiar / mover ---------- */
  CMDS.mkdir = function (argv, io) {
    var p = opcoes(argv), o = p.o, self = this, st = 0;
    if (o.parents) o.p = true; if (o.verbose) o.v = true; delete o.parents; delete o.verbose;
    if (invalida(io, "mkdir", o, ["p", "v"])) return 1;
    if (!p.a.length) { io.err("erro: os seguintes argumentos obrigatórios não foram fornecidos:\n  <dirs>...\n\nUsage: mkdir [OPÇÃO]... DIRETÓRIO...\n\nPara obter mais informações, use '--help'.\n"); return 1; }
    p.a.forEach(function (a) {
      var r = self.achar(a);
      if (r.no) { if (!(o.p && r.no.t === "d")) { io.err("mkdir: " + a + ": Arquivo existe\n"); st = 1; } return; }
      if (r.err === "ENOENT" && r.pai) {
        if (!self.pode(r.pai, 2)) { io.err("mkdir: Permission denied\n"); st = 1; return; }
        r.pai.c[r.nome] = d(self.user, self.user === "root" ? 493 : 509); r.pai.mt = NOW;
        if (o.v) io.out("mkdir: criou o diretório '" + a + "'\n");
        return;
      }
      if (r.err === "EACCES") { io.err("mkdir: Permission denied\n"); st = 1; return; }
      if (!o.p) { io.err("mkdir: No such file or directory\n"); st = 1; return; }
      var partes = a.split("/"), acc = a[0] === "/" ? "" : null;
      for (var i = 0; i < partes.length; i++) {
        if (!partes[i]) continue;
        acc = acc === null ? partes[i] : acc + "/" + partes[i];
        var q = self.achar(acc);
        if (q.no) { if (q.no.t !== "d") { io.err("mkdir: " + acc + ": Not a directory\n"); st = 1; return; } continue; }
        if (!q.pai || !self.pode(q.pai, 2)) { io.err("mkdir: Permission denied\n"); st = 1; return; }
        q.pai.c[q.nome] = d(self.user, self.user === "root" ? 493 : 509);
        if (o.v) io.out("mkdir: criou o diretório '" + acc + "'\n");
      }
    });
    return st;
  };

  CMDS.touch = function (argv, io) {
    var p = opcoes(argv, "dtr"), self = this, st = 0, quando = NOW;
    if (p.o.date) { p.o.d = p.o.date; delete p.o.date; }
    if (p.o["no-create"]) { p.o.c = true; delete p.o["no-create"]; }
    if (invalida(io, "touch", p.o, ["d", "t", "c", "r"])) return 1;
    if (p.o.d) {
      var m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/.exec(p.o.d.trim());
      if (m) quando = new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
      else if (/^yesterday|ontem$/i.test(p.o.d)) quando = new Date(NOW - 864e5);
      else { io.err("touch: data inválida '" + p.o.d + "'\n"); return 1; }
    }
    if (p.o.t) {
      var t = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(p.o.t);
      if (!t) { io.err("touch: formato de data inválido '" + p.o.t + "'\n"); return 1; }
      quando = new Date(+t[1], +t[2] - 1, +t[3], +t[4], +t[5]);
    }
    if (p.o.r) { var ref = self.achar(p.o.r); if (ref.err) { io.err("touch: falha ao obter atributos de '" + p.o.r + "': Arquivo ou diretório inexistente\n"); return 1; } quando = ref.no.mt; }
    if (!p.a.length) { io.err("touch: operando de arquivo ausente\nDigite ‘touch --help’ para obter mais informações.\n"); return 1; }
    p.a.forEach(function (a) {
      var r = self.achar(a);
      if (r.no) { r.no.mt = quando; return; }
      if (p.o.c) return;
      if (r.err === "ENOENT" && r.pai) {
        if (!self.pode(r.pai, 2)) { io.err("touch: não é possível executor o touch em '" + a + "': Permission denied\n"); st = 1; return; }
        r.pai.c[r.nome] = f(self.user, self.user === "root" ? 420 : 436, "", quando); r.pai.mt = NOW; return;
      }
      io.err("touch: não é possível executor o touch em '" + a + "': " + (r.err === "EACCES" ? "Permission denied" : "No such file or directory") + "\n"); st = 1;
    });
    return st;
  };

  CMDS.rmdir = function (argv, io) {
    var p = opcoes(argv), self = this, st = 0;
    if (p.o.verbose) p.o.v = true; delete p.o.verbose;
    if (invalida(io, "rmdir", p.o, ["v"])) return 1;
    if (!p.a.length) { io.err("erro: os seguintes argumentos obrigatórios não foram fornecidos:\n  <dirs>...\n\nUsage: rmdir [OPÇÃO]... DIRETÓRIO...\n\nPara obter mais informações, use '--help'.\n"); return 1; }
    p.a.forEach(function (a) {
      var r = self.achar(a), msg = null;
      if (r.err) msg = "No such file or directory";
      else if (r.no.t !== "d") msg = "Not a directory";
      else if (!self.vazio(r.no)) msg = "Directory not empty";
      else if (!self.pode(r.pai, 2)) msg = "Permission denied";
      if (msg) { io.err("rmdir: falha ao remover '" + a + "': " + msg + "\n"); st = 1; return; }
      if (p.o.v) io.out("rmdir: removendo diretório, '" + a + "'\n");
      delete r.pai.c[r.nome];
    });
    return st;
  };

  CMDS.rm = function (argv, io) {
    var p = opcoes(argv), o = p.o, self = this, st = 0;
    if (o.recursive) o.r = true; if (o.force) o.f = true; if (o.verbose) o.v = true; if (o.R) o.r = true;
    delete o.recursive; delete o.force; delete o.verbose; delete o.R;
    if (o.i || o.I) { io.err("rm: (simulador) -i pede confirmação a cada arquivo e não funciona aqui. No Ubuntu real ele pergunta: rm: remover arquivo comum vazio 'x'?\n"); return 1; }
    if (invalida(io, "rm", o, ["r", "f", "v", "d"])) return 1;
    if (!p.a.length) { if (o.f) return 0; io.err("rm: falta operando\nTente \"rm --help\" para mais informações.\n"); return 1; }
    p.a.forEach(function (a) {
      var r = self.achar(a);
      if (r.abs === "/" ) { io.err("rm: (simulador) bloqueado: apagar \"/\" destruiria o sistema inteiro.\n"); st = 1; return; }
      if (r.err) { if (!o.f) { io.err("rm: não foi possível remover '" + a + "': Arquivo ou diretório inexistente\n"); st = 1; } return; }
      if (r.no.t === "d" && !o.r && !(o.d && self.vazio(r.no))) { io.err("rm: não foi possível remover '" + a + "': É um diretório\n"); st = 1; return; }
      if (!self.pode(r.pai, 2)) { io.err("rm: não foi possível remover '" + a + "': Permissão negada\n"); st = 1; return; }
      (function apaga(no, rot, pai, nome) {
        if (no.t === "d") Object.keys(no.c).sort(cmpBytes).forEach(function (n) { apaga(no.c[n], rot.replace(/\/$/, "") + "/" + n, no, n); });
        delete pai.c[nome];
        if (o.v) io.out(no.t === "d" ? "foi removido o diretório: '" + rot + "'\n" : "removido '" + rot + "'\n");
      })(r.no, a, r.pai, r.nome);
    });
    return st;
  };

  function clonar(no) { var n = JSON.parse(JSON.stringify(no), function (k, v) { return k === "mt" ? new Date(v) : v; }); return n; }
  function donoDe(no, u) { no.o = u; no.g = u; no.mt = NOW; if (no.t === "d") for (var k in no.c) donoDe(no.c[k], u); }

  Shell.prototype.copiarMover = function (argv, io, mover) {
    var cmd = mover ? "mv" : "cp", p = opcoes(argv), o = p.o, self = this, st = 0;
    if (o.recursive || o.R || o.a || o.archive) o.r = true; if (o.verbose) o.v = true; if (o["no-clobber"]) o.n = true;
    if (o.update === "none") { o.n = true; delete o.update; } else if (o.update) { o.u = true; delete o.update; }
    if (o.n && !mover && argv.indexOf("--update=none") === -1) io.err("cp: warning: behavior of -n is non-portable and may change in future; use --update=none instead\n");
    delete o.recursive; delete o.R; delete o.a; delete o.archive; delete o.verbose; delete o["no-clobber"];
    if (o.i) { io.err(cmd + ": (simulador) -i pede confirmação e não funciona aqui. Use -n para nunca sobrescrever.\n"); return 1; }
    if (invalida(io, cmd, o, mover ? ["v", "n", "u", "f"] : ["r", "v", "n", "u", "f", "p"])) return 1;
    if (!p.a.length) { io.err(cmd + ": falta o operando arquivo\nTente \"" + cmd + " --help\" para mais informações.\n"); return 1; }
    if (p.a.length < 2) { io.err(cmd + ": falta o operando arquivo de destino após '" + p.a[0] + "'\nTente \"" + cmd + " --help\" para mais informações.\n"); return 1; }
    var destino = p.a[p.a.length - 1], fontes = p.a.slice(0, -1), rd = this.achar(destino);
    var destinoPasta = rd.no && rd.no.t === "d";
    if (fontes.length > 1 && !destinoPasta) { io.err(cmd + ": alvo '" + destino + "': " + (rd.no ? "Não é um diretório" : "Arquivo ou diretório inexistente") + "\n"); return 1; }
    fontes.forEach(function (fo) {
      var rf = self.achar(fo);
      if (rf.err) { io.err(cmd + ": não foi possível obter estado de '" + fo + "': Arquivo ou diretório inexistente\n"); st = 1; return; }
      if (!mover && rf.no.t === "d" && !o.r) { io.err("cp: -r não especificado; omitindo o diretório '" + fo + "'\n"); st = 1; return; }
      var alvoRot = destinoPasta ? destino.replace(/\/$/, "") + "/" + base(fo) : destino;
      var ra = self.achar(alvoRot);
      if (ra.abs === rf.abs || ra.abs.indexOf(rf.abs + "/") === 0) {
        if (mover) io.err("mv: não é possível mover '" + fo + "' para um subdiretório de si mesmo, '" + alvoRot + "'\n");
        else io.err("cp: não é possível copiar um diretório, '" + fo + "', para si próprio, '" + alvoRot + "'\n");
        st = 1; return;
      }
      var paiDest = ra.no ? ra.pai : ra.pai, nomeDest = ra.nome;
      if (!paiDest) { io.err(cmd + ": não foi possível criar arquivo comum '" + alvoRot + "': Arquivo ou diretório inexistente\n"); st = 1; return; }
      if (!self.pode(paiDest, 2) || (mover && !self.pode(rf.pai, 2))) { io.err(cmd + ": não foi possível criar arquivo comum '" + alvoRot + "': Permissão negada\n"); st = 1; return; }
      if (ra.no && o.n) return;
      if (ra.no && o.u && ra.no.mt >= rf.no.mt) return;
      if (ra.no && ra.no.t === "d" && rf.no.t !== "d") { io.err(cmd + ": não é possível sobrescrever o diretório '" + alvoRot + "' por um não-diretório\n"); st = 1; return; }
      if (mover) {
        paiDest.c[nomeDest] = rf.no; delete rf.pai.c[rf.nome];
        if (o.v) io.out("renomeado '" + fo + "' -> '" + alvoRot + "'\n");
      } else {
        var copia = clonar(rf.no);
        if (!o.p) donoDe(copia, self.user);
        paiDest.c[nomeDest] = copia;
        if (o.v) (function lista(no, de, para) {
          io.out("'" + de + "' -> '" + para + "'\n");
          if (no.t === "d") Object.keys(no.c).sort(cmpBytes).forEach(function (n) { lista(no.c[n], de + "/" + n, para + "/" + n); });
        })(rf.no, fo, alvoRot);
      }
    });
    return st;
  };
  CMDS.cp = function (argv, io) { return this.copiarMover(argv, io, false); };
  CMDS.mv = function (argv, io) { return this.copiarMover(argv, io, true); };

  /* ---------- ler arquivos ---------- */
  Shell.prototype.lerArquivos = function (cmd, args, io, cb, estiloErro) {
    var self = this, st = 0;
    if (!args.length) { cb(io.stdin || "", null); return 0; }
    args.forEach(function (a) {
      if (a === "-") { cb(io.stdin || "", a); return; }
      var r = self.achar(a), msg = null;
      if (r.err === "ENOENT" || r.err === "ENOTDIR") msg = "nao";
      else if (r.err === "EACCES" || !self.pode(r.no, 4)) msg = "perm";
      else if (r.no.t === "d") msg = "dir";
      if (msg) { io.err(estiloErro(a, msg)); st = 1; return; }
      cb(r.no.d, a);
    });
    return st;
  };
  function errUu(cmd) { return function (a, m) { return cmd + ": " + a + ": " + (m === "nao" ? "No such file or directory" : m === "perm" ? "Permission denied" : "É um diretório") + "\n"; }; }
  function errAbrir(cmd) { return function (a, m) { return m === "dir" ? cmd + ": error reading '" + a + "': Is a directory\n" : cmd + ": cannot open '" + a + "' for reading: " + (m === "nao" ? "No such file or directory" : "Permission denied") + "\n"; }; }
  function errGnu(cmd) { return function (a, m) { return cmd + ": " + a + ": " + (m === "nao" ? "Arquivo ou diretório inexistente" : m === "perm" ? "Permissão negada" : "É um diretório") + "\n"; }; }

  CMDS.cat = function (argv, io) {
    var p = opcoes(argv), n = 0;
    if (invalida(io, "cat", p.o, ["n", "A", "E"])) return 1;
    return this.lerArquivos("cat", p.a, io, function (txt) {
      if (p.o.n) txt = txt.replace(/^(.*)$/gm, function (l, x, off) { return off >= txt.length && l === "" ? "" : pad(++n, 6) + "\t" + l; });
      if (p.o.E || p.o.A) txt = txt.replace(/\n/g, "$\n");
      io.out(txt);
    }, errUu("cat"));
  };

  function linhasDe(txt) { var l = txt.split("\n"); if (l[l.length - 1] === "") l.pop(); return l; }
  function headTail(cauda) {
    return function (argv, io) {
      var cmd = cauda ? "tail" : "head", p = opcoes(argv, "nc"), n = p.o.n != null ? p.o.n : (p.o.num != null ? p.o.num : "10");
      if (p.o.f) { io.err("tail: (simulador) -f acompanha o arquivo para sempre; experimente no seu Ubuntu com: tail -f /var/log/syslog\n"); return 1; }
      if (invalida(io, cmd, p.o, ["n", "num", "q"])) return 1;
      var varios = p.a.length > 1, primeiro = true;
      return this.lerArquivos(cmd, p.a, io, function (txt, nome) {
        var l = linhasDe(txt), sel;
        if (cauda) sel = String(n)[0] === "+" ? l.slice(parseInt(n, 10) - 1) : l.slice(Math.max(0, l.length - parseInt(n, 10)));
        else sel = String(n)[0] === "-" ? l.slice(0, Math.max(0, l.length - parseInt(String(n).slice(1), 10))) : l.slice(0, parseInt(n, 10));
        if (varios && !p.o.q) { io.out((primeiro ? "" : "\n") + "==> " + nome + " <==\n"); primeiro = false; }
        if (sel.length) io.out(sel.join("\n") + "\n");
      }, errAbrir(cmd));
    };
  }
  CMDS.head = headTail(false);
  CMDS.tail = headTail(true);

  CMDS.wc = function (argv, io) {
    var p = opcoes(argv), o = p.o, linhas = [], tot = [0, 0, 0];
    if (o.lines) o.l = true; if (o.words) o.w = true; if (o.bytes) o.c = true;
    delete o.lines; delete o.words; delete o.bytes;
    if (invalida(io, "wc", o, ["l", "w", "c", "m"])) return 1;
    var todas = !o.l && !o.w && !o.c && !o.m;
    var st = this.lerArquivos("wc", p.a, io, function (txt, nome) {
      var c = [(txt.match(/\n/g) || []).length, (txt.match(/\S+/g) || []).length, o.m ? txt.length : utf8len(txt)];
      tot[0] += c[0]; tot[1] += c[1]; tot[2] += c[2];
      linhas.push({ c: c, nome: nome });
    }, errUu("wc"));
    if (p.a.length > 1) linhas.push({ c: tot, nome: "total" });
    var campos = function (c) { var r = []; if (todas || o.l) r.push(c[0]); if (todas || o.w) r.push(c[1]); if (todas || o.c || o.m) r.push(c[2]); return r; };
    var larg = 0;
    linhas.forEach(function (x) { campos(x.c).forEach(function (v) { larg = Math.max(larg, String(v).length); }); });
    var umCampo = campos([0, 0, 0]).length === 1 && linhas.length === 1;
    linhas.forEach(function (x) {
      io.out(campos(x.c).map(function (v) { return umCampo ? String(v) : pad(v, larg); }).join(" ") + (x.nome ? " " + x.nome : "") + "\n");
    });
    return st;
  };

  CMDS.grep = function (argv, io) {
    var p = opcoes(argv, "eABC"), o = p.o, self = this, achou = false, st = 0;
    if (o["ignore-case"]) o.i = true; if (o.count) o.c = true; if (o.color || o.colour) delete o.color; delete o.colour; delete o["ignore-case"]; delete o.count;
    if (invalida(io, "grep", o, ["i", "v", "n", "c", "w", "r", "R", "l", "E", "F", "o", "x", "e", "A", "B", "C", "H", "h", "s", "q"])) return 2;
    var padrao = o.e != null ? o.e : p.a.shift();
    if (padrao == null) { io.err("Uso: grep [OPÇÃO]... PADRÕES [ARQUIVO]...\nExperimente \"grep --help\" para mais informações.\n"); return 2; }
    var fonte = o.F ? padrao.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : (o.E ? padrao : padrao.replace(/\\([(){}|+?])/g, "\u0000$1").replace(/([(){}|+?])/g, "\\$1").replace(/\u0000(.)/g, "$1"));
    if (o.w) fonte = "(?<![\\wÀ-ÿ])(?:" + fonte + ")(?![\\wÀ-ÿ])";
    if (o.x) fonte = "^(?:" + fonte + ")$";
    var re; try { re = new RegExp(fonte, "g" + (o.i ? "i" : "")); } catch (e) { io.err("grep: expressão regular inválida\n"); return 2; }
    var arquivos = [];
    if ((o.r || o.R) && !p.a.length) p.a = ["."];
    p.a.forEach(function (a) {
      var r = self.achar(a);
      if (!r.err && r.no.t === "d" && (o.r || o.R)) {
        (function anda(no, rot) {
          Object.keys(no.c).sort(cmpBytes).forEach(function (n) {
            var fi = no.c[n], rr = (rot === "." ? "" : rot.replace(/\/$/, "") + "/") + n;
            if (rot === ".") rr = n;
            if (fi.t === "d") anda(fi, rr); else if (self.pode(fi, 4)) arquivos.push({ nome: rr, txt: fi.d });
          });
        })(r.no, a);
      } else arquivos.push({ nome: a });
    });
    var mostrarNome = !o.h && (arquivos.length > 1 || o.r || o.R || o.H);
    var depois = +(o.A || o.C || 0), antes = +(o.B || o.C || 0), ultimoImpresso = null;
    function processa(txt, nome) {
      var ls = linhasDe(txt), cont = 0, listado = false, bateu = [];
      ls.forEach(function (l, idx) { re.lastIndex = 0; bateu[idx] = re.test(l) !== !!o.v; });
      var mostrar = [];
      ls.forEach(function (l, idx) {
        if (!bateu[idx]) return;
        achou = true; cont++;
        for (var k = Math.max(0, idx - antes); k <= Math.min(ls.length - 1, idx + depois); k++) if (!mostrar[k]) mostrar[k] = k === idx ? 2 : 1;
        mostrar[idx] = 2;
      });
      if (o.q) return;
      if (o.c) { io.out((mostrarNome ? nome + ":" : "") + cont + "\n"); return; }
      if (o.l) { if (cont) io.out((io.tty ? cor("p", nome) : nome) + "\n"); return; }
      ls.forEach(function (l, idx) {
        if (!mostrar[idx]) return;
        var sepc = mostrar[idx] === 2 ? ":" : "-";
        if ((antes || depois) && ultimoImpresso !== null && idx > ultimoImpresso + 1) io.out(io.tty ? cor("s", "--") + "\n" : "--\n");
        ultimoImpresso = idx;
        var prefixo = (mostrarNome ? (io.tty ? cor("p", nome) + cor("s", sepc) : nome + sepc) : "") + (o.n ? (io.tty ? cor("g", String(idx + 1)) + cor("s", sepc) : (idx + 1) + sepc) : "");
        if (o.o && !o.v) { if (mostrar[idx] !== 2) return; re.lastIndex = 0; var m; while ((m = re.exec(l))) { io.out(prefixo + (io.tty ? cor("r", m[0]) : m[0]) + "\n"); if (!m[0].length) re.lastIndex++; } return; }
        var corpo = io.tty && !o.v && mostrar[idx] === 2 ? l.replace(re, function (x) { return cor("r", x); }) : l;
        io.out(prefixo + corpo + "\n");
      });
      ultimoImpresso = null;
    }
    if (!arquivos.length) processa(io.stdin || "", "(entrada padrão)");
    arquivos.forEach(function (a) {
      if (a.txt != null) { processa(a.txt, a.nome); return; }
      var r = self.achar(a.nome);
      if (r.err) { if (!o.s) io.err("grep: " + a.nome + ": Arquivo ou diretório inexistente\n"); st = 2; return; }
      if (r.no.t === "d") { if (!o.s) io.err("grep: " + a.nome + ": É um diretório\n"); return; }
      if (!self.pode(r.no, 4)) { if (!o.s) io.err("grep: " + a.nome + ": Permissão negada\n"); st = 2; return; }
      processa(r.no.d, a.nome);
    });
    return st === 2 && !achou ? 2 : (achou ? 0 : 1);
  };

  CMDS.sort = function (argv, io) {
    var p = opcoes(argv, "kt"), o = p.o, tudo = [];
    if (invalida(io, "sort", o, ["r", "n", "u", "f", "h", "k", "t"])) return 2;
    var st = this.lerArquivos("sort", p.a, io, function (txt) { tudo = tudo.concat(linhasDe(txt)); }, function (a) { return "sort: cannot read: " + a + ": No such file or directory\n"; });
    var col = o.k ? parseInt(o.k, 10) - 1 : -1, sep = o.t;
    function chave(l) { if (col < 0) return l; var c = sep ? l.split(sep) : l.trim().split(/\s+/); return c.slice(col).join(sep || " "); }
    var coll = new Intl.Collator("pt-BR", { sensitivity: o.f ? "base" : "variant" });
    function hum(s) { var m = /^([\d.,]+)([KMGT]?)/i.exec(s.trim()); if (!m) return 0; return parseFloat(m[1].replace(",", ".")) * Math.pow(1024, " KMGT".indexOf((m[2] || " ").toUpperCase())); }
    tudo.sort(function (a, b) {
      var x = chave(a), y = chave(b);
      if (o.n) return (parseFloat(x) || 0) - (parseFloat(y) || 0) || coll.compare(a, b);
      if (o.h) return hum(x) - hum(y);
      return coll.compare(x, y);
    });
    if (o.r) tudo.reverse();
    if (o.u) tudo = tudo.filter(function (l, i) { return i === 0 || l !== tudo[i - 1]; });
    if (tudo.length) io.out(tudo.join("\n") + "\n");
    return st;
  };

  CMDS.uniq = function (argv, io) {
    var p = opcoes(argv), o = p.o, grupos = [];
    if (invalida(io, "uniq", o, ["c", "d", "u", "i"])) return 1;
    var st = this.lerArquivos("uniq", p.a.slice(0, 1), io, function (txt) {
      linhasDe(txt).forEach(function (l) {
        var ult = grupos[grupos.length - 1];
        if (ult && (o.i ? ult.l.toLowerCase() === l.toLowerCase() : ult.l === l)) ult.n++; else grupos.push({ l: l, n: 1 });
      });
    }, errUu("uniq"));
    grupos.forEach(function (g) {
      if (o.d && g.n < 2) return; if (o.u && g.n > 1) return;
      io.out((o.c ? pad(g.n, 7) + " " : "") + g.l + "\n");
    });
    return st;
  };

  CMDS.cut = function (argv, io) {
    var p = opcoes(argv, "dfc"), o = p.o;
    if (!o.f && !o.c) { io.err("cut: you must specify a list of bytes, characters, or fields\n"); return 1; }
    function faixa(spec) {
      var s = [];
      spec.split(",").forEach(function (x) { var m = /^(\d*)-(\d*)$/.exec(x); if (m) s.push([m[1] ? +m[1] : 1, m[2] ? +m[2] : 1e9]); else s.push([+x, +x]); });
      return function (i) { return s.some(function (r) { return i >= r[0] && i <= r[1]; }); };
    }
    var sel = faixa(o.f || o.c), sep = o.d != null ? o.d : "\t";
    return this.lerArquivos("cut", p.a, io, function (txt) {
      linhasDe(txt).forEach(function (l) {
        if (o.c) { io.out(Array.from(l).filter(function (c, i) { return sel(i + 1); }).join("") + "\n"); return; }
        if (l.indexOf(sep) === -1) { io.out(l + "\n"); return; }
        io.out(l.split(sep).filter(function (c, i) { return sel(i + 1); }).join(sep) + "\n");
      });
    }, errUu("cut"));
  };

  CMDS.tr = function (argv, io) {
    var p = opcoes(argv), o = p.o;
    function conj(s) { return (s || "").replace(/\[:upper:\]/g, "A-Z").replace(/\[:lower:\]/g, "a-z").replace(/\[:digit:\]/g, "0-9").replace(/\[:space:\]/g, " \t\n").replace(/(.)-(.)/g, function (m, a, b) { var r = ""; for (var c = a.charCodeAt(0); c <= b.charCodeAt(0); c++) r += String.fromCharCode(c); return r; }).replace(/\\n/g, "\n").replace(/\\t/g, "\t"); }
    var a = conj(p.a[0]), b = conj(p.a[1]), txt = io.stdin || "", out = "";
    for (var i = 0; i < txt.length; i++) {
      var ch = txt[i], k = a.indexOf(ch);
      if (o.d) { if (k === -1) out += ch; continue; }
      if (k !== -1 && b) ch = b[Math.min(k, b.length - 1)];
      if (o.s && out[out.length - 1] === ch && (b ? b : a).indexOf(ch) !== -1) continue;
      out += ch;
    }
    io.out(out);
    return 0;
  };

  CMDS.find = function (argv, io) {
    var args = argv.slice(1), caminhos = [], self = this, st = 0;
    while (args.length && args[0][0] !== "-") caminhos.push(args.shift());
    if (!caminhos.length) caminhos = ["."];
    var testes = [], max = 1e9, min = 0, apagar = false, execCmd = null;
    for (var i = 0; i < args.length; i++) {
      var a = args[i], v = args[i + 1];
      if (a === "-name" || a === "-iname") { if (v == null) { io.err("find: faltando argumento para \"" + a + "\"\n"); return 1; } testes.push({ t: "nome", re: globRegex(v), i: a === "-iname" }); i++; }
      else if (a === "-type") { testes.push({ t: "tipo", v: v }); i++; }
      else if (a === "-maxdepth") { max = parseInt(v, 10); i++; }
      else if (a === "-mindepth") { min = parseInt(v, 10); i++; }
      else if (a === "-empty") testes.push({ t: "vazio" });
      else if (a === "-size") { var m = /^([+-]?)(\d+)([ckMG]?)$/.exec(v || ""); var mult = { c: 1, k: 1024, M: 1048576, G: 1073741824, "": 512 }[m ? m[3] : ""]; testes.push({ t: "tam", s: m && m[1], n: m ? +m[2] * mult : 0 }); i++; }
      else if (a === "-user") { testes.push({ t: "dono", v: v }); i++; }
      else if (a === "-delete") apagar = true;
      else if (a === "-print") {}
      else if (a === "-exec") { var fim = args.indexOf(";", i); if (fim < 0) fim = args.indexOf("+", i); if (fim < 0) { io.err("find: faltando argumento para \"-exec\"\n"); return 1; } execCmd = args.slice(i + 1, fim); i = fim; }
      else { io.err("find: (simulador) o teste '" + a + "' não existe neste simulador.\n"); return 1; }
    }
    function passa(no, nome) {
      return testes.every(function (t) {
        if (t.t === "nome") return t.i ? new RegExp(t.re.source, "i").test(nome) : t.re.test(nome);
        if (t.t === "tipo") return (t.v === "d") === (no.t === "d");
        if (t.t === "vazio") return no.t === "d" ? self.vazio(no) : tamanho(no) === 0;
        if (t.t === "tam") { var z = tamanho(no); return t.s === "+" ? z > t.n : t.s === "-" ? z < t.n : z === t.n; }
        if (t.t === "dono") return no.o === t.v;
        return true;
      });
    }
    var achados = [];
    caminhos.forEach(function (c) {
      var r = self.achar(c);
      if (r.err) { io.err("find: ‘" + c + "’: " + (r.err === "EACCES" ? "Permissão negada" : "Arquivo ou diretório inexistente") + "\n"); st = 1; return; }
      (function anda(no, rot, nivel, pai, nome) {
        if (nivel >= min && nivel <= max && passa(no, base(rot))) {
          achados.push({ rot: rot, no: no, pai: pai, nome: nome });
          if (!apagar && !execCmd) io.out(rot + "\n");
        }
        if (no.t === "d" && nivel < max) {
          if (!self.pode(no, 4)) { io.err("find: ‘" + rot + "’: Permissão negada\n"); st = 1; return; }
          Object.keys(no.c).sort(cmpBytes).forEach(function (n) { anda(no.c[n], (rot === "/" ? "" : rot.replace(/\/$/, "")) + "/" + n, nivel + 1, no, n); });
        }
      })(r.no, c, 0, r.pai, r.nome);
    });
    if (apagar) { achados.reverse().forEach(function (x) { if (x.pai && (x.no.t !== "d" || self.vazio(x.no))) delete x.pai.c[x.nome]; }); return st; }
    if (execCmd) {
      achados.forEach(function (x) { self.comando(execCmd.map(function (p) { return p === "{}" ? x.rot : p; }), io); });
      return st;
    }
    return st;
  };

  /* ---------- texto e shell ---------- */
  CMDS.echo = function (argv, io) {
    var a = argv.slice(1), n = false, e = false;
    while (a.length && /^-[neE]+$/.test(a[0])) { if (a[0].indexOf("n") !== -1) n = true; if (a[0].indexOf("e") !== -1) e = true; a.shift(); }
    var s = a.join(" ");
    if (e) s = s.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
    io.out(s + (n ? "" : "\n"));
    return 0;
  };
  CMDS.printf = function (argv, io) {
    var fmt = (argv[1] || "").replace(/\\n/g, "\n").replace(/\\t/g, "\t"), args = argv.slice(2), out = "";
    do {
      var usados = 0;
      out += fmt.replace(/%(-?\d*)([sd%])/g, function (m, w, t) { if (t === "%") return "%"; var v = args[usados++]; if (v == null) v = t === "d" ? "0" : ""; return w ? pad(v, Math.abs(+w), +w < 0) : v; });
      args = args.slice(usados);
    } while (args.length && usados);
    io.out(out);
    return 0;
  };
  CMDS.clear = function () { throw { limpar: true }; };
  CMDS.history = function (argv, io) { io.out(this.hist.map(function (h, i) { return pad(i + 1, 5) + "  " + h; }).join("\n") + "\n"); return 0; };
  CMDS.whoami = function (argv, io) { io.out(this.user + "\n"); return 0; };
  CMDS.hostname = function (argv, io) { io.out(argv[1] === "-I" ? "192.168.0.15 \n" : HOST + "\n"); return 0; };
  CMDS.id = function (argv, io) {
    var alvo = argv.filter(function (a) { return a[0] !== "-"; })[1];
    if (alvo && alvo !== "ana" && alvo !== "root") { io.err("id: '" + alvo + "': não existe tal usuário\n"); return 1; }
    if (argv.indexOf("-u") !== -1) { io.out(((alvo || this.user) === "root" ? "0" : "1000") + "\n"); return 0; }
    if (argv.indexOf("-un") !== -1 || (argv.indexOf("-u") !== -1 && argv.indexOf("-n") !== -1)) { io.out((alvo || this.user) + "\n"); return 0; }
    if (argv.indexOf("-Gn") !== -1 || argv.indexOf("-nG") !== -1) { io.out(((alvo || this.user) === "root" ? "root" : GROUPS.join(" ")) + "\n"); return 0; }
    if ((alvo || this.user) === "root") io.out("uid=0(root) gid=0(root) groups=0(root)\n");
    else io.out("uid=1000(ana) gid=1000(ana) groups=1000(ana),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users),114(lpadmin)\n");
    return 0;
  };
  CMDS.groups = function (argv, io) {
    var alvo = argv[1];
    if (alvo && alvo !== "ana" && alvo !== "root") { io.err("groups: '" + alvo + "': não existe tal usuário\n"); return 1; }
    var lista = (alvo || this.user) === "root" ? "root" : GROUPS.join(" ");
    io.out((alvo ? alvo + " : " : "") + lista + "\n"); return 0;
  };
  CMDS.uname = function (argv, io) {
    var o = opcoes(argv).o;
    var campos = { s: "Linux", n: HOST, r: "7.0.0-38-generic", v: "#38-Ubuntu SMP PREEMPT_DYNAMIC Fri Sep  4 09:10:14 UTC 2026", m: "x86_64", o: "GNU/Linux" };
    if (o.a) { io.out([campos.s, campos.n, campos.r, campos.v, campos.m, campos.o].join(" ") + "\n"); return 0; }
    var r = []; "snrvmo".split("").forEach(function (k) { if (o[k]) r.push(campos[k]); });
    io.out((r.length ? r.join(" ") : "Linux") + "\n");
    return 0;
  };
  CMDS.date = function (argv, io) {
    var t = NOW, f2 = argv[1];
    if (f2 && f2[0] === "+") {
      var mapa = { Y: t.getFullYear(), m: dois(t.getMonth() + 1), d: dois(t.getDate()), H: dois(t.getHours()), M: dois(t.getMinutes()), S: "00", F: t.getFullYear() + "-" + dois(t.getMonth() + 1) + "-" + dois(t.getDate()), T: dois(t.getHours()) + ":" + dois(t.getMinutes()) + ":00", A: "quinta-feira", a: "qui", B: "outubro", b: "out", j: "288", u: "4", s: String(Math.floor(t / 1000)) };
      io.out(f2.slice(1).replace(/%(.)/g, function (m, c) { return mapa[c] != null ? mapa[c] : m; }) + "\n");
      return 0;
    }
    io.out(DIAS_PT[t.getDay()] + " " + t.getDate() + " " + MESES_PT[t.getMonth()] + " " + t.getFullYear() + " " + dois(t.getHours()) + ":" + dois(t.getMinutes()) + ":00 -03\n");
    return 0;
  };
  CMDS.uptime = function (argv, io) { io.out(" 10:30:00 up  2:31,  1 user,  load average: 0,42, 0,38, 0,35\n"); return 0; };
  CMDS.lsb_release = function (argv, io) {
    var o = opcoes(argv).o;
    if (o.a) { io.out("Distributor ID:\tUbuntu\nDescription:\tUbuntu 26.04.1 LTS\nRelease:\t26.04\nCodename:\tresolute\n"); return 0; }
    if (o.r || o.s) { io.out(o.s ? "26.04\n" : "Release:\t26.04\n"); return 0; }
    io.out("Distributor ID:\tUbuntu\n"); return 0;
  };
  CMDS.free = function (argv, io) {
    io.out("               total        usada        livre    compart.  buff/cache   disponível\nMem.:           15Gi        5,2Gi        6,1Gi        412Mi        4,3Gi         10Gi\nSwap:          4,0Gi           0B        4,0Gi\n");
    return 0;
  };
  CMDS.df = function (argv, io) {
    io.out("Sist. Arq.      Tam. Usado Disp. Uso% Montado em\ntmpfs           1,6G  2,3M  1,6G   1% /run\n/dev/nvme0n1p2  468G  121G  324G  28% /\ntmpfs           7,7G     0  7,7G   0% /dev/shm\n/dev/nvme0n1p1  1,1G  6,2M  1,1G   1% /boot/efi\ntmpfs           1,6G  132K  1,6G   1% /run/user/1000\n");
    return 0;
  };
  CMDS.seq = function (argv, io) {
    var a = argv.slice(1).filter(function (x) { return x !== "-w"; }).map(Number), w = argv.indexOf("-w") !== -1;
    var ini = a.length > 1 ? a[0] : 1, passo = a.length > 2 ? a[1] : 1, fim = a[a.length - 1], r = [];
    for (var n = ini; passo > 0 ? n <= fim : n >= fim; n += passo) r.push(n);
    var larg = String(fim).length;
    io.out(r.map(function (n) { var s = String(n); while (w && s.length < larg) s = "0" + s; return s; }).join("\n") + (r.length ? "\n" : ""));
    return 0;
  };
  CMDS.sleep = function () { return 0; };
  CMDS["true"] = function () { return 0; };
  CMDS["false"] = function () { return 1; };
  CMDS.exit = function (argv, io) {
    if (this.user === "root" && this.antes) { var lg = this.antes.login; this.user = this.antes.user; this.cwd = this.antes.cwd; this.vars.HOME = HOME; this.antes = null; io.out(lg ? "sair\n" : "exit\n"); return 0; }
    io.out("(simulador) Para sair de verdade, feche a janela do terminal. Aqui o terminal continua aberto.\n");
    return 0;
  };
  CMDS.logout = CMDS.exit;
  CMDS.type = function (argv, io) {
    var st = 0, self = this;
    argv.slice(1).forEach(function (n) {
      if (["cd", "pwd", "echo", "history", "type", "exit", "printf", "kill", "pushd", "popd", "true", "false", "alias", "unalias", "export", "source", "read"].indexOf(n) !== -1) io.out(n + " é um comando interno do shell\n");
      else if (self.aliases[n]) io.out(n + " está apelidada para `" + self.aliases[n] + "'\n");
      else if (CMDS[n] || INTERATIVOS[n] || SO_REAL[n]) io.out(n + " é /usr/bin/" + n + "\n");
      else { io.err("bash: type: " + n + ": não encontrado\n"); st = 1; }
    });
    return st;
  };
  CMDS.which = function (argv, io) {
    var st = 0;
    argv.slice(1).forEach(function (n) { if (CMDS[n] || INTERATIVOS[n] || SO_REAL[n]) io.out("/usr/bin/" + n + "\n"); else st = 1; });
    return st;
  };
  CMDS.xargs = function (argv, io) {
    var p = argv.slice(1), n = 0, rep = null, self = this;
    var mostrar = false;
    while (p.length && p[0][0] === "-") { var op = p.shift(); if (op === "-t") { mostrar = true; continue; } if (op === "-n") n = +p.shift(); else if (/^-n\d+$/.test(op)) n = +op.slice(2); else if (op === "-I") rep = p.shift(); else if (/^-I./.test(op)) rep = op.slice(2); }
    if (!p.length) p = ["echo"];
    var itens = (io.stdin || "").split(rep ? /\n/ : /\s+/).filter(Boolean), st = 0;
    function roda(argv2) { if (mostrar) io.err(argv2.join(" ") + "\n"); return self.comando(argv2, io); }
    if (rep) itens.forEach(function (it) { st = roda(p.map(function (x) { return x.split(rep).join(it); })) || st; });
    else if (n) for (var i = 0; i < itens.length; i += n) st = roda(p.concat(itens.slice(i, i + n))) || st;
    else if (itens.length) st = roda(p.concat(itens));
    return st;
  };
  CMDS.sudo = function (argv, io) {
    var a = argv.slice(1);
    if (!a.length) { io.err("usage: sudo -h | -K | -k | -V\n"); return 1; }
    if (a[0] === "-k") { this.sudoOk = false; return 0; }
    if (!this.sudoOk && this.user !== "root") { io.out("[sudo: authenticate] Senha: \n"); io.out(cor("i", "(simulador: senha aceita — no Ubuntu real, nada aparece enquanto você digita)") + "\n"); this.sudoOk = true; }
    if (a[0] === "-i" || a[0] === "su" || a[0] === "-s") {
      this.antes = { user: this.user, cwd: this.cwd, login: a[0] === "-i" }; this.user = "root"; if (a[0] === "-i") this.cwd = "/root"; this.vars.HOME = "/root";
      return 0;
    }
    var antes = this.user; this.user = "root";
    var st;
    try { st = this.comando(a, io); } finally { this.user = antes; }
    return st;
  };
  CMDS.help = function (argv, io) {
    var nomes = Object.keys(CMDS).filter(function (n) { return ["true", "false", "logout"].indexOf(n) === -1; }).sort();
    io.out(cor("i", "Comandos disponíveis neste terminal simulado:") + "\n" + nomes.join("  ") + "\n\n" +
      cor("i", "Também funcionam: pipes (|), redirecionamento (> >> 2> 2>&1 < /dev/null), ; && ||, $VAR, $(comando),\nchaves {a,b} {1..5}, curingas * ? [abc], laços for ... ; do ... ; done, Tab para completar,\nsetas ↑ ↓ para o histórico e Ctrl+L para limpar a tela.") + "\n");
    return 0;
  };

  CMDS["return"] = function (argv) { return argv[1] ? +argv[1] : this.status; };
  CMDS.test = function (argv, io) {
    var a = argv.slice(1), self = this;
    if (argv[0] === "[" ) { if (a[a.length - 1] !== "]") { io.err("bash: [: \"]\" faltando\n"); return 2; } a.pop(); }
    if (argv[0] === "[[") { if (a[a.length - 1] !== "]]") { io.err("bash: erro de sintaxe na expressão condicional\n"); return 2; } a.pop(); }
    var neg = false;
    if (a[0] === "!") { neg = true; a.shift(); }
    function arq(op, cam) {
      var r = self.achar(cam); if (r.err) return false;
      if (op === "-e") return true; if (op === "-f") return r.no.t === "f"; if (op === "-d") return r.no.t === "d";
      if (op === "-s") return tamanho(r.no) > 0; if (op === "-r") return self.pode(r.no, 4); if (op === "-w") return self.pode(r.no, 2); if (op === "-x") return self.pode(r.no, 1);
      return false;
    }
    var ok;
    if (a.length === 0) ok = false;
    else if (a.length === 1) ok = a[0] !== "";
    else if (a.length === 2) {
      if (a[0] === "-z") ok = a[1] === ""; else if (a[0] === "-n") ok = a[1] !== ""; else ok = arq(a[0], a[1]);
    } else {
      var x = a[0], op = a[1], y = a[2], nx = parseInt(x, 10), ny = parseInt(y, 10);
      var num = { "-eq": nx === ny, "-ne": nx !== ny, "-lt": nx < ny, "-le": nx <= ny, "-gt": nx > ny, "-ge": nx >= ny };
      if (op in num) {
        if (!/^-?\d+$/.test(x) || !/^-?\d+$/.test(y)) { io.err("bash: " + argv[0] + ": " + (/^-?\d+$/.test(x) ? y : x) + ": esperava expressão de número inteiro\n"); return 2; }
        ok = num[op];
      }
      else if (op === "=" || op === "==") ok = argv[0] === "[[" ? globRegex(y).test(x) : x === y;
      else if (op === "!=") ok = x !== y;
      else if (op === "=~") ok = new RegExp(y).test(x);
      else ok = false;
    }
    return (ok !== neg) ? 0 : 1;
  };
  CMDS["["] = CMDS.test;
  CMDS["[["] = CMDS.test;

  CMDS.umask = function (argv, io) {
    this.mascara = this.mascara == null ? (this.user === "root" ? 18 : 2) : this.mascara;
    var m = this.user === "root" && this.mascara === 2 ? 18 : this.mascara;
    if (argv[1] === "-S") { var bits = function (q) { var v = 7 & ~q; return (v & 4 ? "r" : "") + (v & 2 ? "w" : "") + (v & 1 ? "x" : ""); }; io.out("u=" + bits(m >> 6) + ",g=" + bits((m >> 3) & 7) + ",o=" + bits(m & 7) + "\n"); return 0; }
    if (argv[1] && /^[0-7]{1,4}$/.test(argv[1])) { this.mascara = parseInt(argv[1], 8); return 0; }
    if (argv[1]) { io.err("bash: umask: " + argv[1] + ": caractere de modo octal inválido\n"); return 1; }
    var o = m.toString(8); while (o.length < 4) o = "0" + o; io.out(o + "\n"); return 0;
  };

  CMDS.alias = function (argv, io) {
    var self = this, st = 0;
    if (argv.length === 1) { Object.keys(this.aliases).sort().forEach(function (k) { io.out("alias " + k + "='" + self.aliases[k] + "'\n"); }); return 0; }
    argv.slice(1).forEach(function (a) {
      var i = a.indexOf("=");
      if (i > 0) self.aliases[a.slice(0, i)] = a.slice(i + 1);
      else if (self.aliases[a]) io.out("alias " + a + "='" + self.aliases[a] + "'\n");
      else { io.err("bash: alias: " + a + ": não encontrado\n"); st = 1; }
    });
    return st;
  };
  CMDS.unalias = function (argv, io) {
    var self = this, st = 0;
    argv.slice(1).forEach(function (a) { if (a === "-a") self.aliases = {}; else if (self.aliases[a]) delete self.aliases[a]; else { io.err("bash: unalias: " + a + ": não encontrado\n"); st = 1; } });
    return st;
  };
  CMDS.export = function (argv, io) {
    var self = this;
    if (argv.length === 1 || argv[1] === "-p") { Object.keys(this.vars).sort().forEach(function (k) { io.out("declare -x " + k + "=\"" + self.vars[k] + "\"\n"); }); return 0; }
    argv.slice(1).forEach(function (a) { var i = a.indexOf("="); if (i > 0) self.vars[a.slice(0, i)] = a.slice(i + 1); else if (self.vars[a] == null) self.vars[a] = ""; });
    return 0;
  };
  CMDS.env = function (argv, io) { var self = this; Object.keys(this.vars).sort().forEach(function (k) { io.out(k + "=" + self.vars[k] + "\n"); }); return 0; };
  CMDS.printenv = function (argv, io) { if (argv[1]) { if (this.vars[argv[1]] == null) return 1; io.out(this.vars[argv[1]] + "\n"); return 0; } return CMDS.env.call(this, argv, io); };
  CMDS.source = function (argv, io) {
    if (!argv[1]) { io.err("bash: source: requer argumento de nome de arquivo\n"); return 2; }
    var r = this.achar(argv[1]);
    if (r.err || r.no.t !== "f") { io.err("bash: " + argv[1] + ": Arquivo ou diretório inexistente\n"); return 1; }
    var self = this;
    r.no.d.split("\n").forEach(function (l) { if (l.trim() && l.trim()[0] !== "#") self.executarLista(l, { saida: io.out, erro: io.err }, io.tty); });
    return this.status;
  };
  CMDS["."] = CMDS.source;
  CMDS.chmod = function (argv, io) {
    var args = argv.slice(1), rec = false, verb = false, self = this, st = 0;
    while (args.length && /^-[Rv]+$/.test(args[0])) { var op = args.shift(); if (op.indexOf("R") !== -1) rec = true; if (op.indexOf("v") !== -1) verb = true; }
    var modo = args.shift();
    if (!modo || !args.length) { io.err("chmod: falta operando\n"); return 1; }
    function aplica(no) {
      var m = no.m;
      if (/^[0-7]{3,4}$/.test(modo)) return parseInt(modo, 8);
      var partes = modo.split(","), ok = true;
      partes.forEach(function (p) {
        var x = /^([ugoa]*)([+\-=])([rwxXst]*)$/.exec(p);
        if (!x) { ok = false; return; }
        var quem = x[1] || "a", bits = 0;
        x[3].split("").forEach(function (c) {
          var v = c === "r" ? 4 : c === "w" ? 2 : (c === "x" || (c === "X" && (no.t === "d" || m & 73))) ? 1 : 0;
          if (quem.indexOf("u") !== -1 || quem.indexOf("a") !== -1) bits |= v << 6;
          if (quem.indexOf("g") !== -1 || quem.indexOf("a") !== -1) bits |= v << 3;
          if (quem.indexOf("o") !== -1 || quem.indexOf("a") !== -1) bits |= v;
        });
        if (x[2] === "+") m |= bits;
        else if (x[2] === "-") m &= ~bits;
        else {
          var mask = 0;
          if (quem.indexOf("u") !== -1 || quem.indexOf("a") !== -1) mask |= 448;
          if (quem.indexOf("g") !== -1 || quem.indexOf("a") !== -1) mask |= 56;
          if (quem.indexOf("o") !== -1 || quem.indexOf("a") !== -1) mask |= 7;
          m = (m & ~mask) | bits;
        }
      });
      if (!ok) return null;
      return m;
    }
    function rwx(m) { var l = "rwxrwxrwx", r = ""; for (var i = 0; i < 9; i++) r += (m & (256 >> i)) ? l[i] : "-"; return r; }
    function oct(m) { var o = m.toString(8); while (o.length < 4) o = "0" + o; return o; }
    args.forEach(function (a) {
      var r = self.achar(a);
      if (r.err) { io.err("chmod: não é possível acessar '" + a + "': Arquivo ou diretório inexistente\n"); st = 1; return; }
      (function vai(no, rot) {
        if (no.o !== self.user && self.user !== "root") { io.err("chmod: changing permissions of '" + rot + "': Operation not permitted\n"); st = 1; return; }
        var novo = aplica(no);
        if (novo === null) { io.err("chmod: invalid mode: '" + modo + "'\n"); st = 1; return; }
        if (verb) io.out(novo === no.m ? "mode of '" + rot + "' retained as " + oct(no.m) + " (" + rwx(no.m) + ")\n" : "mode of '" + rot + "' changed from " + oct(no.m) + " (" + rwx(no.m) + ") to " + oct(novo) + " (" + rwx(novo) + ")\n");
        no.m = novo;
        if (rec && no.t === "d") Object.keys(no.c).sort(cmpBytes).forEach(function (n) { vai(no.c[n], rot.replace(/\/$/, "") + "/" + n); });
      })(r.no, a);
    });
    return st;
  };
  CMDS.read = function (argv, io) {
    io.err("(simulador) read espera você digitar algo; aqui não há teclado para scripts. Teste no seu terminal.\n");
    return 1;
  };

  /* ---------- processos ---------- */
  CMDS.ps = function (argv, io) {
    var bruto = argv.slice(1).join(" "), self = this;
    var dono = this.user === "root" ? "root" : USER, self = this;
    var meu = { pid: this.proxPid++, pp: 3001, u: dono, tty: "pts/0", cmd: argv.join(" "), comm: "ps", cpu: 0, mem: 0 };
    var irmaos = (this._pipeline || []).filter(function (c) { return !/^\s*ps(\s|$)/.test(c); }).map(function (c) {
      var w = c.trim().split(/\s+/), al = self.aliases[w[0]];
      var linha = al ? al + " " + w.slice(1).join(" ") : c.trim();
      return { pid: self.proxPid++, pp: 3001, u: dono, tty: "pts/0", cmd: linha.replace(/["']/g, ""), comm: linha.split(/\s+/)[0], cpu: 0, mem: 0 };
    });
    var todos = this.procs.concat([meu]).concat(irmaos);
    if (!bruto) {
      io.out("    PID TTY          TIME CMD\n" + todos.filter(function (p) { return p.tty === "pts/0"; }).map(function (p) { return pad(p.pid, 7) + " " + pad(p.tty, 8, 1) + " 00:00:00 " + p.comm; }).join("\n") + "\n");
      return 0;
    }
    if (/^-?aux$|^-?axu$|^aux /.test(bruto)) {
      io.out("USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n" + todos.map(function (p) {
        var vsz = Math.round(p.mem * 52000 + 18000), rss = Math.round(p.mem * 16000 + 4000);
        var stat = p.tty === "?" ? "Ssl" : p.comm === "ps" ? "R+" : p.comm === "bash" ? "Ss" : "S+";
        return pad(p.u, 8, 1) + " " + pad(p.pid, 7) + " " + pad(p.cpu.toFixed(1), 4) + " " + pad(p.mem.toFixed(1), 4) + " " + pad(vsz, 6) + " " + pad(rss, 5) + " " + pad(p.tty, 8, 1) + " " + pad(stat, 4, 1) + " " + pad("08:00", 5) + " " + pad("0:" + dois(Math.round(p.cpu * 3)), 6) + " " + p.cmd;
      }).join("\n") + "\n");
      return 0;
    }
    if (/^-e?f$|^-ef$/.test(bruto) || bruto === "-e") {
      io.out("UID          PID    PPID  C STIME TTY          TIME CMD\n" + todos.map(function (p) { return pad(p.u, 8, 1) + pad(p.pid, 8) + pad(p.pp, 8) + "  0 08:00 " + pad(p.tty, 8, 1) + " 00:00:00 " + p.cmd; }).join("\n") + "\n");
      return 0;
    }
    io.err("ps: (simulador) aqui funcionam: ps, ps aux e ps -ef.\n");
    return 1;
  };
  CMDS.pgrep = function (argv, io) {
    var p = opcoes(argv, "u"), o = p.o, pad_ = p.a[0];
    if (pad_ == null) { io.err("pgrep: no matching criteria specified\nTry `pgrep --help' for more information.\n"); return 2; }
    if (!o.f && pad_.replace(/\\./g, "x").length > 15) io.err("pgrep: o padrão que pesquisa por nomes de processo maiores que 15 caracteres vai resultar em zero correspondências\nTente a opção \"pgrep -f\" para corresponder com a linha de comando completa.\n");
    var re = new RegExp(o.x ? "^(?:" + pad_ + ")$" : pad_, o.i ? "i" : "");
    var lista = this.procs.filter(function (pr) { return re.test(o.f ? pr.cmd : pr.comm) && (!o.u || pr.u === o.u); });
    if (o.c) io.out(lista.length + "\n");
    else lista.forEach(function (pr) { io.out(pr.pid + (o.a ? " " + pr.cmd : o.l ? " " + pr.comm : "") + "\n"); });
    return lista.length ? 0 : 1;
  };
  Shell.prototype.matar = function (pr, sinal) {
    if (pr.u !== this.user && this.user !== "root") return false;
    this.procs = this.procs.filter(function (x) { return x !== pr; });
    return true;
  };
  CMDS.kill = function (argv, io) {
    var a = argv.slice(1), self = this, st = 0, sinal = "TERM";
    if (a[0] === "-l") { io.out(" 1) SIGHUP\t 2) SIGINT\t 3) SIGQUIT\t 4) SIGILL\t 5) SIGTRAP\n 6) SIGABRT\t 7) SIGBUS\t 8) SIGFPE\t 9) SIGKILL\t10) SIGUSR1\n11) SIGSEGV\t12) SIGUSR2\t13) SIGPIPE\t14) SIGALRM\t15) SIGTERM\n"); return 0; }
    if (a.length && a[0][0] === "-") sinal = a.shift().slice(1);
    if (!a.length) { io.err("kill: uso: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... ou kill -l [sigspec]\n"); return 2; }
    a.forEach(function (x) {
      if (!/^\d+$/.test(x)) { io.err("bash: kill: `" + x + "': não é um identificador de processo (pid) nem é uma especificação de trabalho válida\n"); st = 1; return; }
      var pr = self.procs.filter(function (q) { return q.pid === +x; })[0];
      if (!pr) { io.err("bash: kill: (" + x + ") - Processo inexistente\n"); st = 1; return; }
      if (!self.matar(pr, sinal)) { io.err("bash: kill: (" + x + ") - Operação não permitida\n"); st = 1; }
    });
    return st;
  };
  CMDS.pkill = function (argv, io) {
    var p = opcoes(argv), o = p.o, re = new RegExp(p.a[0] || "^$"), self = this, n = 0;
    this.procs.slice().forEach(function (pr) { if (re.test(o.f ? pr.cmd : pr.comm) && self.matar(pr)) n++; });
    return n ? 0 : 1;
  };
  CMDS.killall = function (argv, io) {
    var nome = argv.filter(function (x) { return x[0] !== "-"; })[1], self = this, n = 0;
    this.procs.slice().forEach(function (pr) { if (pr.comm === nome && self.matar(pr)) n++; });
    if (!n) { io.err(nome + ": nenhum processo localizado\n"); return 1; }
    return 0;
  };

  /* ---------- completar com Tab ---------- */
  Shell.prototype.completar = function (linha) {
    var m = /(\S*)$/.exec(linha), parcial = m[1], antes = linha.slice(0, linha.length - parcial.length);
    var primeira = !/\S\s/.test(linha.replace(/^\s+/, "")) && !/[|;&]\s*$/.test(antes) ? antes.trim() === "" : /[|;&]\s*$/.test(antes);
    var opcoesC = [];
    if (primeira && parcial.indexOf("/") === -1) {
      opcoesC = Object.keys(CMDS).filter(function (c) { return c.indexOf(parcial) === 0; }).map(function (c) { return c + " "; });
    } else {
      var semAspas = parcial.replace(/\\ /g, " "), barra = semAspas.lastIndexOf("/"), dir = barra >= 0 ? semAspas.slice(0, barra + 1) : "", pre = semAspas.slice(barra + 1);
      var dirReal = dir.replace(/^~(?=\/|$)/, this.vars.HOME) || ".";
      var r = this.achar(dirReal);
      if (r.no && r.no.t === "d" && this.pode(r.no, 4)) {
        opcoesC = Object.keys(r.no.c).filter(function (n) { return n.indexOf(pre) === 0 && (pre[0] === "." || n[0] !== "."); }).sort(cmpBytes).map(function (n) {
          return (dir + n).replace(/ /g, "\\ ") + (r.no.c[n].t === "d" ? "/" : " ");
        });
      }
    }
    if (!opcoesC.length) return { linha: linha, lista: [] };
    if (opcoesC.length === 1) return { linha: antes + opcoesC[0], lista: [] };
    var comum = opcoesC[0];
    opcoesC.forEach(function (x) { while (x.indexOf(comum) !== 0) comum = comum.slice(0, -1); });
    return { linha: antes + comum, lista: opcoesC.map(function (x) { return x.replace(/\\ /g, " ").replace(/ $/, "").replace(/^.*\/(?=.)/, ""); }) };
  };

  /* ---------- missões ---------- */
  Shell.prototype.checar = function (meta) {
    var self = this;
    return meta.split(",").map(function (s) { return s.trim(); }).filter(Boolean).every(function (g) {
      var i = g.indexOf(":"), tipo = g.slice(0, i), val = g.slice(i + 1).replace(/^~/, HOME), r;
      if (tipo === "dir") { r = self.achar(val); return !!(r.no && r.no.t === "d"); }
      if (tipo === "file") { r = self.achar(val); return !!(r.no && r.no.t === "f"); }
      if (tipo === "absent") { r = self.achar(val); return !r.no; }
      if (tipo === "cwd") return self.cwd === self.abs(val);
      if (tipo === "contains") { var p2 = val.split("="); r = self.achar(p2[0]); return !!(r.no && r.no.t === "f" && r.no.d.indexOf(p2.slice(1).join("=")) !== -1); }
      if (tipo === "noproc") return !self.procs.some(function (p) { return p.comm === val; });
      if (tipo === "ran") return self.hist.some(function (h) { return new RegExp(val).test(h); });
      return false;
    });
  };

  /* =========================================================
     Interface (navegador)
     ========================================================= */
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function pintar(s) { return esc(s).replace(/\u0001(.)([^\u0002]*)\u0002/g, '<span class="c-$1">$2</span>'); }
  function promptHtml(pr) {
    return '<span class="c-u">' + pr.user + "@" + pr.host + '</span>:<span class="c-d">' + esc(pr.path) + "</span>" + pr.sym + " ";
  }

  function montar(el) {
    if (el.getAttribute("data-montado")) return;
    el.setAttribute("data-montado", "1");
    var sh = new Shell(), setup = el.getAttribute("data-setup") || "", meta = el.getAttribute("data-goal") || "";
    var caixa = document.createElement("div");
    caixa.className = "sim";
    caixa.innerHTML =
      '<div class="sim-bar"><span class="sim-dots"><i></i><i></i><i></i></span><span class="sim-title"></span>' +
      '<button type="button" class="sim-btn sim-reset" title="Volta a máquina ao estado inicial">Reiniciar</button></div>' +
      '<div class="sim-screen"><div class="sim-out" aria-live="polite"></div>' +
      '<div class="sim-line"><span class="sim-prompt"></span><input class="sim-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Digite um comando"></div></div>';
    el.appendChild(caixa);
    var tela = caixa.querySelector(".sim-screen"), out = caixa.querySelector(".sim-out"), inp = caixa.querySelector(".sim-input"),
      pr = caixa.querySelector(".sim-prompt"), titulo = caixa.querySelector(".sim-title");
    var status = null;
    if (meta) {
      status = document.createElement("p");
      status.className = "sim-status";
      status.textContent = "Missão em andamento…";
      el.appendChild(status);
    }
    var hi = -1, rascunho = "";

    function atualizaPrompt() {
      var p = sh.prompt();
      pr.innerHTML = promptHtml(p);
      titulo.textContent = p.user + "@" + p.host + ": " + p.path;
    }
    function escreve(html, cls) { var dv = document.createElement("div"); dv.className = cls || ""; dv.innerHTML = html; out.appendChild(dv); }
    function inicia() {
      sh.reset(); out.innerHTML = "";
      if (setup) setup.split(";;").forEach(function (l) { sh.rodar(l); });
      sh.hist = []; sh.status = 0;
      escreve(pintar(cor("i", "Terminal simulado · máquina fictícia \"notebook\" · usuária \"ana\". Digite help para ver os comandos.")), "sim-msg");
      atualizaPrompt();
      if (status) { status.textContent = "Missão em andamento…"; status.className = "sim-status"; }
    }
    function rola() { tela.scrollTop = tela.scrollHeight; }

    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var linha = inp.value, p = sh.prompt();
        escreve(promptHtml(p) + esc(linha), "sim-cmd");
        inp.value = ""; hi = -1;
        var res = sh.rodar(linha);
        res.forEach(function (r) {
          if (r.tipo === "clear") { out.innerHTML = ""; return; }
          if (!r.texto) return;
          escreve(pintar(r.texto.replace(/\n$/, "")), r.tipo === "err" ? "sim-err" : "");
        });
        atualizaPrompt();
        if (status && sh.checar(meta)) { status.textContent = "✔ Missão cumprida!"; status.className = "sim-status ok"; }
        rola();
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        if (!sh.hist.length) return;
        if (hi === -1) { rascunho = inp.value; hi = sh.hist.length; }
        hi = Math.max(0, hi - 1); inp.value = sh.hist[hi]; e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (hi === -1) return;
        hi++; if (hi >= sh.hist.length) { hi = -1; inp.value = rascunho; } else inp.value = sh.hist[hi];
        e.preventDefault();
      } else if (e.key === "Tab") {
        e.preventDefault();
        var c = sh.completar(inp.value);
        inp.value = c.linha;
        if (c.lista.length) { escreve(promptHtml(sh.prompt()) + esc(inp.value), "sim-cmd"); escreve(esc(c.lista.join("  ")), ""); rola(); }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault(); out.innerHTML = "";
      } else if (e.key === "c" && e.ctrlKey && !window.getSelection().toString()) {
        e.preventDefault(); escreve(promptHtml(sh.prompt()) + esc(inp.value) + "^C", "sim-cmd"); inp.value = ""; rola();
      }
    });
    tela.addEventListener("click", function () { if (!window.getSelection().toString()) inp.focus({ preventScroll: true }); });
    caixa.querySelector(".sim-reset").addEventListener("click", function () { inicia(); inp.focus({ preventScroll: true }); });
    inicia();
  }

  global.UbuntuSim = { Shell: Shell, montar: montar, _expandirChaves: expandirChaves };
  if (typeof document !== "undefined") {
    var iniciar = function () { document.querySelectorAll(".try").forEach(montar); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
  }
  if (typeof module !== "undefined") module.exports = global.UbuntuSim;
})(typeof window !== "undefined" ? window : globalThis);
