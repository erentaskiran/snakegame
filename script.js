var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var snakeSize = 20;
var snake = [{ x: 200, y: 200 }];
var food = { x: 0, y: 0 };

var dx = snakeSize;
var dy = 0;

var gameRunning = true;
var gameSpeed = 100; // Oyun hızı (ms cinsinden)
var score = 0;
var bestScore = localStorage.getItem("bestScore") || 0; // En iyi puanı sakla

generateFood();

function gameLoop() {
  if (!gameRunning) {
    return;
  }

  updateSnake();
  checkCollision();
  drawCanvas();
  drawScore();
  drawBestScore();

  setTimeout(gameLoop, gameSpeed);
}

function updateSnake() {
  var newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(newHead);

  if (snake[0].x === food.x && snake[0].y === food.y) {
    generateFood();
    score++;

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore); // En iyi puanı güncelle ve sakla
    }
  } else {
    snake.pop();
  }
}

function checkCollision() {
  if (
    snake[0].x < 0 ||
    snake[0].x >= canvas.width ||
    snake[0].y < 0 ||
    snake[0].y >= canvas.height ||
    checkSelfCollision()
  ) {
    gameRunning = false;
    alert("Oyun bitti! Puanınız: " + score);
    showRestartButton();
  }
}

function checkSelfCollision() {
  for (var i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < snake.length; i++) {
    context.fillStyle = "green";
    context.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
    context.strokeStyle = "darkgreen";
    context.strokeRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
  }

  context.fillStyle = "red";
  context.fillRect(food.x, food.y, snakeSize, snakeSize);
}

function drawScore() {
  context.fillStyle = "black";
  context.font = "20px Arial";
  context.fillText("Puan: " + score, 10, 20);
}

function drawBestScore() {
  context.fillStyle = "black";
  context.font = "20px Arial";
  context.fillText("En İyi Puan: " + bestScore, 10, 40);
}

function generateFood() {
  var randomX = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
  var randomY = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;

  food.x = randomX;
  food.y = randomY;
}

function showRestartButton() {
  var restartButton = document.createElement("button");
  restartButton.textContent = "Yeniden Başlat";
  restartButton.addEventListener("click", restartGame);
  document.body.appendChild(restartButton);
}

function restartGame() {
  snake = [{ x: 200, y: 200 }];
  dx = snakeSize;
  dy = 0;
  score = 0;
  gameRunning = true;

  var restartButton = document.querySelector("button");
  if (restartButton) {
    restartButton.remove();
  }

  gameLoop();
}

function changeDirection(event) {
  var keyPressed = event.keyCode;
  var goingUp = dy === -snakeSize;
  var goingDown = dy === snakeSize;
  var goingRight = dx === snakeSize;
  var goingLeft = dx === -snakeSize;

  if (keyPressed === 37 && !goingRight) {
    dx = -snakeSize;
    dy = 0;
  }

  if (keyPressed === 38 && !goingDown) {
    dx = 0;
    dy = -snakeSize;
  }

  if (keyPressed === 39 && !goingLeft) {
    dx = snakeSize;
    dy = 0;
  }

  if (keyPressed === 40 && !goingUp) {
    dx = 0;
    dy = snakeSize;
  }
}

document.addEventListener("keydown", changeDirection);

gameLoop();
