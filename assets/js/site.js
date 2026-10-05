var FORMSPREE_ENDPOINT = 'https://formspree.io/p/3105898672135601876/f/contato-site';
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var topo = document.querySelector('.topo');
  function medeTopo() {
    if (topo) doc.style.setProperty('--topo-h', topo.offsetHeight + 'px');
  }
  medeTopo();
  window.addEventListener('resize', medeTopo);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medeTopo);

  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  function fechaMenu() {
    if (!menuBtn) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.querySelector('.sr').textContent = 'Abrir menu';
    menu.classList.remove('aberto');
    doc.classList.remove('menu-aberto');
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var abre = menuBtn.getAttribute('aria-expanded') !== 'true';
      if (!abre) { fechaMenu(); return; }
      medeTopo();
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.querySelector('.sr').textContent = 'Fechar menu';
      menu.classList.add('aberto');
      doc.classList.add('menu-aberto');
      var primeiro = menu.querySelector('a');
      if (primeiro) primeiro.focus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) { fechaMenu(); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1080) fechaMenu(); });
  }

  var NS = 'http://www.w3.org/2000/svg', XL = 'http://www.w3.org/1999/xlink';
  if (!calmo) {
    document.querySelectorAll('[data-veic]').forEach(function (g) {
      g.getAttribute('data-veic').split(/\s+/).forEach(function (spec) {
        var p = spec.split('|'), qtd = +p[1] || 1, dur = +p[2] || 8, modelo = p[3] || 'v';
        for (var i = 0; i < qtd; i++) {
          var u = document.createElementNS(NS, 'use');
          u.setAttribute('href', '#' + modelo); u.setAttributeNS(XL, 'xlink:href', '#' + modelo);
          var ini = (-(dur / qtd) * i).toFixed(2) + 's';
          var m = document.createElementNS(NS, 'animateMotion');
          m.setAttribute('dur', dur + 's'); m.setAttribute('repeatCount', 'indefinite');
          m.setAttribute('rotate', 'auto'); m.setAttribute('begin', ini);
          var mp = document.createElementNS(NS, 'mpath');
          mp.setAttribute('href', '#' + p[0]); mp.setAttributeNS(XL, 'xlink:href', '#' + p[0]);
          m.appendChild(mp); u.appendChild(m);
          var o = document.createElementNS(NS, 'animate');
          o.setAttribute('attributeName', 'opacity'); o.setAttribute('values', '0;1;1;0');
          o.setAttribute('keyTimes', '0;.06;.93;1'); o.setAttribute('dur', dur + 's');
          o.setAttribute('repeatCount', 'indefinite'); o.setAttribute('begin', ini);
          u.appendChild(o); g.appendChild(u);
        }
      });
    });
  }

  var vivos = document.querySelectorAll('[data-vivo]');
  function smil(el, roda) {
    var svgs = el.tagName.toLowerCase() === 'svg' ? [el] : Array.prototype.slice.call(el.querySelectorAll('svg'));
    svgs.forEach(function (s) { if (s.pauseAnimations) { if (roda) s.unpauseAnimations(); else s.pauseAnimations(); } });
  }
  if (calmo) {
    document.querySelectorAll('svg').forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });
  } else if ('IntersectionObserver' in window) {
    var ioVivo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('parado', !e.isIntersecting); smil(e.target, e.isIntersecting); });
    }, { rootMargin: '80px 0px' });
    vivos.forEach(function (v) { ioVivo.observe(v); });
  }

  document.querySelectorAll('.lista-viva, .tres-areas').forEach(function (ul) {
    Array.prototype.forEach.call(ul.children, function (li, k) { li.style.setProperty('--k', k); });
  });

  document.querySelectorAll('[data-faixa]').forEach(function (f) {
    var janela = f.querySelector('.faixa-num-janela'), trilho = f.querySelector('.faixa-num-trilho');
    var lista = trilho.querySelector('ul');
    if (calmo) { janela.classList.add('estatica'); return; }
    var copias = 0;
    function enche() {
      while (copias < 3 || trilho.scrollWidth < janela.clientWidth * 2.2) {
        var c = lista.cloneNode(true); c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('.sr').forEach(function (s) { s.remove(); });
        trilho.appendChild(c); copias++;
        if (copias > 8) break;
      }
    }
    enche();
    var x = 0, vel = 34, t0 = null, arr = null, sobre = false, visivel = false, rodando = false;
    function quadro(t) {
      if (t0 === null) t0 = t;
      var dt = Math.min(64, t - t0); t0 = t;
      if (!arr && !sobre && !document.hidden) x -= vel * dt / 1000;
      var L = lista.offsetWidth;
      if (L) { while (x <= -L) x += L; while (x > 0) x -= L; }
      trilho.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      if (visivel || arr) requestAnimationFrame(quadro); else { rodando = false; t0 = null; }
    }
    function liga() { if (!rodando) { rodando = true; requestAnimationFrame(quadro); } }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; if (visivel) liga(); }).observe(f);
    } else { visivel = true; liga(); }
    f.addEventListener('mouseenter', function () { sobre = true; });
    f.addEventListener('mouseleave', function () { sobre = false; });
    janela.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      arr = { px: e.clientX, base: x, id: e.pointerId };
      janela.classList.add('arrastando');
      try { janela.setPointerCapture(e.pointerId); } catch (err) {}
      liga();
    });
    janela.addEventListener('pointermove', function (e) { if (arr) x = arr.base + (e.clientX - arr.px); });
    function solta() { if (arr) { arr = null; janela.classList.remove('arrastando'); } }
    janela.addEventListener('pointerup', solta);
    janela.addEventListener('pointercancel', solta);
    window.addEventListener('resize', enche);
  });

  var alvos = Array.prototype.slice.call(document.querySelectorAll('.rv, .bm-divisor, .linha, .passos, .lista-viva, .tres-areas, .itin'));
  function revela(el) { el.classList.add('on'); }
  if (calmo || !('IntersectionObserver' in window)) {
    alvos.forEach(revela);
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { revela(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    alvos.forEach(function (el) { io.observe(el); });
    var pendente = false;
    var varre = function () {
      pendente = false;
      var limite = window.innerHeight * 0.94;
      alvos = alvos.filter(function (el) {
        if (el.getBoundingClientRect().top < limite) { revela(el); io.unobserve(el); return false; }
        return true;
      });
      if (!alvos.length) { window.removeEventListener('scroll', agenda); window.removeEventListener('resize', agenda); }
    };
    var agenda = function () { if (!pendente) { pendente = true; requestAnimationFrame(varre); } };
    window.addEventListener('scroll', agenda, { passive: true });
    window.addEventListener('resize', agenda);
    window.addEventListener('load', varre);
    setInterval(function () { if (alvos.length) agenda(); }, 400);
    varre();
  }

  document.querySelectorAll('.bm-letreiro').forEach(function (el) {
    var n = +el.dataset.casas || 12, palavras = el.dataset.palavras.split('|'), k = 0, casas = [];
    for (var i = 0; i < n; i++) {
      var c = document.createElement('span');
      c.className = 'bm-casa'; c.style.setProperty('--i', i);
      c.innerHTML = '<span class="bm-rolo"><span></span><span></span></span>';
      el.appendChild(c); casas.push(c.firstChild);
    }
    function mostra() {
      var p = palavras[k++ % palavras.length].toUpperCase();
      el.setAttribute('aria-label', p);
      casas.forEach(function (r) {
        var idx = casas.indexOf(r), ch = p[idx] || ' ', a = r.children[0], b = r.children[1];
        if (a.textContent === ch) return;
        if (calmo) { a.textContent = ch; return; }
        b.textContent = ch; r.classList.add('vira');
        r.addEventListener('transitionend', function () { a.textContent = ch; r.classList.remove('vira'); }, { once: true });
      });
    }
    mostra();
    if (!calmo) setInterval(mostra, 2600);
  });

  var modal = document.getElementById('modal-fale');
  if (modal && typeof modal.showModal === 'function') {
    var form = modal.querySelector('form');
    var vistaForm = modal.querySelector('[data-vista="form"]');
    var vistaOk = modal.querySelector('[data-vista="ok"]');
    var vistaErro = modal.querySelector('[data-vista="erro"]');
    var botao = form.querySelector('[type="submit"]');
    var rotulo = botao.querySelector('.rotulo');
    var carregando = form.querySelector('.carregando');
    var origem = null;

    function mostraVista(v) {
      [vistaForm, vistaOk, vistaErro].forEach(function (x) { x.hidden = x !== v; });
    }
    function abre(e) {
      if (e) e.preventDefault();
      fechaMenu();
      origem = document.activeElement;
      mostraVista(vistaForm);
      modal.showModal();
      doc.classList.add('menu-aberto');
      var c = form.querySelector('input'); if (c) c.focus();
    }
    function fecha() { modal.close(); }
    modal.addEventListener('close', function () {
      doc.classList.remove('menu-aberto');
      if (location.hash === '#fale-com-a-lg') history.replaceState(null, '', location.pathname + location.search);
      if (origem && origem.focus) origem.focus();
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) fecha(); });
    modal.querySelectorAll('[data-fecha]').forEach(function (b) { b.addEventListener('click', fecha); });
    document.querySelectorAll('[data-abre-modal]').forEach(function (a) { a.addEventListener('click', abre); });
    if (location.hash === '#fale-com-a-lg') setTimeout(abre, calmo ? 0 : 500);

    var msgs = {
      vazio: 'Preencha este campo.',
      email: 'Confira o e-mail: falta o @ ou o domínio.',
      tel: 'Informe o telefone com DDD.',
      curta: 'Conte um pouco mais sobre o que você precisa.',
      aceite: 'Marque a autorização para a LG poder responder.'
    };
    function valida(campo) {
      var wrap = campo.closest('.campo'), erro = wrap.querySelector('.erro'), v = campo.value.trim(), m = '';
      if (campo.type === 'checkbox') m = campo.checked ? '' : msgs.aceite;
      else if (!v) m = msgs.vazio;
      else if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = msgs.email;
      else if (campo.type === 'tel' && v.replace(/\D/g, '').length < 10) m = msgs.tel;
      else if (campo.tagName === 'TEXTAREA' && v.length < 20) m = msgs.curta;
      erro.textContent = m;
      wrap.classList.toggle('invalido', !!m);
      campo.setAttribute('aria-invalid', m ? 'true' : 'false');
      return !m;
    }
    var campos = form.querySelectorAll('.campo input, .campo select, .campo textarea');
    campos.forEach(function (c) {
      if (c.type === 'checkbox') { c.addEventListener('change', function () { valida(c); }); return; }
      c.addEventListener('blur', function () { if (c.value.trim() || c.closest('.campo').classList.contains('invalido')) valida(c); });
      c.addEventListener('input', function () { if (c.closest('.campo').classList.contains('invalido')) valida(c); });
    });

    var erroMsg = vistaErro.querySelector('[data-erro-msg]');
    var textos = {
      rede: 'A conexão falhou, mas o que você escreveu continua no formulário. Tente de novo.',
      config: 'O formulário ainda está sendo ligado ao e-mail da LG e a mensagem não saiu. O que você escreveu continua no formulário.',
      servico: 'O serviço de envio não aceitou a mensagem agora. O que você escreveu continua no formulário. Tente de novo em alguns minutos.',
      faltou: 'Faltou um dado obrigatório: nome, e-mail, mensagem ou a autorização de uso dos dados. Confira o formulário e envie de novo.'
    };
    function valor(nome) { var c = form.elements[nome]; return c ? c.value.trim() : ''; }
    function termina(ok, motivo) {
      botao.disabled = false;
      rotulo.textContent = 'Enviar mensagem';
      carregando.classList.remove('on');
      if (ok) { form.reset(); mostraVista(vistaOk); vistaOk.querySelector('a, button').focus(); return; }
      if (erroMsg) erroMsg.textContent = textos[motivo] || textos.rede;
      mostraVista(vistaErro); vistaErro.querySelector('button').focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var primeiroErro = null;
      campos.forEach(function (c) { if (!valida(c) && !primeiroErro) primeiroErro = c; });
      if (primeiroErro) { primeiroErro.focus(); return; }
      botao.disabled = true;
      rotulo.textContent = 'Enviando…';
      carregando.classList.add('on');

      var isca = form.elements._gotcha;
      if (isca && isca.value) { setTimeout(function () { termina(true); }, 600); return; }
      if (!/^https:\/\/formspree\.io\/(p\/\d+\/)?f\/[\w-]+$/.test(FORMSPREE_ENDPOINT)) { setTimeout(function () { termina(false, 'config'); }, 600); return; }

      var dados = {
        _subject: 'Novo contato pelo site · LG Mobilidade Urbana',
        _replyto: valor('email'),
        _gotcha: '',
        nome: valor('nome'),
        cargo: valor('cargo'),
        organizacao: valor('orgao'),
        tipo: valor('tipo'),
        email: valor('email'),
        telefone: valor('telefone'),
        mensagem: 'Assunto: ' + valor('assunto') + '\n\n' + valor('mensagem'),
        consentimento: form.elements.consentimento && form.elements.consentimento.checked ? 'sim, autorizou o uso dos dados só para a LG responder a este contato' : ''
      };
      var ctrl = 'AbortController' in window ? new AbortController() : null;
      var prazo = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(dados),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          clearTimeout(prazo);
          var erros = j.errors || [];
          var falhou = !r.ok || j.error || erros.length;
          var faltou = erros.some(function (x) { return x.code === 'REQUIRED_FIELD_MISSING'; });
          termina(!falhou, faltou ? 'faltou' : 'servico');
        });
      }).catch(function () {
        clearTimeout(prazo);
        termina(false, 'rede');
      });
    });
    var tenta = vistaErro.querySelector('[data-tenta]');
    if (tenta) tenta.addEventListener('click', function () { mostraVista(vistaForm); botao.focus(); });
  }

  var contadores = Array.prototype.slice.call(document.querySelectorAll('[data-conta]'));
  if (!calmo && contadores.length && 'IntersectionObserver' in window) {
    var conta = function (el) {
      var alvo = +el.dataset.conta, suf = el.dataset.sufixo || '', t0 = null, dur = 1400;
      el.textContent = '0' + suf;
      var quadro = function (t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(alvo * e) + suf;
        if (p < 1) requestAnimationFrame(quadro);
      };
      requestAnimationFrame(quadro);
    };
    var ioConta = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { conta(e.target); ioConta.unobserve(e.target); } });
    }, { threshold: 0.6 });
    contadores.forEach(function (el) { ioConta.observe(el); });
  }

  var faixa = document.querySelector('.bm-troca');
  if (faixa && !calmo) {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented) return;
      var a = e.target.closest('a[href]');
      if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.origin !== location.origin || a.protocol !== location.protocol) return;
      if (a.pathname === location.pathname) return;
      if (!/\.html$|\/$/.test(a.pathname)) return;
      e.preventDefault();
      try { sessionStorage.setItem('bm-troca', '1'); } catch (err) {}
      faixa.className = 'bm-troca entra';
      setTimeout(function () { location.href = a.href; }, 480);
    });
    var veio = false;
    try { veio = sessionStorage.getItem('bm-troca'); sessionStorage.removeItem('bm-troca'); } catch (err) {}
    if (veio) {
      faixa.className = 'bm-troca reset entra';
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        faixa.className = 'bm-troca sai';
        setTimeout(function () { faixa.className = 'bm-troca'; }, 520);
      }); });
    }
    window.addEventListener('pageshow', function (e) { if (e.persisted) faixa.className = 'bm-troca'; });
  }
})();
