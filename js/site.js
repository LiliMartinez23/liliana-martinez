(() => {
  'use strict';

  const palettes = [
    { id: 7, name: 'Charcoal & terracotta', primary: '#211f20', secondary: '#e3dac7', accent: '#c56d3f' }
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
    mount.innerHTML = `<header class="mobile-header"><a class="mobile-brand" href="index.html">Liliana Martinez<span aria-hidden="true">.</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="portfolio-sidebar">Menu <span aria-hidden="true">☰</span></button></header>
    <button class="nav-backdrop" type="button" tabindex="-1" aria-hidden="true" hidden></button>
    <aside class="sidebar" id="portfolio-sidebar" aria-label="Site navigation">
      <button class="sidebar-close" type="button" aria-label="Close navigation">×</button>
      <a class="brand" href="index.html" aria-label="Liliana Martinez home"><span class="brand-mark" aria-hidden="true">lm</span><span>Liliana<br>Martinez<span class="brand-dot" aria-hidden="true">.</span></span></a>
      <p class="sidebar-label">PERSONAL PORTFOLIO</p>
      <nav class="site-nav" id="main-navigation" aria-label="Main navigation">${navigation.map(([key, href, label]) => `<a href="${href}"${page === key ? ' aria-current="page"' : ''}>${label}<span aria-hidden="true">↗</span></a>`).join('')}</nav>
      <div class="sidebar-bottom"><p>Web development.<br>Thoughtful data workflows.</p><a href="Resume-Liliana-Martinez.pdf">View resume <span aria-hidden="true">↗</span></a><a href="mailto:lilianafinona3@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a><span class="sidebar-location">San Antonio, Texas</span></div>
    </aside>`;
    const sidebar = mount.querySelector('.sidebar');
    const menuButton = mount.querySelector('.menu-toggle');
    const closeButton = mount.querySelector('.sidebar-close');
    const backdrop = mount.querySelector('.nav-backdrop');
    const mobile = window.matchMedia('(max-width: 760px)');
    function setMenu(open, restoreFocus = false) {
      const expanded = open && mobile.matches;
      menuButton.setAttribute('aria-expanded', String(expanded));
      sidebar.classList.toggle('is-open', expanded);
      sidebar.inert = mobile.matches && !expanded;
      backdrop.hidden = !expanded;
      document.body.classList.toggle('nav-open', expanded);
      document.querySelector('main').inert = expanded;
      const footer = document.getElementById('site-footer');
      if (footer) footer.inert = expanded;
      if (expanded) closeButton.focus();
      else if (restoreFocus) menuButton.focus();
    }
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    closeButton.addEventListener('click', () => setMenu(false, true));
    backdrop.addEventListener('click', () => setMenu(false, true));
    sidebar.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    sidebar.addEventListener('keydown', event => {
      if (!mobile.matches || menuButton.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); }
      if (event.key === 'Tab') {
        const controls = Array.from(sidebar.querySelectorAll('a[href], button')).filter(element => element.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    mobile.addEventListener('change', () => setMenu(false));
    setMenu(false);
  }

  function renderFooter() {
    const mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.innerHTML = `<footer class="site-footer">
      <div class="footer-main"><p>© 2026 Liliana Martinez</p><nav aria-label="Connect with Liliana"><a href="https://github.com/LiliMartinez23">GitHub <span aria-hidden="true">↗</span></a><a href="https://www.linkedin.com/in/liliana-martinez-/">LinkedIn <span aria-hidden="true">↗</span></a><a href="mailto:lilianafinona3@gmail.com">Email <span aria-hidden="true">↗</span></a><a href="Resume-Liliana-Martinez.pdf">Resume <span aria-hidden="true">↗</span></a></nav></div>
      <a class="visual-credits" href="credits.html">About the project visuals</a>
    </footer>`;
  }

  function updateLocalLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const target = new URL(href, window.location.href);
      const filename = target.pathname.split('/').pop();
      if (target.origin === window.location.origin && localPages.has(filename)) {
        target.searchParams.delete('palette');
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
    root.style.setProperty('--on-accent', contrast(palette.accent, palette.primary) >= 4.5 ? palette.primary : onAccent);
    root.style.setProperty('--accent-ink', contrast(palette.accent, palette.primary) >= 4.5 ? palette.accent : palette.secondary);
    root.style.setProperty('--accent-on-secondary', '#d79671');
    root.style.setProperty('--line', '#51463f');
    root.style.setProperty('--soft', '#2a2728');
    root.style.colorScheme = luminance(palette.primary) < 0.2 ? 'dark' : 'light';
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = palette.primary;

    try { localStorage.setItem(storageKey, String(palette.id)); } catch (_) { /* URL persistence remains available. */ }
    if (updateHistory) {
      const url = new URL(window.location.href);
      url.searchParams.delete('palette');
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

  function setupCommunityEvents() {
    document.querySelectorAll('[data-community-events]').forEach(viewer => {
      const tablist = viewer.querySelector('.event-list');
      const links = Array.from(viewer.querySelectorAll('[data-event-link]'));
      const panels = Array.from(viewer.querySelectorAll('[data-event-panel]'));
      const entries = links.map(link => ({
        link,
        panel: panels.find(panel => `#${panel.id}` === link.getAttribute('href'))
      }));
      // Keep every event readable if the markup cannot form a complete tab set.
      if (!tablist || !entries.length || links.length !== panels.length || entries.some(entry => !entry.panel || !entry.link.id)) return;

      tablist.setAttribute('role', 'tablist');
      tablist.setAttribute('aria-orientation', 'vertical');
      entries.forEach(({ link, panel }) => {
        link.setAttribute('role', 'tab');
        link.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', link.id);
        panel.tabIndex = 0;
      });

      function selectEvent(index, focus = false) {
        entries.forEach(({ link, panel }, entryIndex) => {
          const selected = entryIndex === index;
          link.setAttribute('aria-selected', String(selected));
          link.tabIndex = selected ? 0 : -1;
          panel.hidden = !selected;
        });
        if (focus) entries[index].link.focus({ preventScroll: true });
      }

      function selectHashEvent() {
        const index = entries.findIndex(({ panel }) => `#${panel.id}` === window.location.hash);
        if (index !== -1) selectEvent(index);
        return index !== -1;
      }

      entries.forEach(({ link }, index) => {
        link.addEventListener('click', event => {
          event.preventDefault();
          selectEvent(index);
        });
        link.addEventListener('keydown', event => {
          if (event.key === ' ') {
            event.preventDefault();
            selectEvent(index, true);
            return;
          }
          let nextIndex;
          if (event.key === 'ArrowDown') nextIndex = (index + 1) % entries.length;
          else if (event.key === 'ArrowUp') nextIndex = (index - 1 + entries.length) % entries.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = entries.length - 1;
          else return;
          event.preventDefault();
          selectEvent(nextIndex, true);
        });
      });

      if (!selectHashEvent()) {
        const defaultIndex = entries.findIndex(({ panel }) => panel.id === 'event-jaghacks');
        selectEvent(defaultIndex === -1 ? 0 : defaultIndex);
      }
      window.addEventListener('hashchange', selectHashEvent);
    });
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
  setupCommunityEvents();
  setupProjectDialogs();
  window.addEventListener('popstate', () => applyPalette(savedPalette(), false));
})();
