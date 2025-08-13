// Bio
const words = [
    "coffee.", 
    "exercising.", 
    "traveling.", 
    "video games.", 
    "reading books.", 
    "learning.",
    "cooking.",
    "baking.",
    "Bob's Burgers.",
    "writing."
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const erasingSpeed = 50;
const delayBetweenWords = 1500;

const wordSpan = document.querySelector(".cycling-word");

function typeWord() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
        // Typing forward
        wordSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
            // Wait before deleting
            isDeleting = true;
            setTimeout(typeWord, delayBetweenWords);
        } else {
            setTimeout(typeWord, typingSpeed);
        }
    } else {
        // Deleting
        wordSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            // Move to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeWord, typingSpeed);
        } else {
            setTimeout(typeWord, erasingSpeed);
        }
    }
}

document.addEventListener("DOMContentLoaded", typeWord);

// Selector
// Select radio btns and boxes
const radios = document.querySelectorAll( 'input[ name="group1" ]' );
const boxes = document.querySelectorAll( '.box' );
const radioContainers = document.querySelectorAll( '.radio' );

// Function to show only selected box
function showBox( selectedId ) {
    boxes.forEach( ( box, index ) => {
        if ( index === selectedId ) {
            box.hidden = false; // show box
            box.classList.add( 'active' );
            box.classList.remove( 'slide-up' );
            void box.offsetWidth;
            box.classList.add( 'slide-up' );
        } else {
            box.hidden = true; // hide box
            box.classList.remove( 'active', 'slide-up' );
        }
    });

    // Active radio & box
    radioContainers.forEach( ( container, index ) => {
        if ( index === selectedId ) {
            container.classList.add( 'active-radio' );
        } else {
            container.classList.remove( 'active-radio' );
        }
    });
}

// Change event to each radio
radios.forEach( ( radio, index ) => {
    radio.addEventListener( 'change', () => {
        showBox( index );
    });
});

showBox( 0 );

// Mobile Menu
// Inject a hamburger button and a slide-in menu without changing your existing HTML

(function () {
  // Helpers
  const qs = (sel, ctx = document) => ctx.querySelector(sel);

  function createEl(tag, opts = {}) {
    const el = document.createElement(tag);
    if (opts.className) el.className = opts.className;
    if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (opts.html) el.innerHTML = opts.html;
    if (opts.text) el.textContent = opts.text;
    return el;
  }

  function onEsc(cb) {
    const handler = (e) => {
      if (e.key === 'Escape') cb();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }

  // Locate the existing navbar
  const navbar = qs('.navbar');
  if (!navbar) return;

  // 1) Create the hamburger button (uses your exact icon)
  const btn = createEl('button', {
    className: 'hamburger',
    attrs: {
      'aria-label': 'Open menu',
      'aria-expanded': 'false',
      'aria-controls': 'mobile-menu'
    },
    html: '<i class="fa-solid fa-bars" aria-hidden="true"></i><span class="sr-only">Open menu</span>'
  });

  // Place it at the end of the navbar
  navbar.appendChild(btn);

  // 2) Create backdrop and panel
  const backdrop = createEl('div', { className: 'menu-backdrop', attrs: { 'data-menu-el': '' } });

  const panel = createEl('aside', {
    className: 'mobile-menu',
    attrs: { id: 'mobile-menu', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Site menu' }
  });

  // Panel header with close button
  const header = createEl('div', { className: 'mobile-menu__header' });
  const title = createEl('div', { className: 'mobile-menu__title', text: 'Menu' });
  const closeBtn = createEl('button', {
    className: 'mobile-menu__close',
    attrs: { 'aria-label': 'Close menu' },
    text: '×'
  });
  header.append(title, closeBtn);

  // Panel content — clone your existing links and email
  const navWrap = createEl('nav', { className: 'mobile-menu__nav' });
  const linksUl = qs('.nav-links ul');
  if (linksUl) navWrap.appendChild(linksUl.cloneNode(true));

  const emailWrap = createEl('div', { className: 'mobile-menu__email' });
  const emailEl = qs('.nav-email a');
  if (emailEl) emailWrap.appendChild(emailEl.cloneNode(true));

  panel.append(header, navWrap, emailWrap);

  // Add to the DOM (outside navbar so it overlays the whole screen)
  document.body.append(backdrop, panel);

  // Open/close logic
  let removeEscListener = null;
  const firstFocusableSelector = 'a, button, [tabindex]:not([tabindex="-1"])';
  let lastFocusedBeforeOpen = null;

  function openMenu() {
    if (document.documentElement.classList.contains('menu-open')) return;
    lastFocusedBeforeOpen = document.activeElement;
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('no-scroll');
    btn.setAttribute('aria-expanded', 'true');

    // Focus first focusable element inside panel
    const first = panel.querySelector(firstFocusableSelector);
    if (first) first.focus();

    removeEscListener = onEsc(closeMenu);
  }

  function closeMenu() {
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
    btn.setAttribute('aria-expanded', 'false');
    if (removeEscListener) removeEscListener();
    // Return focus to the hamburger
    if (lastFocusedBeforeOpen && lastFocusedBeforeOpen instanceof HTMLElement) {
      btn.focus();
    }
  }

  // Click bindings
  btn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close when a link inside the panel is clicked
  panel.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.tagName === 'A') {
      closeMenu();
    }
  });

  // Prevent scroll on touch drag inside panel from propagating to body
  panel.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
  panel.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
})();
