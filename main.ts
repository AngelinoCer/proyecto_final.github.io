const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let eyes: Eye[] = [];
let theta: number;

interface MousePosition {
    x: number | undefined;
    y: number | undefined;
}

const mouse: MousePosition = {
    x: undefined,
    y: undefined,
};

window.addEventListener("mousemove", (event: MouseEvent) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Eye {
    x: number;
    y: number;
    radius: number;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        if (mouse.x === undefined || mouse.y === undefined) return;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        theta = Math.atan2(dy, dx);

        const iris_x = this.x + Math.cos(theta) * this.radius / 10;
        const iris_y = this.y + Math.sin(theta) * this.radius / 10;
        const irisRadius = this.radius / 1.2;
        ctx.beginPath();
        ctx.arc(iris_x, iris_y, irisRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        const pupilRadius = this.radius / 2.5;
        const pupil_x = this.x + Math.cos(theta) * this.radius / 1.9;
        const pupil_y = this.y + Math.sin(theta) * this.radius / 1.9;

        ctx.beginPath();
        ctx.arc(pupil_x, pupil_y, pupilRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(pupil_x - pupilRadius / 3, pupil_y - pupilRadius / 3, pupilRadius / 2, 0, Math.PI * 2, true);
        ctx.fillStyle = "rgba(255,255,255,.1)";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2, true);
        ctx.fillStyle = "gold";
        ctx.fill();
        ctx.closePath();
    }
}

function init(): void {
    eyes = [];
    let overlapping = false;
    const numberOfEyes = 300;
    const protection = 10000;
    let counter = 0;

    while (eyes.length < numberOfEyes && counter < protection) {
        const eye = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.floor(Math.random() * 160) + 1,
        };

        overlapping = false;
        for (let i = 0; i < eyes.length; i++) {
            const previousEye = eyes[i];
            const dx = eye.x - previousEye.x;
            const dy = eye.y - previousEye.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < eye.radius + previousEye.radius) {
                overlapping = true;
                break;
            }
        }

        if (!overlapping) {
            eyes.push(new Eye(eye.x, eye.y, eye.radius));
        }

        counter++;
    }
}

function animate(): void {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0, 0, 0, .25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < eyes.length; i++) {
        eyes[i].draw();
    }
}

init();
animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});
