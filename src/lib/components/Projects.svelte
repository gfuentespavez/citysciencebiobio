<script>
  import { onMount } from 'svelte';

  const projects = [
    {
      logo: 'https://citylabbiobio.cl/wp-content/uploads/2026/05/cityscope_fondo-oscuro.svg',
      name: 'CityScope',
      img: 'https://d26q11cgz8q0ri.cloudfront.net/2026/05/28142328/CLBB-12-scaled.jpg',
      description:
        'Construida con miles de piezas de LEGO, a través de una interfaz física en la que los ciudadanos pueden interactuar con los proyectos, creando más de 100 combinaciones de ciudad cuyos impactos reflejan el carácter de la ciencia de ciudad instalada en Concepción.',
      accent: '#ffcb05'
    },
    {
      logo: 'https://citylabbiobio.cl/wp-content/uploads/2026/05/visor-trafico_fondo-oscuro.svg',
      logoSize: "60px",
      name: 'Visor de tráfico y accidentes',
      sub: 'San Pedro de la Paz',
      img: 'https://d26q11cgz8q0ri.cloudfront.net/2026/05/28142940/01-1-scaled.png',
      description:
        'Con datos de Waze para monitorear tráfico, congestión, velocidades y eventos viales en tiempo real e histórico. Visualiza y realiza consultas dinámicas del tráfico, apoyando el análisis y toma de decisiones en movilidad urbana.',
      accent: '#ffcc05'
    },
    {
      logo: 'https://citylabbiobio.cl/wp-content/uploads/2026/05/cportuaria_fondo-oscuro.svg',
      logoSize: "70px",
      name: 'Ciudad Portuaria',
      sub: 'Talcahuano',
      img: 'https://d26q11cgz8q0ri.cloudfront.net/2026/05/28142349/tablet.png',
      description:
        'En alianza con Puertos de Talcahuano, creamos el primer entorno virtual interactivo para una ciudad portuaria en Latinoamérica. Expandimos las capacidades de análisis, interacción y modelación de escenarios futuros disponible para toda la comunidad.',
      accent: '#ffcc05'
    },
    {
      logo: 'https://citylabbiobio.cl/wp-content/uploads/2026/05/visor-incendios_fondo-oscuro.svg',
      logoSize: "40px",
      name: 'Visor Incendios Forestales',
      img: 'https://d26q11cgz8q0ri.cloudfront.net/2026/05/28142742/01-scaled.png',
      description:
        'En colaboración con Deep-Hub e Imagine-IT, desarrollamos una plataforma para monitorear emergencias y apoyar la toma de decisiones. Integra imágenes satelitales VIIRS (NASA/FIRMS), datos censales, IDE Chile y Waze para evaluar impactos en tiempo real.',
      accent: '#ffcc05'
    },
    {
      logo: 'https://citylabbiobio.cl/wp-content/uploads/2026/05/metropolitan_fondo-oscuro.svg',
      name: 'Metropolitan Scope Biobío',
      sub: '',
      img: 'https://d26q11cgz8q0ri.cloudfront.net/2026/05/28142625/MSB-6-scaled.png',
      description:
        'Visualización urbana a escala metropolitana, integrando grandes volúmenes de datos sobre territorio, movilidad, uso de suelo, demografía, infraestructura e inversión pública. Apoya la planificación y gestión del Gran Concepción basada en evidencia científica.',
      accent: '#ffcc05'
    },
    {
      logo: 'https://citylabbiobio.cl/wp-content/uploads/2026/05/DataScope_blanco.svg',
      name: 'DataScope',
      img: 'https://d26q11cgz8q0ri.cloudfront.net/2026/05/28170425/DataIS-Ckan.png',
      imgPos: '35% center',
      description:
        'Plataforma de inteligencia territorial que integra, organiza y disponibiliza datos urbanos para apoyar el análisis y comprensión del territorio, consolidando información interoperable para fortalecer la planificación, investigación y toma de decisiones.',
      accent: '#ffcc05'
    },
    {
      logo: 'https://d26q11cgz8q0ri.cloudfront.net/2026/05/28163547/Community_blanco-scaled.png',
      name: 'CommunityScope',
      img: 'https://d26q11cgz8q0ri.cloudfront.net/2026/05/28142449/Community-Scope-scaled.png',
      description:
        'Plataforma de experimentación urbana que permite visualizar y analizar ideas ciudadanas para evaluar sus posibles impactos en la ciudad. Apoya el análisis urbano y la toma de decisiones mediante simulación y visualización de escenarios.',
      accent: '#ffcc05'
    }
  ];

  const N = projects.length;          // 7
  const SCROLL_PER_CARD = 1200;        // px of scroll per card transition

  // Stack direction: top-left
  const STACK_X     = -22;   // px left per depth level
  const STACK_Y     = -16;   // px up per depth level
  const SCALE_DECAY = 0.028; // scale drop per depth
  const ALPHA_DECAY = 0.18;  // opacity drop per depth
  const MAX_VISIBLE = 7;     // deepest stack card shown

  let section;
  let progress = 0; // 0–1 through scroll window

  // ─── easing & lerp ───────────────────────────────────────────────────────
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ─── Core animation model ────────────────────────────────────────────────
  //
  // Card 0 starts PRE-SHOWN at center (opacity 1, no entry animation).
  // Progress 0→1 spans N-1 = 6 transitions.
  // Transition k (k = 0..N-2): card k+1 slides in from bottom-right
  // while cards 0..k each shift one level deeper in the stack.
  //
  function computeStyle(i, p) {
    const STEPS = N - 1; // 6
    const scaled = p * STEPS; // 0–6

    // Which transition are we in? (0 to STEPS-1)
    const tr = Math.min(Math.floor(scaled), STEPS - 1);
    // Which card is currently entering? (1 to N-1)
    const entering = tr + 1;
    // Local progress within this transition (0–1)
    const local = Math.min(scaled - tr, 1);
    const t = easeOut(local);

    let tx, ty, sc, op, zi;

    if (i > entering) {
      // ── Upcoming: parked off-screen bottom-right ──
      const dist = i - entering;
      tx = `calc(${58 + dist * 7}vw)`;
      ty = `calc(${36 + dist * 5}vh)`;
      sc = 0.88;
      op = 0;
      zi = i + 1;

    } else if (i === entering) {
      // ── Entering: slides from bottom-right → center ──
      tx = `calc(${lerp(58, 0, t)}vw)`;
      ty = `calc(${lerp(36, 0, t)}vh)`;
      sc = lerp(0.88, 1, t);
      op = Math.min(1, t * 1.8);
      zi = N + 2;

    } else {
      // ── Stacked: shift from depthBefore → depthAfter using same t ──
      // depthBefore = 0 means this card was at center before this transition
      const depthAfter  = entering - i;      // ≥ 1
      const depthBefore = depthAfter - 1;    // ≥ 0

      const px = depthBefore === 0 ? 0 : depthBefore * STACK_X;
      const py = depthBefore === 0 ? 0 : depthBefore * STACK_Y;
      const cx = depthAfter * STACK_X;
      const cy = depthAfter * STACK_Y;

      const prevOp = Math.max(0, 1 - depthBefore * ALPHA_DECAY);
      const currOp = Math.max(0, 1 - depthAfter  * ALPHA_DECAY);

      tx = `${lerp(px, cx, t)}px`;
      ty = `${lerp(py, cy, t)}px`;
      sc = lerp(
        Math.max(0.7, 1 - depthBefore * SCALE_DECAY),
        Math.max(0.7, 1 - depthAfter  * SCALE_DECAY),
        t
      );
      op = depthAfter > MAX_VISIBLE ? 0 : lerp(prevOp, currOp, t);
      zi = Math.max(1, N - depthAfter + 1);
    }

    return (
      `position:absolute;top:50%;left:50%;` +
      `transform:translate(calc(-50% + ${tx}),calc(-50% + ${ty})) scale(${sc});` +
      `opacity:${op};z-index:${zi};will-change:transform;`
    );
  }

  // Reactive card styles — re-runs on every progress change
  $: cardStyles = projects.map((_, i) => computeStyle(i, progress));

  // Which card is visually "front" for the dot indicator
  $: {
    const STEPS = N - 1;
    const scaled = progress * STEPS;
    const tr = Math.min(Math.floor(scaled), STEPS - 1);
    const local = Math.min(scaled - tr, 1);
    // Before halfway through a transition show the current front; after show the entering one
    activeDot = local > 0.5 ? tr + 1 : tr;
  }
  let activeDot = 0;

  // ─── RAF-based scroll tracker (Lenis-safe) ───────────────────────────────
  onMount(() => {
    let rafId;
    function tick() {
      if (section) {
        const rect      = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        if (scrollable > 0) {
          progress = Math.max(0, Math.min(1, -rect.top / scrollable));
        }
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  });
</script>

<section
  id="proyectos"
  bind:this={section}
  style="height: calc(100vh + {(N - 1) * SCROLL_PER_CARD}px); background: var(--bg-2);"
>
  <div class="sticky-wrap">

    <!-- Header ─────────────────────────────────────────────────────────── -->
    <header class="proj-header">
      <h2 class="proj-title">Proyectos</h2>
      <p class="proj-intro">
        Siete herramientas que transforman datos urbanos en decisiones más inteligentes.
      </p>
    </header>

    <!-- Card stage ──────────────────────────────────────────────────────── -->
    <div class="stage">
      {#each projects as p, i}
        <div class="card" style={cardStyles[i]}>
          <div class="card-image">
            <img src={p.img} alt={p.name} loading="lazy" draggable="false" style={p.imgPos ? `object-position:${p.imgPos}` : ''} />
            <div class="img-overlay"></div>
            <img src={p.logo} alt={p.name} class="card-logo" style={p.logoSize ? `height:${p.logoSize}` : ''} />
          </div>

          <div class="card-content" style="--accent:{p.accent}">
            <div class="card-top">
              {#if p.sub}<span class="card-loc">{p.sub}</span>{/if}
            </div>
            <h3 class="card-name" style="color:{p.accent}">{p.name}</h3>
            <p class="card-desc">{p.description}</p>
            <div class="accent-line" style="background:{p.accent}"></div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Progress footer ─────────────────────────────────────────────────── -->
    <footer class="proj-footer">
      <span class="counter">
        <em class="yellow">{String(activeDot + 1).padStart(2, '0')}</em>
        <span class="gray">&nbsp;/&nbsp;{String(N).padStart(2, '0')}</span>
      </span>

      <div class="dots">
        {#each projects as _, i}
          <span
            class="dot"
            class:active={i === activeDot}
            class:seen={i < activeDot}
          ></span>
        {/each}
      </div>

      <span class="hint gray">↓ scroll</span>
    </footer>

  </div>
</section>

<style>
  /* ── Layout ───────────────────────────────────────────────────────────── */
  .sticky-wrap {
    position: sticky;
    top: 0;
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden; /* clips cards entering from off-screen */
  }

  /* ── Header ───────────────────────────────────────────────────────────── */
  .proj-header {
    padding: 5.5rem 2rem 1rem;
    text-align: center;
    z-index: 10;
    pointer-events: none;
  }

  .proj-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700;
    margin-bottom: 0.4rem;
  }

  .proj-intro {
    font-size: 0.98rem;
    color: rgba(255, 255, 255, 0.7);
    max-width: 400px;
    margin: 0 auto;
  }

  /* ── Stage ────────────────────────────────────────────────────────────── */
  .stage {
    position: relative;
    /* All children are position:absolute, so stage has no intrinsic height.
       The grid 1fr allocation gives it the remaining space. */
  }

  /* ── Card ─────────────────────────────────────────────────────────────── */
  .card {
    /* 16:9, constrained so it fits within the stage vertically */
    width: min(86vw, 960px);
    aspect-ratio: 16 / 9;

    display: grid;
    grid-template-columns: 55% 45%;

    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.09);
    box-shadow:
      0 40px 100px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  }

  /* ── Card image side ──────────────────────────────────────────────────── */
  .card-image {
    position: relative;
    overflow: hidden;
  }

  .card-image > img:first-child {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    pointer-events: none;
  }

  .img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      transparent 55%,
      rgba(10, 10, 10, 0.65) 100%
    );
  }

  /* ── Card content side ────────────────────────────────────────────────── */
  .card-content {
    background: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-left: 1px solid rgba(255, 255, 255, 0.06);
    padding: clamp(1rem, 2.5vw, 2rem);
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .card-top {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .card-logo {
    position: absolute;
    top: 1rem;
    left: 1rem;
    height: 45px;
    width: auto;
    max-width: 140px;
    object-fit: contain;
    object-position: left center;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }

  .card-num {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .card-loc {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.38);
  }

  .card-name {
    font-size: clamp(0.95rem, 2vw, 1.4rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .card-desc {
    font-size: clamp(0.68rem, 1vw, 0.84rem);
    color: rgba(255, 255, 255, 0.58);
    line-height: 1.65;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
  }

  .accent-line {
    height: 2px;
    border-radius: 1px;
    width: 36%;
    margin-top: auto;
    opacity: 0.75;
  }

  /* ── Footer / progress ────────────────────────────────────────────────── */
  .proj-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    padding: 0.75rem 2rem 1.5rem;
    z-index: 10;
    pointer-events: none;
  }

  .counter {
    font-size: 0.85rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    min-width: 4rem;
  }

  .counter em {
    font-style: normal;
    font-size: 1rem;
  }

  .dots {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .dot {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.16);
    transition: width 0.3s ease, background 0.3s ease;
  }

  .dot.seen {
    background: rgba(245, 197, 24, 0.4);
  }

  .dot.active {
    width: 20px;
    background: var(--yellow);
  }

  .hint {
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.35;
    min-width: 4rem;
    text-align: right;
  }

  /* ── Mobile ───────────────────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .card {
      grid-template-columns: 1fr;
      grid-template-rows: 45% 55%;
      aspect-ratio: unset;
      width: min(92vw, 400px);
      height: min(75vh, 480px);
    }

    .img-overlay {
      background: linear-gradient(
        to bottom,
        transparent 50%,
        rgba(10, 10, 10, 0.7) 100%
      );
    }

    .hint { display: none; }
  }
</style>
