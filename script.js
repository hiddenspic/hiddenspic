const entryForm = document.getElementById('entryForm');
const gameArea = document.getElementById('gameArea');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gridSize = 20; 
let snake, dx, dy, foodX, foodY, score, nickname, reversedControls;

function startGame() {
    nickname = document.getElementById('nickname').value;
    if (nickname) {
        entryForm.style.display = 'none';
        gameArea.style.display = 'block';
        initGame();
    } else {
        alert("Введи ник, долбаеб");
    }
}

function initGame() {
    snake = [{x: 10, y: 10}]; 
    dx = 1; 
    dy = 0; 
    score = 0;
    reversedControls = false;
    scoreDisplay.textContent = `Score: ${score} | Player: ${nickname}`;
    generateFood();
    setInterval(gameLoop, 100);
}

function gameLoop() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
}

function clearCanvas() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === foodX && head.y === foodY) {
        score++;
        scoreDisplay.textContent = `Score: ${score} | Player: ${nickname}`;
        generateFood();
    } else {
        snake.pop(); 
    }
}

function drawSnake() {
    ctx.fillStyle = '#c6f8c7'; 
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
    ctx.fillStyle = '#a2e0a4'
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }
}


function generateFood() {
    foodX = Math.floor(Math.random() * (canvas.width / gridSize));
    foodY = Math.floor(Math.random() * (canvas.height / gridSize));
}

function drawFood() {
    ctx.fillStyle = '#f9a825';
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);
}
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        gameOver(score);
    }
   
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver(score);
        }
    }

    if (Math.random() < 0.1) { 
        reversedControls = true;
    }

    if (score === 50) { 
        const token = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('winToken', token);
        sessionStorage.setItem('nickname', nickname)
        nickname = document.getElementById('nickname').value;
        window.location.href = 'win.html?token=' + token + '&nickname=' + nickname;
    }
}



function gameOver(score) {
    if(score <=20){
         location.reload();
    }
    else{
        location.reload(); 
    }
    

}



document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const A_KEY = 65; 
    const W_KEY = 87; 
    const D_KEY = 68; 
    const S_KEY = 83; 

    const keyPressed = event.keyCode; 
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;


    if (keyPressed === A_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    } else if (keyPressed === W_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    } else if (keyPressed === D_KEY && !goingLeft) { 
        dx = 1;
        dy = 0;
    } else if (keyPressed === S_KEY && !goingUp) {  
        dx = 0;
        dy = 1;
    } 

    // Arrow Key Controls
    else if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    } else if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    } else if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    } else if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }

    if (reversedControls) {
        dx *= -1; 
        dy *= -1; 
    }
}

