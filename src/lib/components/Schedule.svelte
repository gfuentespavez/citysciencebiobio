<script>
  import { onMount } from 'svelte';

  const events = [
    {
      time: '18:30 – 18:45',
      title: 'Acreditación y bienvenida',
      people: []
    },
    {
      time: '18:45 – 18:50',
      title: 'Palabras de inicio',
      people: [
        { name: 'Fernando Pérez', role: 'Director Principal, City Lab Biobío' },
        { name: 'Helen Martín', role: 'Consejera Nacional, Cámara Chilena de la Construcción' }
      ]
    },
    {
      time: '18:50 – 19:00',
      title: 'Video City Lab Biobío: cuatro años de ciencia de ciudad',
      people: []
    },
    {
      time: '19:00 – 19:30',
      title: 'Palabras organizadores',
      people: [
        { name: 'Jacqueline Sepúlveda', role: 'Rectora, Universidad de Concepción' },
        { name: 'Sergio Giacaman', role: 'Gobernador Regional del Biobío' },
        { name: 'Alfredo Echavarría', role: 'Presidente Nacional, CChC' },
        { name: 'Patricio Donoso', role: 'Presidente Directorio, Corporación Ciudades' }
      ]
    },
    {
      time: '19:30 – 19:45',
      title: 'Presentación: Ciencia urbana del MIT Media Lab',
      people: [
        { name: 'Naroa Coretti', role: 'Research Scientist, MIT Media Lab' }
      ]
    },
    {
      time: '19:45 – 20:15',
      title: 'Presentación y recorrido: Tecnología urbana con impacto',
      people: [
        { name: 'Fernando Pérez', role: 'Director Principal, City Lab Biobío' },
        { name: 'Marcela Martínez', role: 'Directora de Estudios, City Lab Biobío' }
      ],
    },
    {
      time: '20:15 – 20:20',
      title: 'Palabras auspiciadores + Inicio cóctel',
      people: []
    }
  ];

  let headerEl, badgeEl, speakerEl, venueEl;
  let tlItemEls = [];

  let headerP = 0, badgeP = 0, speakerP = 0, venueP = 0;
  let tlPs = events.map(() => 0);

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function getP(el, threshold = 0.88) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return easeOut(Math.max(0, Math.min(1, 1 - rect.top / (window.innerHeight * threshold))));
  }

  onMount(() => {
    let rafId;
    function tick() {
      headerP  = getP(headerEl,  0.9);
      badgeP   = getP(badgeEl,   0.92);
      speakerP = getP(speakerEl, 0.88);
      venueP   = getP(venueEl,   0.92);
      tlPs = tlItemEls.map(el => getP(el, 0.95));
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  });
</script>

<section id="programa" class="section-padding">
  <div class="container">

    <div
      class="header"
      bind:this={headerEl}
      style="opacity:{headerP}; transform: translateY({(1 - headerP) * 32}px)"
    >
      <p class="section-label">● Programa actividad</p>
      <h2 class="section-title">Lanzamiento</h2>
    </div>

    <div class="layout">
      <!-- Timeline -->
      <div class="timeline-wrap">

        <div class="timeline">
          {#each events as ev, i}
            <div
              class="tl-item"
              bind:this={tlItemEls[i]}
              style="opacity:{tlPs[i]}; transform: translateX({(1 - tlPs[i]) * -48}px)"
            >
              <div class="tl-connector">
                <div class="tl-dot"></div>
                {#if i < events.length - 1}<div class="tl-line"></div>{/if}
              </div>
              <div class="tl-content">
                <span class="tl-time">{ev.time}</span>
                <h3 class="tl-title">{ev.title}</h3>
                {#if ev.people.length}
                  <div class="tl-people">
                    {#each ev.people as p}
                      <div class="person">
                        <span class="person-name">{p.name}</span>
                        <span class="person-role">{p.role}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
                {#if ev.items}
                  <ul class="tl-items">
                    {#each ev.items as item}
                      <li>● {item}</li>
                    {/each}
                  </ul>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Speaker card -->
      <div class="speaker-wrap">
        <p class="section-label" style="margin-bottom: 1.5rem">Ponente destacada</p>
        <div
          class="speaker-card glass"
          bind:this={speakerEl}
          style="opacity:{speakerP}; transform: translateX({(1 - speakerP) * 56}px)"
        >
          <div class="speaker-img-wrap">
            <img
              src="https://dam-prod.media.mit.edu/thumb/2026/03/26/NaroaCoretti(2).jpg.800x800.jpg"
              alt="Naroa Coretti — placeholder"
              loading="lazy"
            />
            <div class="speaker-img-overlay"></div>
          </div>
          <div class="speaker-info">
            <h3 class="speaker-name yellow">Naroa Coretti</h3>
            <p class="speaker-title">Research Scientist, Ph.D</p>
            <p class="speaker-subtitle">Experta global en movilidad y transporte del MIT Media Lab</p>
            <p class="speaker-bio">
              Su trabajo destaca en el campo de la movilidad urbana, creando modos
              de transporte más sostenibles, como en su proyecto de Bicicleta
              Autónoma con el MIT.
            </p>
            <div class="speaker-tag glass">
              <span><a href="https://www.media.mit.edu/people/naroa/overview/" target="_blank" rel="noopener noreferrer">MIT Media Lab</a></span>
            </div>
          </div>
        </div>

        <!-- Venue -->
        <div
          class="venue-card glass"
          bind:this={venueEl}
          style="opacity:{venueP}; transform: translateY({(1 - venueP) * 32}px)"
        >
          <p class="section-label">Lugar</p>
          <h4 class="venue-name">Biblioteca Central</h4>
          <p class="venue-sub">Universidad de Concepción</p>
          <p class="venue-city">Concepción, Chile</p>
          <div class="venue-img-wrap">
            <img
              src="https://assets.tvu.cl/2022/05/biblioteca-central-udec-850x400.jpeg"
              alt="Universidad de Concepción — placeholder"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

<style>
  .header {
    margin-bottom: 3.5rem;
    will-change: transform, opacity;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: start;
  }

  @media (min-width: 900px) {
    .layout {
      grid-template-columns: 1fr 380px;
    }
  }

  /* Date badge */
  .date-badge {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    background: var(--yellow);
    border-radius: 50%;
    color: #0a0a0a;
    margin-bottom: 2rem;
    will-change: transform, opacity;
    transform-origin: center center;
  }

  .day { font-size: 1.6rem; font-weight: 700; line-height: 1; }
  .month { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .hour { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

  /* Timeline */
  .timeline { display: flex; flex-direction: column; }

  .tl-item {
    display: grid;
    grid-template-columns: 24px 1fr;
    gap: 1rem;
    padding-bottom: 2rem;
    will-change: transform, opacity;
  }

  .tl-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4px;
  }

  .tl-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--yellow);
    border: 2px solid #0a0a0a;
    outline: 2px solid var(--yellow);
    flex-shrink: 0;
  }

  .tl-line {
    width: 1.5px;
    flex: 1;
    background: rgba(245, 197, 24, 0.2);
    margin-top: 6px;
  }

  .tl-time {
    display: inline-flex;
    align-items: center;
    background: rgba(245, 197, 24, 0.12);
    border: 1px solid rgba(245, 197, 24, 0.2);
    color: var(--yellow);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    letter-spacing: 0.04em;
  }

  .tl-title {
    font-size: 0.98rem;
    font-weight: 600;
    color: #fff;
    line-height: 1.4;
    margin-bottom: 0.75rem;
  }

  .tl-people {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .person {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    align-items: baseline;
  }

  .person-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
  }

  .person-role {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.45);
  }

  .tl-items {
    list-style: none;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .tl-items li {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.5);
  }

  /* Speaker */
  .speaker-card {
    overflow: hidden;
    margin-bottom: 1.5rem;
    will-change: transform, opacity;
  }

  .speaker-img-wrap {
    position: relative;
    height: 300px;
  }

  .speaker-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 700%;
    filter: grayscale(20%);
  }

  .speaker-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%);
  }

  .speaker-info {
    padding: 1.5rem;
  }

  .speaker-name {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .speaker-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(255,255,255,0.75);
    margin-bottom: 0.15rem;
  }

  .speaker-subtitle {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.45);
    margin-bottom: 1rem;
  }

  .speaker-bio {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.65;
    margin-bottom: 1rem;
  }

  .speaker-tag {
    display: inline-block;
    padding: 0.3rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--yellow);
    border-radius: var(--radius-sm);
  }
  .speaker-tag a {
    color: inherit;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
    border-radius: var(--radius-sm);
    padding: 0.3rem 0.75rem;
    margin: -0.3rem -0.75rem;
    display: inline-block;
  }
  .speaker-tag a:hover {
    background: #ffcc05;
    color: #1a1a1a;
  }

  /* Venue */
  .venue-card {
    padding: 1.5rem;
    overflow: hidden;
    will-change: transform, opacity;
  }

  .venue-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.25rem;
  }

  .venue-sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.6);
    margin-bottom: 0.15rem;
  }

  .venue-city {
    font-size: 0.82rem;
    color: var(--yellow);
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .venue-img-wrap img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    filter: brightness(0.75);
  }
</style>
