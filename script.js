const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const ladrillosCount = 9;
const ladrillosColumnCount = 5;

// Propiedades de la pelota
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

// Propiedades paddle
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};

// Propiedades del ladrillo
const ladrilloInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

// Crear ladrillos
const ladrillos = [];
for (let i = 0; i < ladrillosCount; i++) {
    ladrillos[i] = [];
    for (let j = 0; j < ladrillosColumnCount; j++) {
        const x = i * (ladrilloInfo.w + ladrilloInfo.padding) + ladrilloInfo.offsetX;
        const y = j * (ladrilloInfo.h + ladrilloInfo.padding) + ladrilloInfo.offsetY;
        ladrillos[i][j] = { x, y, ...ladrilloInfo };
    }
}

// dibujar pelona en canvas
function dibujarPelota() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

// dibujar paddle en canvas
function dibujarPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

// dibujar punteo en canvas
function dibujarPunteo() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// dibujar ladrillos en canvas
function dibujarLadrillos() {
    ladrillos.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

// mover paddle en canvas
function moverPaddle() {
    paddle.x += paddle.dx;

    // Detección de pared
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

// mover pelota en canvas
function moverBola() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Detectar colición (derecha/izquierda)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // ball.dx = ball.dx * -1
    }

    // Colisión de pared (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // console.log(ball.x, ball.y);

    // Colisión con el Paddle
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    // Brick collision
    ladrillos.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x && // Ladrillos del lazo izquierdo
                    ball.x + ball.size < brick.x + brick.w && // Ladrillos del lado derecho
                    ball.y + ball.size > brick.y && // Ladrillos de arriba
                    ball.y - ball.size < brick.y + brick.h // Ladrillos del fondo
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    incrementarPunteo();
                }
            }
        });
    });

    // reinicio si la pelota cae
    if (ball.y + ball.size > canvas.height) {
        mostrarTodosLosLadrillos();
        score = 0;
    }
}

// Incrementa el punteo
function incrementarPunteo() {
    score++;

    if (score % (ladrillosCount * ladrillosCount) === 0) {
        mostrarTodosLosLadrillos();
    }
}

// aparecen todos los ladrillos
function mostrarTodosLosLadrillos() {
    ladrillos.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

// dibujar todo
function dibujar() {
    // limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarPelota();
    dibujarPaddle();
    dibujarPunteo();
    dibujarLadrillos();
}

// actualizar canvas y animacion
function actualizar() {
    moverPaddle();
    moverBola();

    // dibujar todo
    dibujar();

    requestAnimationFrame(actualizar);
}

actualizar();

// Keydown event
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

// Keyup event
function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// reglas and cerrar event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
