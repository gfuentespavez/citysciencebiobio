<script>
  const invitan = [
    { name: 'Gobierno Regional del Biobío', abbr: 'GORE' },
    { name: 'Corporación Ciudades', abbr: 'CC' },
    { name: 'Cámara Chilena de la Construcción', abbr: 'CChC' }
  ];

  const aliados = [
    { name: 'Universidad de Concepción', abbr: 'UdeC' }
  ];

  const media = [
    { name: 'CNN Chile', note: 'Media partner' },
    { name: 'Infinita', note: 'Programa Mundo' },
    { name: 'El Mercurio', note: 'Regiones' },
    { name: 'Pauta', note: '' },
    { name: 'Tele13 Radio', note: '103.3 FM' },
    { name: 'Radio Udec', note: '' },
    { name: 'El Sur', note: '' },
    { name: 'Cooperativa', note: '' },
    { name: 'La Tercera', note: '' }
  ];
</script>

<section id="aliados" class="section-padding">
  <div class="container">

    <div class="header">
      <p class="section-label">● Organizadores y aliados</p>
      <h2 class="section-title">Quienes hacen<br />posible el evento</h2>
    </div>

    <div class="partners-layout">

      <div class="partner-group">
        <h4 class="group-label">Invitan</h4>
        <div class="logo-row">
          {#each invitan as p}
            <div class="logo-pill glass">
              <span class="abbr yellow">{p.abbr}</span>
              <span class="full-name">{p.name}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="partner-group">
        <h4 class="group-label">Aliados</h4>
        <div class="logo-row">
          {#each aliados as p}
            <div class="logo-pill glass">
              <span class="abbr yellow">{p.abbr}</span>
              <span class="full-name">{p.name}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="partner-group">
        <h4 class="group-label">Cobertura de prensa</h4>
        <div class="media-grid">
          {#each media as m}
            <div class="media-tag glass">
              <span class="media-name">{m.name}</span>
              {#if m.note}<span class="media-note">{m.note}</span>{/if}
            </div>
          {/each}
        </div>
      </div>

    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="https://d26q11cgz8q0ri.cloudfront.net/2025/09/25000650/LOGO-CLBB-ORIGINAL-BLANCO-APAISADO.png" alt="City Lab Biobío" class="fl-clbb" />
          <span class="fl-sep">|</span>
          <p class="footer-tagline">City Lab Biobío — Ciencia de ciudad al sur del mundo</p>
        </div>
      </div>
      <div class="footer-info">
        <p class="footer-event">City Science Biobío 2026</p>
        <p class="footer-date">15 – 18 junio · Concepción</p>
        <p class="footer-venue">Biblioteca Central, Universidad de Concepción</p>
      </div>
    </div>
    <div class="footer-bar">
      <div class="container">
        <p>© 2026 City Lab Biobío. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</section>

<style>
  .header {
    margin-bottom: 3.5rem;
  }

  .partners-layout {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-bottom: 5rem;
  }

  .group-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.35);
    margin-bottom: 1rem;
  }

  .logo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .logo-pill {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.65rem 1.1rem;
    border-radius: var(--radius-full);
  }

  .abbr {
    font-size: 1rem;
    font-weight: 700;
  }

  .full-name {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.65);
    font-weight: 500;
  }

  .media-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .media-tag {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    transition: background 0.2s;
  }

  .media-tag:hover {
    background: var(--glass-bg-hover);
  }

  .media-name {
    font-size: 0.88rem;
    font-weight: 600;
    color: rgba(255,255,255,0.8);
  }

  .media-note {
    font-size: 0.72rem;
    color: var(--yellow);
    font-weight: 500;
  }

  /* Footer */
  .footer {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding-top: 3rem;
  }

  .footer-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    justify-content: space-between;
    padding-bottom: 3rem;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }

  .fl-clbb {
    height: 2rem;
    width: auto;
    display: block;
  }

  .fl-sep {
    color: rgba(255,255,255,0.2);
    font-size: 1.2rem;
  }

  .fl-mit {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.45);
    font-weight: 500;
  }

  .footer-tagline {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.4);
    max-width: 320px;
    line-height: 1.5;
  }

  .footer-event {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.35rem;
  }

  .footer-date {
    font-size: 0.88rem;
    color: var(--yellow);
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .footer-venue {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.4);
  }

  .footer-bar {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 1.25rem 0;
    font-size: 0.78rem;
    color: rgba(255,255,255,0.25);
  }
</style>
