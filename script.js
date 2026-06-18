const board = document.querySelector('.board');
const strtBtn = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const strtgame = document.querySelector(".start-game");
const gameover = document.querySelector(".game-over");
const restartbtn = document.querySelector(".btn-restart");
const pausescreen = document.querySelector(".pause-screen");
const resumebtn = document.querySelector(".btn-resume");

const highscore = document.querySelector("#high-score");
const score = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 50
const blockWidth = 50

let highScore = localStorage.getItem("HighScore") || 0;
highscore.innerHTML = highScore;

let Score = 0;
let Time = `00-00`;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = [];
let snake = [{
    x: 3, y: 9
}];

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

let direction = 'right';

let lastDirection = 'right';

let intervalId = null;

let timerIntervalId = null;

for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerHTML = `${row}-${col}`;
        blocks[`${row}-${col}`] = block;
    }
}

function render(){
    let head = null

    blocks[`${food.x}-${food.y}`].classList.add("food");

    lastDirection = direction;

    if(direction === "left"){
        head = { x: snake[0].x, y: snake[0].y - 1}
    }
    else if(direction === "right"){
        head = { x: snake[0].x, y: snake[0].y + 1}
    }
    else if(direction === "down"){
        head = { x: snake[0].x + 1, y: snake[0].y}
    }
    else if(direction === "up"){
        head = { x: snake[0].x - 1, y: snake[0].y}
    }


    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){  
        clearInterval(intervalId);
        modal.style.display = "flex";
        strtgame.style.display = "none";
        gameover.style.display ="flex";
        return;
    }



    if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);
    Score += 10;
    score.innerHTML = Score;

    if (Score > highScore) {
        highScore = Score;
        localStorage.setItem("HighScore", highScore.toString());
        highscore.innerText = highScore;
    }
}


    snake.forEach(segment => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "snake-head")})

    snake.unshift(head)
    snake.pop()


    snake.forEach((segment, index) => {
    const block = blocks[`${segment.x}-${segment.y}`];
    block.classList.add("fill");
    if(index === 0) block.classList.add("snake-head");})
}


function startTimer() {
    timerIntervalId = setInterval(() => {
        let [min, sec] = Time.split("-").map(Number);
        if (sec === 59) { min += 1; sec = 0; }
        else { sec += 1; }
        Time = `${String(min).padStart(2, "0")}-${String(sec).padStart(2, "0")}`;
        timeElement.innerText = Time.replace("-", " - ");
    }, 1000);
}

function stopTimer() {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
}


strtBtn.addEventListener("click", ()=>{
    modal.style.display = "none";
    intervalId = setInterval(() => { render() },400)
    startTimer();
})

restartbtn.addEventListener("click", () => {restartGame()})


function restartGame() {
    clearInterval(intervalId);
    intervalId = null;
    stopTimer(); // ← new

    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "snake-head"));

    Score = 0;
    Time = "00-00";
    direction = "right";
    snake = [{ x: 3, y: 9 }];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

    score.innerText = Score;
    timeElement.innerText = "00 - 00";
    highscore.innerText = highScore;

    modal.style.display = "none";
    intervalId = setInterval(() => { render(); }, 400);
    startTimer();
}

function pauseGame() {
    clearInterval(intervalId);
    intervalId = null;
    stopTimer();
    modal.style.display = "flex";
    strtgame.style.display = "none";
    gameover.style.display = "none";
    pausescreen.style.display = "flex";
}

function resumeGame() {
    modal.style.display = "none";
    pausescreen.style.display = "none";
    intervalId = setInterval(() => { render(); }, 400);
    startTimer();
}

resumebtn.addEventListener("click", function(){
    resumeGame()
})

addEventListener("keydown", (event) => {
    if(event.key === "ArrowUp" && lastDirection !== "down"){
        direction = "up";
    }
    else if(event.key === "ArrowDown" && lastDirection !== "up"){
        direction = "down"
    }
    else if(event.key === "ArrowRight" && lastDirection !== "left"){
        direction = "right"
    }
    else if(event.key === "ArrowLeft" && lastDirection !== "right"){
        direction = "left"
    }
    else if (event.key === " ") {
    event.preventDefault();
    if (intervalId) {
        pauseGame();   
    } else {
        resumeGame();      
    }}
})


