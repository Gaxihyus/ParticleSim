var end = false;
var particles = [];
var drawLines = false;
var collisionsOn = true;

var airResistanceMult = 0.01;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

document.getElementById('drawlinesbox').addEventListener('click', () => drawLines = !drawLines)
document.getElementById('collisionbox').addEventListener('click', () => collisionsOn = !collisionsOn)
document.getElementById('addParticle').addEventListener('click', () => addParticle());
document.getElementById('stop').addEventListener('click', () => end = true);

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function updateParticle()
{
    for(let i = 0; i < particles.length; i++)
    {
        let p = particles[i];
        let w = canvas.width;
        let h = canvas.height;

        //Check if out of bounds
        if(p.x + p.vX >= w || p.x + p.vX <= 0) { p.vX *= -1; p.x = clamp(p.x, 0, w)}
        if(p.y + p.vY >= h || p.y + p.vY <= 0) { p.vY *= -1; p.y = clamp(p.y, 0, h)};

        for(let j = 0; j < particles.length; j++)
        {
            let p2 = particles[j]
            if(p == p2) continue;
            let d = Math.sqrt(Math.pow(p.x - p2.x,2) + Math.pow(p.y - p2.y,2))
            if(d <= p.radius + p2.radius + 2)
            {
                if(collisionsOn)
                {
                    p.vX *= -1;
                    p.vY *= -1;
                }
            }
            //check if close enough for attraction/repulsion
            else if(d <= 200)
            {
                let dx = p2.x - p.x;
                let dy = p2.y - p.y;
                let Fx = 5 / dx;
                let Fy = 5 / dy;

                if(p.color != p2.color)
                {
                    Fx *= -1;
                    Fy *= -1;
                }

                p.vX += Fx;
                p.vY += Fy;

                let maxSpeed = 2;

                if(p.vX > maxSpeed) p.vX = maxSpeed;
                if(p.vX < -maxSpeed) p.vX = -maxSpeed;
                if(p.vY > maxSpeed) p.vY = maxSpeed;
                if(p.vY < -maxSpeed) p.vY = -maxSpeed;
            }
        }



        p.x += p.vX;
        p.y += p.vY;
    }
}


function drawParticles()
{
    updateParticle();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particles.length; i++)
    {
        let nextP = particles[(i + 1) % particles.length]
        let p = particles[i];
        drawCircle(p.x, p.y, p.radius, p.color)
        if(drawLines === true)
        {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(nextP.x, nextP.y);
            ctx.strokeStyle = '#00FF00'
            ctx.stroke();
        }
    }
}

function animate()
{
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

function drawCircle(x, y, radius, color)
{  
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI,);
    ctx.closePath;
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.fill();
}

function addParticle(color = undefined)
{
    let w = canvas.width;
    let h = canvas.height;

    let x = Math.random() * w;
    let y = Math.random() * h;

    let vx = Math.random();
    let vy = Math.random();

    let radius = 2 + Math.random() * 5;

    if(color == undefined) color = getRandomColor();

    let p = new Particle(x,y,vx,vy, radius, color);

    particles.push(p);
}

class Particle{
    constructor(x, y, vX, vY, radius, color)
    {
        this.x = x;
        this.y = y;
        this.vX = vX;
        this.vY = vY;
        this.radius = radius;
        this.color = color;
    }
}

for(let i = 0; i < 250; i++)
{
    addParticle('#FF0000');
    addParticle();
}

animate();
