/* ==========================================================
   motion.js — shared motion layer for the portfolio
   ----------------------------------------------------------
   Reference: originkit.dev (animated component library).
   The effects below are re-implemented from scratch in plain
   JavaScript — no dependencies, no build step — and tuned for
   this site's editorial dark-green system.

   Effect            OriginKit reference     Default targets
   ----------------  ----------------------  ---------------------------------
   reveal (words)    Smoky Text              h2 inside .reveal, .sec-title
   scramble          Scramble Text           .cs-hero h1, .hero h1
   grid              Blinking Squares        .cs-hero, .hero (canvas backdrop)
   pixel             Pixel Reveal            .cs-cover img, .full-img img, .gallery img
   spot              Spotlight Text          .stat, .persona, .kqs-card, .cs-meta > div, .callout
   dh                Direction Hover         .nav-links a, .footer-links a
   weight            Dynamic Weight          .next-project h2
   tilt              Blur Carousel (press)   .cs-cover, .full-img
   magnetic          —                       .btn, .btn-ghost, .nav-cta
   count             —                       .stat b

   Opt in on any element with data-motion="name name…".
   Opt out of everything inside a subtree with data-motion="off".
   Every effect honours prefers-reduced-motion and pauses off-screen.
   ========================================================== */
(() => {
  'use strict';

  const doc = document;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ACCENT = [143, 214, 181];
  const SAND = [230, 222, 142];
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  // Collect targets: default selector plus explicit data-motion opt-ins, minus opt-outs.
  const pick = (name, selector) => {
    const set = new Set(doc.querySelectorAll(selector));
    doc.querySelectorAll('[data-motion~="' + name + '"]').forEach((el) => set.add(el));
    return [...set].filter((el) => !el.closest('[data-motion~="off"]'));
  };

  /* ---------- Mobile burger ---------- */
  const navBurger = doc.querySelector('.nav-burger');
  const navPanel = doc.querySelector('.nav-links');
  if (navBurger && navPanel) {
    const setOpen = (open) => {
      navPanel.classList.toggle('open', open);
      navBurger.classList.toggle('open', open);
      navBurger.setAttribute('aria-expanded', String(open));
      doc.body.style.overflow = open ? 'hidden' : '';
    };
    navBurger.addEventListener('click', () => setOpen(!navPanel.classList.contains('open')));
    navPanel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  /* ---------- Word splitter (keeps inline children such as <em>) ---------- */
  const splitWords = (el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.nodeValue.split(/(\s+)/);
          if (parts.length === 1 && !parts[0].trim()) return;
          const frag = doc.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(p)); return; }
            const s = doc.createElement('span');
            s.className = 'w';
            s.style.setProperty('--wi', i++);
            s.textContent = p;
            frag.appendChild(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && !child.classList.contains('w')) {
          walk(child);
        }
      });
    };
    walk(el);
    return i;
  };

  /* ---------- Scroll reveal (blur in/out with scroll) ---------- */
  const reveals = [...doc.querySelectorAll('.reveal')];
  if (reveals.length) {
    reveals.forEach((el) => {
      const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains('reveal')) : [el];
      el.style.setProperty('--stagger', (sibs.indexOf(el) % 4) * 0.12 + 's');
    });
    if (!reduce) {
      pick('words', '.reveal h2, h2.reveal, .sec-title.reveal, .reveal .sec-title, .contact h2.reveal').forEach((h) => {
        if (!h.closest('.cs-hero, .hero')) splitWords(h);
      });
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting));
    }, { threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Scramble decode on the page title ---------- */
  const scramble = (el) => {
    const text = el.textContent;
    if (!text.trim()) return;
    const glyphs = 'abcdefghikmnorstuvxz0123456789<>/=+-_';
    const n = text.length;
    const seed = Array.from({ length: n }, () => Math.random());
    const duration = clamp(600 + n * 22, 900, 1700);
    const start = performance.now();
    el.setAttribute('aria-label', text);
    el.classList.add('scrambling');
    const frame = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      let out = '';
      for (let i = 0; i < n; i++) {
        const c = text[i];
        if (/\s/.test(c)) { out += c; continue; }
        const at = (i / n) * 0.72 + seed[i] * 0.28;
        out += t >= at ? c : glyphs[(Math.random() * glyphs.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else { el.textContent = text; el.removeAttribute('aria-label'); el.classList.remove('scrambling'); }
    };
    requestAnimationFrame(frame);
  };
  if (!reduce) pick('scramble', '.cs-hero h1, .hero h1').forEach((el) => {
    if (el.children.length) return; // keep markup like <em> intact
    scramble(el);
  });

  /* ---------- Blinking squares backdrop ---------- */
  const grid = (host) => {
    const c = doc.createElement('canvas');
    c.className = 'motion-grid';
    c.setAttribute('aria-hidden', 'true');
    host.prepend(c);
    const ctx = c.getContext('2d');
    const pitch = 26, size = 3;
    let w = 0, h = 0, cols = 0, rows = 0, cells = [], dpr = 1;
    let cursor = null, running = false, visible = true, last = 0;

    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = Math.round(r.width); h = Math.round(r.height);
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / pitch) + 1; rows = Math.ceil(h / pitch) + 1;
      cells = [];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        cells.push({ x: x * pitch, y: y * pitch, phase: Math.random() * 6.283, speed: 0.35 + Math.random() * 1.1, base: 0.25 + Math.random() * 0.75, warm: Math.random() < 0.08 });
      }
      if (reduce) draw(0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const cell of cells) {
        const fade = 1 - cell.y / h;                     // density thins toward the bottom
        let a = Math.pow(0.5 + 0.5 * Math.sin(t * cell.speed + cell.phase), 3) * 0.55 * cell.base * fade;
        if (cursor) {                                    // cursor halo
          const dx = cell.x - cursor.x, dy = cell.y - cursor.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 170) a += (1 - d / 170) * 0.7;
        }
        if (a < 0.02) continue;
        ctx.fillStyle = rgba(cell.warm ? SAND : ACCENT, Math.min(a, 0.95));
        ctx.fillRect(cell.x, cell.y, size, size);
      }
    };

    const loop = (now) => {
      if (!running) return;
      if (now - last > 33) { last = now; draw(now / 1000); }   // ~30fps is plenty for a twinkle
      requestAnimationFrame(loop);
    };
    const play = () => { if (reduce || running || !visible || doc.hidden) return; running = true; requestAnimationFrame(loop); };
    const pause = () => { running = false; };

    new ResizeObserver(resize).observe(host);
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; visible ? play() : pause(); }).observe(host);
    doc.addEventListener('visibilitychange', () => (doc.hidden ? pause() : play()));
    if (fine) {
      host.addEventListener('pointermove', (e) => { const r = host.getBoundingClientRect(); cursor = { x: e.clientX - r.left, y: e.clientY - r.top }; }, { passive: true });
      host.addEventListener('pointerleave', () => { cursor = null; });
    }
    resize();
    play();
  };
  pick('grid', '.cs-hero, .hero').forEach(grid);

  /* ---------- Pixel reveal on images ---------- */
  const pixelReveal = (img, idx) => {
    if (img.closest('.px-wrap')) return;
    const wrap = doc.createElement('span');
    wrap.className = 'px-wrap';
    const radius = getComputedStyle(img).borderRadius;
    wrap.style.setProperty('--px-radius', radius);
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    const c = doc.createElement('canvas');
    c.className = 'px-cover';
    c.setAttribute('aria-hidden', 'true');
    wrap.appendChild(c);
    const ctx = c.getContext('2d');
    const dir = ['right', 'down', 'left', 'up'][idx % 4];
    let started = false;

    const paintSolid = () => {
      const r = wrap.getBoundingClientRect();
      c.width = Math.max(1, Math.round(r.width)); c.height = Math.max(1, Math.round(r.height));
      ctx.fillStyle = '#0a2d25';
      ctx.fillRect(0, 0, c.width, c.height);
    };
    paintSolid();

    const run = () => {
      if (started) return;
      started = true;
      const r = wrap.getBoundingClientRect();
      const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));
      c.width = W; c.height = H;
      const cell = clamp(Math.round(W / 34), 14, 40);
      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const th = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const sweep = dir === 'right' ? x / cols : dir === 'left' ? 1 - x / cols : dir === 'down' ? y / rows : 1 - y / rows;
        th[y * cols + x] = sweep * 0.72 + Math.random() * 0.28;   // ragged, noisy leading edge
      }
      const duration = 1100, start = performance.now();
      const frame = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        const e = easeOut(t) * 1.06;
        ctx.clearRect(0, 0, W, H);
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const v = th[y * cols + x];
          if (v < e) continue;
          const edge = v - e;                              // distance ahead of the sweep
          if (edge < 0.12) {
            ctx.fillStyle = rgba(ACCENT, 0.9 - edge * 5);   // glowing leading edge
            ctx.fillRect(x * cell, y * cell, cell, cell);
            ctx.fillStyle = '#0a2d25';
            ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
          } else {
            ctx.fillStyle = '#0a2d25';
            ctx.fillRect(x * cell, y * cell, cell + 1, cell + 1);
          }
        }
        if (t < 1) requestAnimationFrame(frame);
        else { wrap.classList.add('px-done'); setTimeout(() => c.remove(), 500); }
      };
      requestAnimationFrame(frame);
    };

    let inView = false;
    const ready = () => img.complete || img.readyState >= 2;
    const maybe = () => { if (inView && ready()) run(); };
    img.addEventListener('load', maybe);
    img.addEventListener('loadeddata', maybe);
    img.addEventListener('error', run);
    const io = new IntersectionObserver((e) => {
      if (!e[0].isIntersecting) return;
      inView = true; io.disconnect();
      maybe();
      setTimeout(run, 2500);                              // never leave a cover stuck on a slow image
    }, { threshold: 0.2 });
    io.observe(wrap);
  };
  if (!reduce) pick('pixel', '.cs-cover img, .cs-cover video, .full-img img, .gallery img').forEach(pixelReveal);

  /* ---------- Cursor spotlight on cards ---------- */
  if (fine && !reduce) pick('spot', '.stat, .persona, .kqs-card, .cs-meta > div, .callout').forEach((card) => {
    card.classList.add('spot');
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });

  /* ---------- Direction-aware link hover ---------- */
  if (fine && !reduce) pick('dh', '.nav-links a:not(.nav-cta), .footer-links a').forEach((a) => {
    if (a.children.length) return;
    const text = a.textContent;
    a.textContent = '';
    const dh = doc.createElement('span'); dh.className = 'dh';
    const A = doc.createElement('span'); A.className = 'dh-a'; A.textContent = text;
    const B = doc.createElement('span'); B.className = 'dh-b'; B.textContent = text; B.setAttribute('aria-hidden', 'true');
    dh.append(A, B); a.appendChild(dh);
    const edge = (e) => { const r = a.getBoundingClientRect(); return e.clientY < r.top + r.height / 2 ? -1 : 1; };
    const snap = (el, y) => { el.style.transition = 'none'; el.style.transform = `translateY(${y}%)`; void el.offsetHeight; el.style.transition = ''; };
    a.addEventListener('pointerenter', (e) => {
      const d = edge(e);
      snap(B, d * 100);
      B.style.transform = 'translateY(0)';
      A.style.transform = `translateY(${-d * 100}%)`;
    });
    a.addEventListener('pointerleave', (e) => {
      const d = edge(e);
      snap(A, -d * 100);
      A.style.transform = 'translateY(0)';
      B.style.transform = `translateY(${d * 100}%)`;
    });
  });

  /* ---------- Dynamic variable-font weight ---------- */
  if (fine && !reduce) pick('weight', '.next-project h2').forEach((h) => {
    if (h.querySelector('.dw')) return;
    const base = parseInt(getComputedStyle(h).fontWeight, 10) || 700;
    const peak = Math.min(900, base + 200);
    const spans = [];
    const walk = (node) => [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = doc.createDocumentFragment();
        for (const ch of child.nodeValue) {
          if (/\s/.test(ch)) { frag.appendChild(doc.createTextNode(ch)); continue; }
          const s = doc.createElement('span'); s.className = 'dw'; s.textContent = ch;
          spans.push(s); frag.appendChild(s);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === 1) walk(child);
    });
    walk(h);
    let rects = null, tick = false, ev = null;
    const paint = () => {
      tick = false;
      if (!ev) return;
      if (!rects) rects = spans.map((s) => { const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
      spans.forEach((s, i) => {
        const d = Math.hypot(ev.x - rects[i][0], ev.y - rects[i][1]);
        const k = clamp(1 - d / 140, 0, 1);
        s.style.fontVariationSettings = `"wght" ${Math.round(base + (peak - base) * easeOut(k))}`;
      });
    };
    h.addEventListener('pointerenter', () => { rects = null; h.setAttribute('data-weight-live', ''); });
    h.addEventListener('pointermove', (e) => { ev = { x: e.clientX, y: e.clientY }; if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
    h.addEventListener('pointerleave', () => { ev = null; h.removeAttribute('data-weight-live'); spans.forEach((s) => { s.style.fontVariationSettings = `"wght" ${base}`; }); });
  });

  /* ---------- Press tilt on covers ---------- */
  if (fine && !reduce) pick('tilt', '.cs-cover, .full-img').forEach((el) => {
    el.classList.add('tilt');
    let tick = false, ev = null;
    const paint = () => {
      tick = false;
      if (!ev) return;
      const r = el.getBoundingClientRect();
      const px = (ev.x - r.left) / r.width - 0.5, py = (ev.y - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1200px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-3px)`;
    };
    el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));
    el.addEventListener('pointermove', (e) => { ev = { x: e.clientX, y: e.clientY }; if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
    el.addEventListener('pointerleave', () => { ev = null; el.classList.remove('is-tilting'); el.style.transform = ''; });
  });

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) pick('magnetic', '.btn, .btn-ghost, .nav-cta').forEach((el) => {
    el.addEventListener('pointerenter', () => el.classList.add('mag'));
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22, dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
      el.style.transform = `translate(${dx.toFixed(1)}px, ${(dy - 2).toFixed(1)}px)`;
    }, { passive: true });
    el.addEventListener('pointerleave', () => { el.classList.remove('mag'); el.style.transform = ''; });
  });

  /* ---------- Count-up on stat numbers ---------- */
  pick('count', '.stat b').forEach((b) => {
    const m = b.textContent.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
    if (!m) return;
    const [, pre, numStr, post] = m;
    const target = parseFloat(numStr.replace(/,/g, ''));
    const decimals = (numStr.split('.')[1] || '').length;
    const useComma = numStr.includes(',');
    const fmt = (v) => { let s = v.toFixed(decimals); if (useComma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return pre + s + post; };
    if (reduce) return;
    b.textContent = fmt(0);
    b.style.minWidth = '0';
    const io = new IntersectionObserver((e) => {
      if (!e[0].isIntersecting) return;
      io.disconnect();
      const duration = 1200, start = performance.now();
      const frame = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        b.textContent = fmt(target * easeOut(t));
        if (t < 1) requestAnimationFrame(frame); else b.textContent = pre + numStr + post;
      };
      requestAnimationFrame(frame);
    }, { threshold: 0.4 });
    io.observe(b);
  });

  /* ---------- Hero blurs out progressively as it scrolls off ---------- */
  const heroEl = doc.querySelector('.cs-hero > .wrap, .hero > .wrap');
  if (heroEl && !reduce && !heroEl.closest('[data-motion~="off"]')) {
    let tick = false;
    const heroBlur = () => {
      const p = clamp(scrollY / (innerHeight * 0.85), 0, 1);
      heroEl.style.filter = p > 0.005 ? 'blur(' + (p * 18).toFixed(1) + 'px)' : '';
      heroEl.style.opacity = (1 - p * 0.92).toFixed(2);
      heroEl.style.transform = 'translateY(' + (p * -34).toFixed(1) + 'px)';
      tick = false;
    };
    addEventListener('scroll', () => { if (!tick) { requestAnimationFrame(heroBlur); tick = true; } }, { passive: true });
    heroBlur();
  }
})();
