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