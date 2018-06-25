const gridSize = 800; //breedte van het grid
const cellSize = 32; //breedte van 1 cell in het grid
const cellBorder = 2;

var player;
var goToX;
var goToY;
var canvascanvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startTime = -1;
var animationLength = 1000;

initGame();

function initGame() {
    drawLevel();

    player = new Player(8, 6);
    drawPlayerAt(8, 6);
}

function drawLevel() {
    drawGrid();
    drawRoom(7, 5, 10, 15);
    drawWall(15, 11, 15, 17);
    drawWall(9, 13, 13, 13);
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

function drawRoom(startX, startY, width, height) {
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
    var posX = getCell(gridX);
    var posY = getCell(gridY);

    requestAnimationFrame(function(timestamp) {
        animatePlayer(timestamp, posX, posY);
    });
}

function drawPlayerAt(gridX, gridY) {    
    player.x = getCell(gridX);
    player.y = getCell(gridY);

    drawPlayer(player.x, player.y);
}

function drawPlayer(x, y) {
    r = cellSize / 2;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#f00";
    ctx.fill();

    console.log('player drawn at: ' + x + ',' + y);
}

function drawWallUnit(x, y) {
    x = x * cellSize;
    y = y * cellSize;

    ctx.fillStyle = "#888";
    ctx.fillRect(x, y, cellSize, cellSize);
}

function drawWall(startX, startY, endX, endY) {
    if (startX < endX) {
        x = startX;      
        while (x <= endX) {
            drawWallUnit(x, startY);
            x++;
        }
    }

    if (startY < endY) {
        y = startY;
        while (y <= endY) {
            drawWallUnit(startX, y);
            y++;
        }
    }    
}

function goTo(x, y) {    
    player.x = x;
    player.y = y;

    goToX = getCell(player.x);
    goToY = getCell(player.x + 1);

    x = getCell(x);
    y = getCell(y);
    r = 0.5 * cellSize;
    
    ctx.beginPath();

    ctx.arc(x, y, r, 0, 2 * Math.PI);

    ctx.fillStyle = "#f00";
    ctx.fill();
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

function animatePlayer(timestamp, endPosX, endPosY) {
    // Calculate animation progress
    var progress = 0;

    if (startTime < 0) {
        startTime = timestamp;
    } else {
        progress = timestamp - startTime;
    }
    var startPosX = getCell(player.x);
    var startPosY = getCell(player.y);
    var posX = startPosX + (endPosX - startPosX) * (progress / animationLength);
    var posY = startPosY + (endPosY - startPosY) * (progress / animationLength);

    console.log('posX: ' + posX);
    console.log('posY: ' + posY);

    //clearGrid();
    //drawLevel();
    drawPlayer(posX, posY);

    if (progress < animationLength) {
        requestAnimationFrame(function(timestamp) {
            animatePlayer(timestamp, posX, posY);
        });
    } else {
        clearGrid();
        drawLevel();
        drawPlayerAt(getGridPos(endPosX), getGridPos(endPosY));
    } 
}