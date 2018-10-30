window.requestAnimFrame = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (callback => window.setTimeout(callback, 1000 / 60))
    );
}();

function fix_dpi() {
    canvas.setAttribute('width', getCanvasFixedComputedValue('width'));
    canvas.setAttribute('height', getCanvasFixedComputedValue('height') );
}

function Particle() {
    this.radius = Math.round((Math.random() * 10) + 5);
    this.x = Math.floor((Math.random() * (getCanvasFixedComputedValue('width') - this.radius + 1) + this.radius));
    this.y = Math.floor((Math.random() * (getCanvasFixedComputedValue('height') - this.radius + 1) + this.radius));
    this.color = colors[Math.round(Math.random() * colors.length)];
    this.speedx = genSpeen(201);
    this.speedy = genSpeen(201);
    this.speedx *= genDirection();
    this.speedy *= genDirection();


    this.move = function () {
        context.beginPath();
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = this.color;
        context.globalAlpha = 1;
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();

        this.x = this.x + this.speedx;
        this.y = this.y + this.speedy;

        if (this.x <= 0 + this.radius) this.speedx *= -1; 
        if (this.x >= canvas.width - this.radius) this.speedx *= -1; 
        if (this.y <= 0 + this.radius) this.speedy *= -1; 
        if (this.y >= canvas.height - this.radius) this.speedy *= -1; 


        particles.forEach( particle => {
            var yd = particle.y - this.y,
                xd = particle.x - this.x,
                distance = Math.sqrt(xd**2 + yd**2);

            const DISTANCE_TO_TETHER = 300;

            if (distance < DISTANCE_TO_TETHER) {
                context.beginPath();
                context.globalAlpha = (DISTANCE_TO_TETHER - distance) / DISTANCE_TO_TETHER;
                context.globalCompositeOperation = 'destination-over';
                context.lineWidth = 1;
                context.moveTo(this.x, this.y);
                context.lineTo(particle.x, particle.y);
                context.strokeStyle = this.color;
                context.lineCap = "round";
                context.stroke();
                context.closePath();
            }
        });
    };
};

function genSpeen(max) { return Math.round((Math.random() * max) + 1) / 100; }

function genDirection() { return Math.round(Math.random()) ? -1 : 1; }

function getCanvasFixedComputedValue(value) { return +getComputedStyle(canvas).getPropertyValue(value).slice(0, -2) * dpi; }

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => particle.move());

    requestAnimFrame(animate);
}

const dpi = window.devicePixelRatio || 1,
      canvas = document.getElementById('canvas'),
      context = canvas.getContext('2d'),
      colors = ['#00abff', '#dcdcdc', '#ff00c6'],
      particle_count = 100;

let particles = [];

(() => {
    context.scale(dpi, dpi);
    fix_dpi();
    for (var i = 0; i < particle_count; i++) particles.push(new Particle());
    animate(); 
})()
