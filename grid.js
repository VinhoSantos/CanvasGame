const gridSize = 800; //breedte van het grid
const cellSize = 32; //breedte van 1 cell in het grid
const cellBorder = 2;

var mainChar;
var canvas;
var ctx;

window.onload = function() {    
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    drawLevel();
    drawMainCharacter(8, 6);
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

function drawMainCharacter(startX, startY) {
    mainChar = new MainCharacter(startX, startY);
    
    x = getCell(startX);
    y = getCell(startY);
    r = 0.5 * cellSize;
    
    ctx.beginPath();

    ctx.arc(x, y, r, 0, 2 * Math.PI);

    ctx.fillStyle = "#f00";
    ctx.fill();
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
    ctx.clearRect(getCell(mainChar.x) - (cellSize / 2), getCell(mainChar.y) - (cellSize / 2), cellSize, cellSize);

    mainChar.x = x;
    mainChar.y = y;

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
        goTo(mainChar.x, mainChar.y + 1);
        break;
      case "ArrowUp":
        goTo(mainChar.x, mainChar.y - 1);
        break;
      case "ArrowLeft":
        goTo(mainChar.x - 1, mainChar.y);
        break;
      case "ArrowRight":
        goTo(mainChar.x + 1, mainChar.y);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);