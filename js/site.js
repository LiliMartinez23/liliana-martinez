(() => {
  'use strict';

  const palettes = [
    { id: 6, name: 'Cream & midnight', primary: '#fff9f1', secondary: '#16222d', accent: '#9a694e' }
  ];
  const storageKey = 'liliana-palette';
  const localPages = new Set(['index.html', 'about.html', 'projects.html', 'blogs.html', 'credits.html']);
  const root = document.documentElement;
  let currentPalette = palettes[0];
  let opener = null;

  function luminance(hex) {
    const channels = hex.slice(1).match(/../g).map(channel => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }

  function contrast(first, second) {
    const a = luminance(first);
    const b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }

  function savedPalette() {
    let saved;
    try { saved = localStorage.getItem(storageKey); } catch (_) { /* Storage is optional. */ }
    const requested = new URLSearchParams(window.location.search).get('palette');
    return palettes.find(palette => palette.id === Number(requested || saved)) || palettes[0];
  }

  function renderHeader() {
    const mount = document.getElementById('site-header');
    if (!mount) return;
    const page = document.body.dataset.page;
    const navigation = [
      ['home', 'index.html', 'Home'],
      ['about', 'about.html', 'About'],
      ['projects', 'projects.html', 'Projects'],
      ['blogs', 'blogs.html', 'Blogs']
    ];
    mount.innerHTML = `<header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Liliana.dev home">liliana<span>.dev</span></a>
        <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-navigation"><span aria-hidden="true">☰</span><span>Menu</span></button>
        <nav class="site-nav" id="main-navigation" aria-label="Main navigation">${navigation.map(([key, href, label]) => `<a href="${href}"${page === key ? ' aria-current="page" class="active"' : ''}>${label}</a>`).join('')}</nav>
        <a class="header-contact" href="mailto:lilianafinona3@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a>
      </div>
    </header>`;
    const menuButton = mount.querySelector('.menu-toggle');
    const nav = mount.querySelector('.site-nav');
    function closeMenu() {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    }
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(expanded));
      menuButton.setAttribute('aria-label', `${expanded ? 'Close' : 'Open'} navigation`);
      nav.classList.toggle('is-open', expanded);
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  function renderFooter() {
    const mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.innerHTML = `<footer class="site-footer">
      <div class="container footer-main">
        <a class="brand" href="index.html">liliana<span>.dev</span></a>
        <nav class="footer-links" aria-label="Connect with Liliana">
          <a href="https://github.com/LiliMartinez23">GitHub <span aria-hidden="true">↗</span></a>
          <a href="https://www.linkedin.com/in/liliana-martinez-/">LinkedIn <span aria-hidden="true">↗</span></a>
          <a href="mailto:lilianafinona3@gmail.com">Email <span aria-hidden="true">↗</span></a>
          <a href="Resume-Liliana-Martinez.pdf">Resume <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
      <div class="container footer-bottom"><p>© 2026 Liliana Martinez</p><a href="credits.html">About the project visuals</a></div>
    </footer>`;
  }

  function updateLocalLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const target = new URL(href, window.location.href);
      const filename = target.pathname.split('/').pop();
      if (target.origin === window.location.origin && localPages.has(filename)) {
        target.searchParams.set('palette', currentPalette.id);
        link.setAttribute('href', `${filename}${target.search}${target.hash}`);
      }
    });
  }

  function applyPalette(palette, updateHistory = true) {
    currentPalette = palette;
    root.dataset.palette = String(palette.id);
    root.style.setProperty('--primary', palette.primary);
    root.style.setProperty('--secondary', palette.secondary);
    root.style.setProperty('--accent', palette.accent);
    // The two neutral roles are only used as readable text on an accent fill.
    const neutralRoles = { dark: '#000000', light: '#ffffff' };
    const onAccent = contrast(palette.accent, neutralRoles.dark) >= contrast(palette.accent, neutralRoles.light) ? neutralRoles.dark : neutralRoles.light;
    root.style.setProperty('--on-accent', onAccent);
    root.style.setProperty('--accent-ink', contrast(palette.accent, palette.primary) >= 4.5 ? palette.accent : palette.secondary);
    root.style.setProperty('--accent-on-secondary', contrast(palette.accent, palette.secondary) >= 4.5 ? palette.accent : palette.primary);
    root.style.setProperty('--line', 'color-mix(in srgb, var(--secondary) 25%, var(--primary))');
    root.style.setProperty('--soft', 'color-mix(in srgb, var(--secondary) 6%, var(--primary))');
    root.style.colorScheme = luminance(palette.primary) < 0.2 ? 'dark' : 'light';
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = palette.primary;

    try { localStorage.setItem(storageKey, String(palette.id)); } catch (_) { /* URL persistence remains available. */ }
    if (updateHistory) {
      const url = new URL(window.location.href);
      url.searchParams.set('palette', palette.id);
      try { window.history.replaceState(null, '', url); } catch (_) { /* Local file previews may restrict history. */ }
    }
    updateLocalLinks();
  }

  function openProject(id, trigger) {
    const dialog = document.getElementById(`project-${id}`);
    if (!dialog || dialog.tagName !== 'DIALOG') return;
    opener = trigger || document.querySelector(`[data-open-project="${id}"]`);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }

  function setupProjectDialogs() {
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-open-project]');
      if (trigger) openProject(trigger.dataset.openProject, trigger);
      const close = event.target.closest('[data-close-dialog]');
      if (close) close.closest('dialog')?.close();
    });
    document.querySelectorAll('dialog[id^="project-"]').forEach(dialog => {
      dialog.addEventListener('keydown', event => {
        if (event.key !== 'Tab' || !dialog.open) return;
        const focusable = Array.from(dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(element => {
          const style = window.getComputedStyle(element);
          return element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') && element.getClientRects().length > 0 && style.visibility !== 'hidden' && style.visibility !== 'collapse';
        });
        if (!focusable.length) {
          event.preventDefault();
          if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
          dialog.focus();
          return;
        }
        const index = focusable.indexOf(document.activeElement);
        if (index === -1 || (!event.shiftKey && index === focusable.length - 1) || (event.shiftKey && index === 0)) {
          event.preventDefault();
          const target = index === -1 || !event.shiftKey ? focusable[0] : focusable[focusable.length - 1];
          target.focus();
        }
      });
      dialog.addEventListener('close', () => {
        document.body.classList.remove('dialog-open');
        if (opener?.isConnected) opener.focus({ preventScroll: true });
        opener = null;
      });
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      });
    });
    const projectId = window.location.hash.slice(1);
    if (projectId && document.body.dataset.page === 'projects') openProject(projectId);
  }

  renderHeader();
  renderFooter();
  applyPalette(savedPalette());
  setupProjectDialogs();
  window.addEventListener('popstate', () => applyPalette(savedPalette(), false));
})();
