(() => {
  'use strict';
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
