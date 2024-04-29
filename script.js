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
        alert("Please enter your nickname.");
    }
}

function initGame() {
    snake = [{x: 10, y: 10}]; 
    dx = 1; 
    dy = 0; 
    score = 0;
    reversedControls = false;
    scoreDisplay.textContent = `Score: ${score} (Welcome, ${nickname})`;
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
        scoreDisplay.textContent = `Score: ${score} (Welcome, ${nickname})`;
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
    // Check for wall collisions (corrected)
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        gameOver(score);
    }
    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver(score);
        }
    }

    
    if (score === 10) {
        reversedControls = true;
    }
    if (score === 20) { 
        const token = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('winToken', token);
        sessionStorage.setItem('nickname', nickname)
        nickname = document.getElementById('nickname').value;
        sendToTelegram('Winner: ' + nickname )
        window.location.href = 'win.html?token=' + token + '?nickname=' + nickname;
    }
}



function gameOver(score) {
    if(score <=8){
        window.location.href = 'https://mattlau1.github.io/jas/'
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

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }

    if (reversedControls) {
        dx *= -1; 
        dy *= -1; 
    }
}




// ENCRYPTION
function sendToTelegram(message) {
    const botToken = '6632178999:AAF9LS17_tQqr4XXx2XzuywxWh3a0XbJwYU'; 
    const chatId = '1780029859';    

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    
    const params = new URLSearchParams({encoding: 'utf-8'});
    params.append('chat_id', chatId);
    params.append('text', message);



    fetch(url, {
        method: 'POST',
        body: params
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error sending message: ${response.status}`);
            }
            console.log("Message sent successfully.");
        })
        .catch(error => {
            console.error("Error sending Telegram message:", error);
        });
}
