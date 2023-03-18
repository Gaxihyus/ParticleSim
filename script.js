var end = false;
var particles = [];
var drawLines = false;

var airResistanceMult = 0.01;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

document.getElementById('drawlinesbox').addEventListener('click', () => drawLines = !drawLines)
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


        if(p.x + p.vX >= w || p.x + p.vX <= 0) { p.vX *= -1;}
        if(p.y + p.vY >= h || p.y + p.vY <= 0) { p.vY *= -1;}

        for(let j = 0; j < particles.length; j++)
        {
            let p2 = particles[j]
            if(p == p2) continue;
            let d = Math.sqrt(Math.pow(p.x - p2.x,2) + Math.pow(p.y - p2.y,2))
            if(d <= 5)
            {
                //p.vX *= -1;
               // p.vY *= -1;
            }
            //check if close enough for attraction/repulsion
            else if(d <= 100)
            {
                let dx = p2.x - p.x;
                let dy = p2.y - p.y;
                const Fx = 1 / dx;
                const Fy = 1 / dy;

                p.vX += Fx;
                p.vY += Fy

                if(p.vX > 2) p.vX = 2;
                if(p.vX < -2) p.vX = -2;
                if(p.vY > 2) p.vY = 2;
                if(p.vY < -2) p.vY = -2;
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
        drawCircle(p.x, p.y, 2.5, p.color)
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

function addParticle()
{
    let w = canvas.width;
    let h = canvas.height;

    let x = Math.random() * w;
    let y = Math.random() * h;

    let vx = Math.random();
    let vy = Math.random();

    let p = new Particle(x,y,vx,vy, getRandomColor());

    particles.push(p);
}

class Particle{
    constructor(x, y, vX, vY, color)
    {
        this.x = x;
        this.y = y;
        this.vX = vX;
        this.vY = vY;
        this.color = color;
    }
}

animate();