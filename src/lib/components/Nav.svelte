<script>
  import { onMount } from 'svelte';
  let scrolled = false;
  let menuOpen = false;

  const links = [
    { href: '#quienes', label: 'Sobre Nosotros' },
    { href: '#proyectos', label: 'Proyectos' },
    { href: '#programa', label: 'Lanzamiento' },
    { href: '#agenda', label: 'Expo' },
  ];

  onMount(() => {
    const handler = () => { scrolled = window.scrollY > 40; };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  });

  function close() { menuOpen = false; }
</script>

<nav class:scrolled>
  <div class="container nav-inner">
    <a href="#inicio" class="logo" on:click={close}>
      <img src="https://d26q11cgz8q0ri.cloudfront.net/2025/09/25000650/LOGO-CLBB-ORIGINAL-BLANCO-APAISADO.png" alt="City Lab Biobío" class="logo-city" />
      <span class="logo-name">City Lab Biobío</span>
    </a>

    <button class="hamburger" aria-label="Menú" on:click={() => menuOpen = !menuOpen}>
      <span class:open={menuOpen}></span>
      <span class:open={menuOpen}></span>
      <span class:open={menuOpen}></span>
    </button>

    <ul class="nav-links" class:open={menuOpen}>
      {#each links as link}
        <li><a href={link.href} on:click={close}>{link.label}</a></li>
      {/each}
    </ul>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1.25rem 0;
    transition: background 0.4s, padding 0.4s, border-color 0.4s;
    border-bottom: 1px solid transparent;
  }

  nav.scrolled {
    background: rgba(10, 10, 10, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 0.85rem 0;
    border-bottom-color: rgba(255, 255, 255, 0.07);
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .logo-city {
    height: 36px;
    width: auto;
    display: block;
  }

  .logo-name {
    font-family: var(--font);
    font-size: 1rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 1);
    white-space: nowrap;
    transition: color 0.2s;
  }

  .logo:hover .logo-name {
    color: #ffcc05;
  }


  .nav-links {
    display: none;
    list-style: none;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-links a {
    padding: 0.5rem 0.85rem;
    font-size: 0.88rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    border-radius: var(--radius-sm);
    transition: color 0.2s, background 0.2s;
  }

  .nav-links a:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }

  .nav-links a.nav-cta {
    background: var(--yellow);
    color: #0a0a0a;
    font-weight: 600;
    padding: 0.5rem 1.1rem;
  }

  .nav-links a.nav-cta:hover {
    background: #ffcc00;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }

  .hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #fff;
    border-radius: 2px;
    transition: transform 0.3s, opacity 0.3s;
  }

  .hamburger span:nth-child(1).open {
    transform: translateY(7px) rotate(45deg);
  }

  .hamburger span:nth-child(2).open {
    opacity: 0;
  }

  .hamburger span:nth-child(3).open {
    transform: translateY(-7px) rotate(-45deg);
  }

  @media (min-width: 768px) {
    .hamburger { display: none; }
    .nav-links { display: flex; }
  }

  @media (max-width: 767px) {
    .nav-links.open {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(10, 10, 10, 0.97);
      backdrop-filter: blur(20px);
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem;
    }

    .nav-links.open a {
      font-size: 1.2rem;
      padding: 0.75rem 2rem;
    }
  }
</style>
