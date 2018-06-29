const gridSize = 800; //breedte en hoogte van het grid
const cellSize = 32; //breedte en hoogte van 1 cell in het grid
const cellBorder = 2;

var player;
var goToX;
var goToY;
var canvascanvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startTime = -1;
var animationLength = 250;

initGame();

function initGame() {
    drawLevel();

    player = new Player(8, 6);
    drawPlayerAt(8, 6);
}

function drawLevel() {
    drawGrid();
    drawRoomAt(7, 5, 10, 15);
    drawWallAt(15, 11, 15, 17);
    drawWallAt(9, 13, 13, 13);
    drawEndGoalAt(16, 16);
}

function drawGrid() {    
    ctx.beginPath();

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = cellBorder;

    for(var i = 0; i <= gridSize; i += cellSize) {
        //horizontale lijn
        ctx.moveTo(0, i);
        ctx.lineTo(gridSize, i);
        //verticale lijn
        ctx.moveTo(i, 0);
        ctx.lineTo(i, gridSize);
    }
    
    ctx.stroke();
}

function getCell(cellNumber) {
    return cellNumber * cellSize + (cellSize / 2);
}

function getGridPos(pos) {
    return (pos - (cellSize / 2)) / cellSize;
}

function drawRoomAt(startX, startY, width, height) {
    x = getCell(startX);
    y = getCell(startY);
    w = width * cellSize;
    h = height * cellSize;
    
    ctx.beginPath();

    ctx.strokeStyle = '#333';
    ctx.lineWidth = cellSize;

    ctx.strokeRect(x, y, w, h);
}

function movePlayerTo(gridX, gridY) {
    goToX = gridX;
    goToY = gridY;

    startTime = -1;
    requestAnimationFrame(animatePlayer);
}

function drawPlayerAt(gridX, gridY) {    
    player.x = gridX;
    player.y = gridY;

    drawPlayer(getCell(player.x), getCell(player.y));
}

function drawPlayer(x, y) {
    r = cellSize / 2;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#0f0";
    ctx.fill();

    console.log('player drawn at: ' + x + ',' + y);
}

function drawEndGoalAt(gridX, gridY) {
    drawEndGoal(getCell(gridX), getCell(gridY));
}

function drawEndGoal(x, y) {
    r = cellSize / 4;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#f00";
    ctx.fill();
}

function drawWallUnitAt(x, y) {
    x = x * cellSize;
    y = y * cellSize;

    ctx.fillStyle = "#888";
    ctx.fillRect(x, y, cellSize, cellSize);
}

function drawWallAt(startX, startY, endX, endY) {
    if (startX < endX) {
        x = startX;      
        while (x <= endX) {
            drawWallUnitAt(x, startY);
            x++;
        }
    }

    if (startY < endY) {
        y = startY;
        while (y <= endY) {
            drawWallUnitAt(startX, y);
            y++;
        }
    }    
}

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
  
    switch (event.key) {
      case "ArrowDown": 
        movePlayerTo(player.x, player.y + 1);
        break;
      case "ArrowUp":
        movePlayerTo(player.x, player.y - 1);
        break;
      case "ArrowLeft":
        movePlayerTo(player.x - 1, player.y);
        break;
      case "ArrowRight":
        movePlayerTo(player.x + 1, player.y);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);

function clearGrid() {
    ctx.clearRect(0, 0, gridSize, gridSize);
}

function animatePlayer(timestamp) {
    // Calculate animation progress
    var progress = 0;

    if (startTime < 0) {
        startTime = timestamp;
    } else {
        progress = timestamp - startTime;
    }
    var startPosX = getCell(player.x);
    var startPosY = getCell(player.y);
    var difX = getCell(goToX) - startPosX;
    var difY = getCell(goToY) - startPosY;
    var progressPerc = (progress / animationLength);
    var posX = startPosX + (difX * progressPerc);
    var posY = startPosY + (difY * progressPerc);

    clearGrid();
    drawLevel();
    drawPlayer(posX, posY);

    if (progress < animationLength) {
        requestAnimationFrame(animatePlayer);
    } else {
        clearGrid();
        drawLevel();
        drawPlayerAt(goToX, goToY);
    } 
}

function Player(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    this.speed = 2;
}