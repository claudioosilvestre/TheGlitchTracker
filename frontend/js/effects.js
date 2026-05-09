
// MATRIX RAIN (Canvas)
// Creates the Matrix "rain" animation using a canvas element.
// Continuously draws falling characters on the screen.
export function initMatrixRain() {
    const container = document.getElementById('matrixRain');

    const canvas = document.createElement('canvas');

    if (!container) {
        return;
    }

    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 16);

    const drops = Array(cols).fill(1);

    const chars =
    '01アイウエオカキクケコサシスセソタチ'.split('');

    function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = '#00ff41';

    ctx.font = '14px Share Tech Mono';

    drops.forEach((y, i) => {

        const char =
        chars[Math.floor(Math.random() * chars.length)];

      ctx.fillText(char, i * 16, y * 16);

    if (
        y * 16 > canvas.height &&
        Math.random() > 0.975
    ) {
        drops[i] = 0;
    }

    drops[i]++;
    });
}

setInterval(draw, 60);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
}


// CLOCK
// Initializes and updates the live clock in the header.
// Refreshes every second.
export function initClock() {
    const el = document.getElementById('clock');

    function tick() {
    const now = new Date();

    if (!el) {
        return;
    }

    el.textContent = now.toLocaleTimeString('en-GB');
}

tick();

setInterval(tick, 1000);
}