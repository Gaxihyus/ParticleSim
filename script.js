var end = false;
var particles = [];
var rules = [];
var drawLines = false;
var collisionsOn = true;
var maxSpeed = 25;
var acceleration = 2;
var offset = 10;
var airResistanceMult = 0.01;
red = "#FF0000";
green = "#00FF00";
blue = "#8F00FF";
yellow = "#FFFF00"

const colors = [red, green, blue, yellow];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

document.getElementById('drawlinesbox').addEventListener('click', () => drawLines = !drawLines)
document.getElementById('symmetricButton').addEventListener('click', () => symmetricRules());
document.getElementById('randomButton').addEventListener('click', () => randomRules());

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function calculateForce(particle1, particle2, acceleration) {
    // Calculate the distance between the particles using the Pythagorean theorem
    const distance = Math.sqrt((particle1.x - particle2.x) ** 2 + (particle1.y - particle2.y) ** 2);

    if (distance === 0 || acceleration === 0) {
        // Avoid division by zero errors
        console.warn("calculateForce: distance or acceleration is zero");
        return;
    }

    // Calculate the force based on the distance and acceleration
    const force = acceleration / distance;

    if (isNaN(force)) {
        // Avoid NaN values
        console.warn("calculateForce: force is NaN");
        return;
    }

    // Calculate the direction of the force
    const directionX = (particle2.x - particle1.x) / distance;
    const directionY = (particle2.y - particle1.y) / distance;

    if (isNaN(directionX) || isNaN(directionY)) {
        // Avoid NaN values
        console.warn("calculateForce: directionX or directionY is NaN");
        return;
    }

    const rule = rules.find(r => r.color1 === particle1.color && r.color2 === particle2.color);

    let attraction = rule === undefined ? 0 : rule.attraction;
    // Calculate the amount of force to add to the velocity
    const forceX = directionX * force * attraction;
    const forceY = directionY * force * attraction;

    // Add the force to the velocity of particle1
    if (!isNaN(particle1.vX) && !isNaN(particle1.vY)) {
        particle1.vX += forceX;
        particle1.vY += forceY;
    } else {
        console.warn("calculateForce: particle1.vX or particle1.vY is NaN");
    }
}

function updateParticle() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        let w = canvas.width - offset;
        let h = canvas.height - offset;
        //Check if out of bounds
        if (p.x + p.vX >= w - offset || p.x + p.vX <= offset) { p.vX *= -1; p.x = clamp(p.x, offset, w) }
        if (p.y + p.vY >= h - offset || p.y + p.vY <= offset) { p.vY *= -1; p.y = clamp(p.y, offset, h) };

        for (let j = 0; j < particles.length; j++) {

            let p2 = particles[j]
            if (p == p2) continue;
            let d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
            if (d <= 1) {
                if (collisionsOn) {
                    p.vX *= -1;
                    p.vY *= -1;
                }
            }
            //check if close enough for attraction/repulsion
            else if (d <= 1000) {
                calculateForce(p, p2, acceleration)
            }
        }
        p.vX = clamp(p.vX, -maxSpeed, maxSpeed);
        p.vY = clamp(p.vY, -maxSpeed, maxSpeed);

        p.x += p.vX;
        p.y += p.vY;
    }

}



function drawParticles() {
    updateParticle();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        let nextP = particles[(i + 1) % particles.length]
        let p = particles[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI,);
        ctx.closePath;        
        ctx.strokeStyle = ctx.fillStyle = p.color;
        ctx.fill();

        if (drawLines === true) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(nextP.x, nextP.y);
            ctx.strokeStyle = '#00FF00'
            ctx.stroke();
        }
    }
}

function animate() {
    let number = 0;
    let id = null;
    const elem = document.getElementById("test");
    clearInterval(id);
    id = setInterval(frame, 5);



    function frame() {
        if (end) {
            clearInterval(id);
        } else {
            drawParticles();
        }
    }
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI,);
    ctx.closePath;
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.stroke();
}

function addParticle(color = undefined) {
    let w = canvas.width;
    let h = canvas.height;

    let x = Math.random() * w;
    let y = Math.random() * h;

    let vx = Math.random();
    let vy = Math.random();

    let radius = 2 + Math.random() * 5;

    if (color == undefined) color = getRandomColor();

    let p = new Particle(x, y, vx, vy, 2, color);

    particles.push(p);
}

function randomRules() {

    console.log(rules.length);
    rules = [];
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors.length; j++) {
            rules.push(new Rule(colors[i], colors[j], (Math.random() * 10) - 5));
        }
    }
}

function symmetricRules()
{
    randomRules();
    for (const i of colors) {
        for (const j of colors) {
            if (j < i) {
                rule1 = rules.find(r => r.color1 === i && r.color2 === j);
                rule2 = rules.find(r => r.color1 === j && r.color2 === i);
                let v = 0.5 * (rule1.acceleration + rule2.acceleration);
                rule1.acceleration = rule2.acceleration = v;
            }
        }
    }
}

class Particle {
    constructor(x, y, vX, vY, radius, color) {
        this.x = x;
        this.y = y;
        this.vX = vX;
        this.vY = vY;
        this.radius = radius;
        this.color = color;
    }
}

class Rule {
    constructor(color1, color2, attraction) {
        this.color1 = color1;
        this.color2 = color2;
        this.attraction = attraction;
    }
}

for (let i = 0; i < 150; i++) {
    for (let j = 0; j < colors.length; j++) {
        addParticle(colors[j]);
    }
}

randomRules();
animate();
