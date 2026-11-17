(() => {
  'use strict';
  const carousel = document.querySelector('[data-talk-carousel]');
  if (!carousel) return;
  const viewport = carousel.querySelector('.talk-slides');
  const track = carousel.querySelector('[data-talk-track]');
  const slides = Array.from(track.querySelectorAll('[data-talk-slide]'));
  const selectors = Array.from(carousel.querySelectorAll('[data-talk-go]'));
  const status = carousel.querySelector('[data-talk-status]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const queue = [];
  let current = 0;
  let requested = 0;
  let position = 1;
  let moving = false;
  let fallback = null;

  function cloneSlide(slide) {
    const clone = slide.cloneNode(true);
    clone.removeAttribute('data-talk-slide');
    clone.hidden = false;
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    return clone;
  }
  track.prepend(cloneSlide(slides[slides.length - 1]));
  track.append(cloneSlide(slides[0]));
  slides.forEach(slide => { slide.hidden = false; });

  function updateState(announce = true) {
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.inert = i !== current;
    });
    selectors.forEach((button, i) => {
      if (i === current) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    if (announce) status.textContent = `${current + 1} of ${slides.length}: ${slides[current].querySelector('h3').textContent}`;
  }
  function resetTrack() {
    track.classList.remove('is-sliding');
    position = current + 1;
    track.style.transform = `translateX(${-position * 100}%)`;
    // Commit the invisible loop reset before another requested movement.
    void track.offsetWidth;
  }
  function finishMovement() {
    if (!moving) return;
    window.clearTimeout(fallback);
    fallback = null;
    resetTrack();
    moving = false;
    playNext();
  }
  function playNext() {
    if (moving || !queue.length) return;
    const { next, direction } = queue.shift();
    if (next === current) { playNext(); return; }
    const previous = current;
    current = next;
    updateState();
    if (reducedMotion.matches) {
      resetTrack();
      playNext();
      return;
    }
    if (previous === slides.length - 1 && next === 0 && direction > 0) position = slides.length + 1;
    else if (previous === 0 && next === slides.length - 1 && direction < 0) position = 0;
    else position = next + 1;
    moving = true;
    track.classList.add('is-sliding');
    track.style.transform = `translateX(${-position * 100}%)`;
    fallback = window.setTimeout(finishMovement, 780);
  }
  function show(index) {
    const next = (index + slides.length) % slides.length;
    if (next === requested) return;
    const direction = index > requested ? 1 : -1;
    requested = next;
    queue.push({ next, direction });
    playNext();
  }
  track.addEventListener('transitionend', event => {
    if (event.target === track && event.propertyName === 'transform') finishMovement();
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    window.clearTimeout(fallback);
    fallback = null;
    moving = false;
    queue.length = 0;
    current = requested;
    resetTrack();
    updateState();
  });
  updateState(false);
  resetTrack();

  carousel.querySelector('[data-talk-previous]').addEventListener('click', () => show(requested - 1));
  carousel.querySelector('[data-talk-next]').addEventListener('click', () => show(requested + 1));
  selectors.forEach(button => button.addEventListener('click', () => show(Number(button.dataset.talkGo))));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(requested + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchStart = null;
  viewport.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) { touchStart = null; return; }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  viewport.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) show(requested + (dx < 0 ? 1 : -1));
  }, { passive: true });
  viewport.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
})();
