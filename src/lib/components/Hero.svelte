<script>
  import { onMount } from 'svelte';

  let canvas;
  let animId;
  let pinEl;
  let heroEl;
  let barWrap;
  let scrollRaf;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    let elements = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      build();
    }

    function build() {
      elements = [];
      const count = Math.floor((w * h) / 8000);
      for (let i = 0; i < count; i++) {
        const isYellow = Math.random() > 0.45;
        const isDot = Math.random() > 0.55;
        elements.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: 12 + Math.random() * 55,
          isDot,
          color: isYellow ? '#f5c518' : '#666',
          baseAlpha: 0.15 + Math.random() * 0.55,
          speed: 0.0008 + Math.random() * 0.002,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.012;
      for (const el of elements) {
        const alpha = el.baseAlpha * (0.45 + 0.55 * Math.sin(t * el.speed * 100 + el.phase));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = el.color;
        ctx.strokeStyle = el.color;
        if (el.isDot) {
          ctx.beginPath();
          ctx.arc(el.x, el.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(el.x, el.y);
          ctx.lineTo(el.x + el.len, el.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    // Scroll-driven reveal + fade for the top bar.
    // As user scrolls: reveals L→R over first 28 vh, then drifts right and fades
    // out over the next 60 vh so it's gone before About reaches the top.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let barEls = [];

    function barTick() {
      const pinRect  = pinEl.getBoundingClientRect();
      const heroRect = heroEl.getBoundingClientRect();
      const ih       = window.innerHeight;

      // Reveal element-by-element as user scrolls through the pin zone.
      if (!reducedMotion && barEls.length) {
        const revealP    = Math.max(0, Math.min(1, -pinRect.top / ih));
        const visible    = Math.ceil(revealP * barEls.length);
        barEls.forEach((el, i) => {
          // Remove inline opacity to let CSS pulse animation take over;
          // keep '0' for not-yet-revealed elements.
          el.style.opacity = i < visible ? '' : '0';
        });
      }

      // Fade + drift right once the hero unsticks and starts scrolling away.
      const fadeP = Math.max(0, Math.min(1, -heroRect.top / (ih * 0.6)));
      barWrap.style.opacity   = String(1 - fadeP);
      barWrap.style.transform = `translateX(${fadeP * 8}%)`;
      scrollRaf = requestAnimationFrame(barTick);
    }
    scrollRaf = requestAnimationFrame(barTick);

    // Fetch and inline the SVG so individual elements are accessible.
    // After 180° rotation the highest SVG Y maps to visual top — sort descending.
    fetch('/assets/barra.svg')
      .then(r => r.text())
      .then(markup => {
        barWrap.innerHTML = markup;
        const svgEl = barWrap.querySelector('svg');
        Object.assign(svgEl.style, {
          display: 'block', width: '100%', height: 'auto',
          transform: 'rotate(180deg)',
        });
        const midY = el => el.tagName === 'line'
          ? (parseFloat(el.getAttribute('y1')) + parseFloat(el.getAttribute('y2'))) / 2
          : parseFloat(el.getAttribute('cy'));
        barEls = [...svgEl.querySelectorAll('line, circle')]
          .sort((a, b) => midY(b) - midY(a));
        if (!reducedMotion) barEls.forEach(el => { el.style.opacity = '0'; });
      });

    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(scrollRaf);
      ro.disconnect();
    };
  });
</script>

<div class="hero-pin" bind:this={pinEl}>
<section id="inicio" class="hero" bind:this={heroEl}>
  <div class="barra-wrap" bind:this={barWrap}></div>

  <canvas bind:this={canvas} class="circuit"></canvas>

  <div class="hero-overlay"></div>

  <div class="container hero-content">
    <div class="eyebrow">
      <span class="pill pill-outline pill-dot">Tecnología urbana con impacto</span>
    </div>

    <img src="https://d26q11cgz8q0ri.cloudfront.net/2026/05/28152803/logo-scaled.png" alt="City Science Biobío 2026" class="title" />

    <p class="tagline">
      City Lab Biobío expone <strong>4 años de innovación</strong> en la ciudad
    </p>

    <div class="event-info">
      <div class="event-meta">
        <span>15 al 18 de junio, 2026</span>
      </div>
      <div class="event-meta">
        <span>Biblioteca Central, Universidad de Concepción</span>
      </div>
    </div>

    <div class="hero-ctas">
      <a href="#programa" class="btn-primary">Ver programa</a>
      <a href="#proyectos" class="btn-secondary">Conocer proyectos</a>
    </div>
  </div>

  <div class="scroll-hint">
    <span></span>
  </div>
</section>
</div>

<style>
  /* Tall wrapper gives scroll space while the hero is pinned.
     120 vh of travel: reveal completes at 100 vh, 20 vh buffer before release. */
  .hero-pin {
    height: 220vh;
  }

  .hero {
    position: sticky;
    top: 0;
    height: 100svh;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: #0a0a0a;
  }

  .barra-wrap {
    position: absolute;
    /* Offset the SVG's transparent top strip (clipped bottom after 180° rotate):
       116.36 / 2640.64 * 100vw ≈ 4.41vw */
    top: -4.41vw;
    left: 0;
    width: 100%;
    z-index: 3;
    pointer-events: none;
    will-change: transform, opacity;
  }

  .circuit {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 70% 60% at 65% 50%, transparent 0%, rgba(10,10,10,0.6) 60%, rgba(10,10,10,0.95) 100%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    padding-top: 0;
    padding-bottom: 4rem;
    max-width: 760px;
  }

  .eyebrow {
    margin-bottom: 2rem;
  }

  .title {
    height: clamp(80px, 18vw, 180px);
    width: auto;
    max-width: 100%;
    object-fit: contain;
    object-position: left center;
    margin-bottom: 1.5rem;
    display: block;
  }

  .tagline {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2rem;
    max-width: 500px;
  }

  .tagline strong {
    color: #fff;
  }

  .event-info {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 2.5rem;
  }

  .event-meta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.65);
  }

  .hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    padding: 0.85rem 2rem;
    background: var(--yellow);
    color: #0a0a0a;
    font-weight: 700;
    font-size: 0.95rem;
    border-radius: var(--radius-full);
    transition: background 0.2s, transform 0.2s;
  }

  .btn-primary:hover {
    background: #ffcc00;
    transform: translateY(-2px);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 0.85rem 2rem;
    background: var(--glass-bg);
    color: #fff;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }

  .btn-secondary:hover {
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-yellow);
    transform: translateY(-2px);
  }

  .scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .scroll-hint span {
    display: block;
    width: 1.5px;
    height: 50px;
    background: linear-gradient(to bottom, var(--yellow), transparent);
    animation: scroll-line 2s ease-in-out infinite;
    margin: 0 auto;
  }

  @keyframes scroll-line {
    0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
    50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
    100% { opacity: 0; transform: scaleY(1); transform-origin: bottom; }
  }
</style>
