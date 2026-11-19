(() => {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    const header = menuToggle.closest('.site-header');
    const isMenuOpen = () => menuToggle.getAttribute('aria-expanded') === 'true';
    const setMenuOpen = open => menuToggle.setAttribute('aria-expanded', String(open));

    menuToggle.addEventListener('click', () => setMenuOpen(!isMenuOpen()));
    document.addEventListener('click', event => {
      if (isMenuOpen() && (!header.contains(event.target) || event.target.closest('a'))) setMenuOpen(false);
    });
    header.addEventListener('focusout', event => {
      if (isMenuOpen() && !header.contains(event.relatedTarget)) setMenuOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !isMenuOpen()) return;
      event.preventDefault();
      setMenuOpen(false);
      menuToggle.focus();
    });
    window.matchMedia('(max-width: 760px)').addEventListener('change', () => setMenuOpen(false));
    menuToggle.hidden = false;
  }

  let opener = null;
  document.addEventListener('click', async event => {
    const trigger = event.target.closest('[data-open-project]');
    if (trigger) {
      const dialog = document.getElementById(`project-${trigger.dataset.openProject}`);
      if (!dialog) return;
      opener = trigger;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    }
    const discordTrigger = event.target.closest('[data-open-discord]');
    if (discordTrigger) {
      opener = discordTrigger;
      const dialog = document.getElementById('discord-dialog');
      dialog.querySelector('.discord-status').textContent = '';
      dialog.showModal();
      document.body.classList.add('dialog-open');
    }
    if (event.target.closest('[data-copy-discord]')) {
      const field = document.getElementById('discord-username');
      const status = document.querySelector('.discord-status');
      try {
        await navigator.clipboard.writeText(field.value);
        status.textContent = 'Username copied.';
      } catch (_) {
        field.focus();
        field.select();
        status.textContent = 'Select and copy the username above.';
      }
    }
    const close = event.target.closest('[data-close-dialog]');
    if (close) close.closest('dialog').close();
  });
  document.querySelectorAll('.project-dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      opener?.focus({ preventScroll: true });
      opener = null;
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });
})();
