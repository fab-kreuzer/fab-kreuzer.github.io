const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.alpha = 1;
        this.speed = {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1
        };
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }

    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speed.x = -this.speed.x;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speed.y = -this.speed.y;
        }

        this.alpha -= 0.01;
        if (this.alpha < 0) {
            this.alpha = 0;
        }

        this.draw();
    }

    connect(particles) {
        particles.forEach(particle => {
            const distance = Math.sqrt(Math.pow(this.x - particle.x, 2) + Math.pow(this.y - particle.y, 2));

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(particle.x, particle.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
                ctx.stroke();
            }
        });
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.connect(particles);
    });
}

window.addEventListener("resize", () => {
    init();
});

window.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Position des Canvas-Elements
    const x = event.clientX - rect.left; // Mausposition relativ zur Position des Canvas-Elements
    const y = event.clientY - rect.top; // Mausposition relativ zur Position des Canvas-Elements
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x, y));
    }
});


init();
animate();
