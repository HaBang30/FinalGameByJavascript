let canvas = document.getElementById("canvas");
let ROWS = 30;
let COLS = 50;
let PIXEL = 10;
let pixels = new Map();



//----drawBoard----

function drawBoard() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let pixel = document.createElement("div");
            canvas.appendChild(pixel);
            pixel.style.position = "absolute";
            pixel.style.border = "1px solid #aaa";
            pixel.style.width = PIXEL + "px";
            pixel.style.height = PIXEL + "px";
            pixel.style.top = i * PIXEL + "px";
            pixel.style.left = j * PIXEL + "px";
            let key = toKey([i, j]);
            pixels.set(key, pixel);
        }
    }
}
drawBoard();

//----drawSnake----

function makeInitializeSnake() {
    return [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4]
    ]
};

let currentFood = spawnFood();
let currentFoodKeys = toKey(currentFood);
let currentSnake = makeInitializeSnake();
let currentSnakeKeys = toKeySet(currentSnake);

function drawSnake() {
    let currentFoodKeys = toKey(currentFood);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let key = toKey([i, j]);
            let pixel = pixels.get(key)
            let background = "white";
            if(key == currentFoodKeys) {
                background = "blue";
            } else if (currentSnakeKeys.has(key)) {
                background = "blue";
            }
            pixel.style.background = background;
        }
    }
}
drawSnake();


function toKey([top, left]) {
    return top + "," + left;
}

function toKeySet(snake) {
    let set = new Set();
    for (let cell of snake) {
        let key = toKey(cell);
        set.add(key);
    }
    return set;
}

//----stepSnake----


let moveRight = ([t, l]) => [t, l + 1];
let moveLeft = ([t, l]) => [t, l - 1];
let moveDown = ([t, l]) => [t + 1, l];
let moveUp = ([t, l]) => [t - 1, l];
let currentDirection = moveRight;
let directionQueue = [];

window.addEventListener("keydown", (e) => {
    switch(e.key) {
        case "ArrowRight":
            directionQueue.push(moveRight);
            break;
        case "ArrowLeft":
            directionQueue.push(moveLeft);
            break;
        case "ArrowDown":
            directionQueue.push(moveDown);
            break;
        case "ArrowUp":
            directionQueue.push(moveUp);
            break;
    }
});


function step() {
    let head = currentSnake[currentSnake.length - 1];
    let nextHead = currentDirection(head);
    currentSnake.push(nextHead);
    if (!checkValidHead (currentSnakeKeys, nextHead)) {
        stopGame();
        return;
    }
    let nextDirection = currentDirection;
    while(directionQueue.length > 0) {
        let candidateDirection = directionQueue.shift();
        if (!oppositeDirection(candidateDirection, currentDirection)){
            nextDirection = candidateDirection;
        }
        break;
    }
   
    if (toKey(currentFood) == toKey(nextHead)) {
        currentFood = spawnFood();
    } else{
        currentSnake.shift();
    }
    currentDirection = nextDirection;
    currentSnakeKeys = toKeySet(currentSnake);
    currentFoodKeys = toKey(currentFood);
    drawSnake();
}
setInterval(step, 100);

function oppositeDirection (direction1, direction2) {
    if(direction1 == moveRight && direction2 == moveLeft) {
        return true;
    }
    if(direction1 == moveLeft && direction2 == moveRight) {
        return true;
    }
    if(direction1 == moveDown && direction2 == moveUp) {
        return true;
    }
    if(direction1 == moveUp && direction2 == moveDown) {
        return true;
    }
    return false;
}

//----checkValidHead----

function checkValidHead(keys, [top, left]) {
    if (top < 0 || left < 0) {
        return false;
    }
    if (top >= ROWS || left >= COLS) {
        return false;
    }
    if (keys.has[top, left]){
        return false;
    }
    return true;
}

function stopGame() {
    canvas.style.borderColor = "red";
}


//----Snake to eat food----

function spawnFood() {
    let top = Math.floor(Math.random() * ROWS);
    let left = Math.floor(Math.random() * COLS);
    return [top, left];
}
