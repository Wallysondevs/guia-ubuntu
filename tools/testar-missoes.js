#!/usr/bin/env node
/*
  tools/testar-missoes.js — confere as missões (div.try) e os exercícios das páginas.

  Uso:
    node tools/testar-missoes.js                 # todas as páginas .html da raiz
    node tools/testar-missoes.js grep.html ...   # só estas páginas
    node tools/testar-missoes.js --detalhes      # mostra também as missões que passaram

  Para cada div.try com data-goal (o motor é o mesmo assets/sim.js do site):
    - toda meta ran: precisa ser uma expressão regular válida;
    - a missão precisa de data-solucao (comandos separados por ;;, como no data-setup);
    - depois do data-setup a meta AINDA NÃO pode estar cumprida;
    - casos negativos: Enter vazio e colar o texto da missão no terminal não podem cumprir a meta
      (colar a missão só vira aviso ⚠: o texto costuma trazer o próprio comando como dica);
    - digitando a data-solucao, a meta TEM de ser cumprida, sem "comando não encontrado".
  Para os exercícios:
    - input[data-answer]: nenhuma alternativa vazia (o campo vazio não pode ser aceito);
      alternativas separadas por | ou pelo caractere de data-sep (para respostas com |, como ||);
    - .mc[data-answer]: o número da resposta certa precisa existir entre as opções.
*/
"use strict";
var fs = require("fs"), path = require("path");
var RAIZ = path.join(__dirname, "..");
var Sim = require(path.join(RAIZ, "assets", "sim.js"));

function decodificar(s) {
  return String(s).replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, function (m, e) {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", hellip: "…", mdash: "—", ndash: "–" }[e] || m;
  });
}
function atributos(tag) {
  var at = {}, re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g, m;
  tag = tag.replace(/^<\w+/, "").replace(/\/?>$/, "");
  while ((m = re.exec(tag))) at[m[1]] = decodificar(m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : m[5] !== undefined ? m[5] : "");
  return at;
}
function fimDiv(html, ini) {
  var re = /<div\b|<\/div>/gi, d = 0, m;
  re.lastIndex = ini;
  while ((m = re.exec(html))) { if (m[0][1] === "/") { d--; if (d === 0) return m.index; } else d++; }
  return html.length;
}
function texto(h) { return decodificar(h.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim(); }
function linhaDe(html, i) { return html.slice(0, i).split("\n").length; }

function extrair(html) {
  var res = [], re = /<div\b[^>]*class\s*=\s*["']([^"']*)["'][^>]*>/gi, m;
  while ((m = re.exec(html))) {
    if (m[1].split(/\s+/).indexOf("try") < 0) continue;
    var corpo = html.slice(m.index + m[0].length, fimDiv(html, m.index));
    var t = /<p\b[^>]*class\s*=\s*["'][^"']*try-task[^"']*["'][^>]*>([\s\S]*?)<\/p>/i.exec(corpo);
    res.push({ at: atributos(m[0]), tarefa: t ? texto(t[1]) : "", linha: linhaDe(html, m.index) });
  }
  return res;
}
function partes(s) { return (s || "").split(";;").map(function (x) { return x.trim(); }).filter(Boolean); }

// mesma sequência do site: reset, setup, zera histórico e código de saída
function novaSessao(setup) {
  var sh = new Sim.Shell();
  sh.reset();
  partes(setup).forEach(function (l) { sh.rodar(l); });
  sh.hist = []; sh.status = 0;
  return sh;
}
function digitar(sh, linhas) {
  var erros = [];
  linhas.forEach(function (l) {
    (sh.rodar(l) || []).forEach(function (r) {
      if (r.tipo === "err" && /comando não encontrado|command not found/.test(r.texto || "")) erros.push(l + " → " + String(r.texto).replace(/[\u0001-\u0002]./g, "").trim());
    });
  });
  return erros;
}

function testarMissao(m) {
  var meta = m.at["data-goal"], erros = [], avisos = [];
  meta.split(",").map(function (s) { return s.trim(); }).forEach(function (g) {
    var i = g.indexOf(":"), tipo = i < 0 ? g : g.slice(0, i);
    if (["dir", "file", "absent", "cwd", "contains", "noproc", "ran"].indexOf(tipo) < 0) erros.push("tipo de meta desconhecido: " + g);
    if (tipo === "ran") { try { new RegExp(g.slice(i + 1)); } catch (e) { erros.push("regex inválida em " + g + ": " + e.message); } }
  });
  if (erros.length) return { erros: erros, avisos: avisos };
  var sol = partes(m.at["data-solucao"]);
  if (!sol.length) { erros.push("falta data-solucao"); return { erros: erros, avisos: avisos }; }
  var sh = novaSessao(m.at["data-setup"]);
  if (sh.checar(meta)) erros.push("a missão já começa cumprida (só com o data-setup)");
  digitar(sh, [""]);
  if (sh.checar(meta)) erros.push("Enter vazio cumpre a missão");
  if (m.tarefa) {
    sh = novaSessao(m.at["data-setup"]);
    digitar(sh, [m.tarefa]);
    if (sh.checar(meta)) {
      avisos.push("colar o texto da missão no terminal já cumpre a meta (" + (/^(ran:[^,]*,?)+$/.test(meta.replace(/\s/g, "")) ? "a meta só confere o que foi digitado" : "o texto da missão traz o próprio comando") + ")");
    }
  }
  sh = novaSessao(m.at["data-setup"]);
  var naoAchou = digitar(sh, sol);
  if (naoAchou.length) erros.push("a solução usa comando que o simulador não tem: " + naoAchou.join(" | "));
  if (!sh.checar(meta)) erros.push("a solução não cumpre a meta: " + sol.join(" ;; "));
  return { erros: erros, avisos: avisos };
}

function testarExercicios(html) {
  var erros = [], n = 0, m;
  var re = /<input\b[^>]*data-answer\s*=\s*("([^"]*)"|'([^']*)')[^>]*>/gi;
  while ((m = re.exec(html))) {
    n++;
    var sep = atributos(m[0])["data-sep"] || "|";
    var alts = decodificar(m[2] !== undefined ? m[2] : m[3]).split(sep).map(function (s) { return s.trim().replace(/\s+/g, " "); });
    if (alts.some(function (a) { return a === ""; })) erros.push("linha " + linhaDe(html, m.index) + ": exercício aceita o campo vazio (data-answer=\"" + alts.join("|") + "\")");
  }
  var reMc = /<div\b[^>]*class\s*=\s*["'][^"']*\bmc\b[^"']*["'][^>]*>/gi;
  while ((m = reMc.exec(html))) {
    n++;
    var at = atributos(m[0]), corpo = html.slice(m.index, fimDiv(html, m.index));
    var opcoes = (corpo.match(/<label\b/gi) || []).length, certa = parseInt(at["data-answer"], 10);
    if (!(certa >= 1 && certa <= opcoes)) erros.push("linha " + linhaDe(html, m.index) + ": múltipla escolha com data-answer=\"" + at["data-answer"] + "\" e " + opcoes + " opções");
  }
  return { n: n, erros: erros };
}

function main(argv) {
  var detalhes = argv.indexOf("--detalhes") >= 0;
  var paginas = argv.filter(function (a) { return a[0] !== "-"; });
  if (!paginas.length) paginas = fs.readdirSync(RAIZ).filter(function (f) { return /\.html$/.test(f); }).sort();
  var total = 0, falhas = 0, livres = 0, nAvisos = 0, exTotal = 0, exFalhas = 0;
  paginas.forEach(function (pg) {
    var arq = fs.existsSync(pg) ? pg : path.join(RAIZ, pg);
    if (!fs.existsSync(arq)) { console.log(pg + "\n  ✗ arquivo não encontrado"); falhas++; return; }
    var html = fs.readFileSync(arq, "utf8"), linhas = [];
    extrair(html).forEach(function (m, ix) {
      if (!m.at["data-goal"]) { livres++; return; }
      total++;
      var nome = "try #" + (ix + 1) + " (linha " + m.linha + ")" + (m.tarefa ? ": " + m.tarefa.replace(/^Missão:\s*/, "").slice(0, 60) + (m.tarefa.length > 60 ? "…" : "") : "");
      var r;
      try { r = testarMissao(m); } catch (e) { r = { erros: ["erro ao rodar no simulador: " + e.message], avisos: [] }; }
      if (r.erros.length) { falhas++; linhas.push("  ✗ " + nome); r.erros.forEach(function (e) { linhas.push("      - " + e); }); }
      else if (r.avisos.length || detalhes) { linhas.push("  ✔ " + nome); }
      r.avisos.forEach(function (a) { nAvisos++; linhas.push("      ⚠ " + a); });
    });
    var ex = testarExercicios(html);
    exTotal += ex.n; exFalhas += ex.erros.length;
    ex.erros.forEach(function (e) { linhas.push("  ✗ exercício, " + e); });
    if (linhas.length) console.log(path.basename(arq) + "\n" + linhas.join("\n"));
  });
  console.log("\n" + (total - falhas) + " de " + total + " missões ok" + (falhas ? " — " + falhas + " com problema" : "") +
    (nAvisos ? " · " + nAvisos + " aviso(s)" : "") + (livres ? " · " + livres + " treino(s) livre(s) sem meta" : "") +
    "\n" + (exTotal - exFalhas) + " de " + exTotal + " exercícios ok" + (exFalhas ? " — " + exFalhas + " com problema" : ""));
  return falhas || exFalhas ? 1 : 0;
}
if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { extrair: extrair, testarMissao: testarMissao };
