// Parameters
const canvasWidth = 900;
const canvasHeight = 900;
const cellSize = 10;
const numRows = canvasHeight / cellSize;
const numCols = canvasWidth / cellSize;
const generationTime = 100; // millisecond
var interval = "miauw";
var row = 0;
// Create the grid
let grid = new Array(numRows);
let nextGrid = new Array(numRows);
for (let i = 0; i < numRows; i++) {
    grid[i] = new Array(numCols);
    nextGrid[i] = new Array(numCols);
}

// Initialize the grid randomly
function initializeGrid_elem() {
    if(interval != "miauw"){
        clearInterval(interval);
        interval = "miauw";
    }

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            grid[row][col] = 0;
        }
    }
    grid[0][45] = 1;
    renderGrid();
}

function initializeGrid_random() {
    if(interval != "miauw"){
        clearInterval(interval);
        interval = "miauw";
    }

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            grid[row][col] = Math.floor(Math.random() * 2);
        }
    }
    renderGrid();
}

function initializeGrid_life() {
    //give each cell a 1 in 10 chance of being alive
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++){
            var random = Math.random();
            if(random < 0.05){
            grid[row][col] = 1;
            }
            else{
            grid[row][col] = 0;
            }
        }
    }
    renderGrid();
}

function checkRule_life(x, y, cell) {
    let count = countNeighbors(x, y);
    if (cell == 1) {
        if(count == 2 || count == 3){
            nextGrid[x][y] = 1;
        }
        else{
            nextGrid[x][y] = 0;
        }
    } else {
        if (count == 3) {
            nextGrid[x][y] = 1;
        }
        else{
            nextGrid[x][y] = 0;
        }
    }
}

function checkRule_elem(x, y, cell){
    //console.log(grid);
    //console.log("checking rule for cell " + x + ", " + y);
    var left = y - 1;
    var right = y + 1;
    var leftVal = grid[x][left];
    var rightVal = grid[x][right];
    if(leftVal == undefined){
        leftVal = 0;
    }
    if(rightVal == undefined){
        rightVal = 0;
    }

    if (leftVal == 0 && cell == 0 && rightVal == 0){
        //console.log("found rule 0")
        nextGrid[x + 1][y] = 0;
    }
    if(leftVal == 0 && cell == 0 && rightVal == 1){
        //console.log("found rule 1")
        nextGrid[x + 1][y] = 1;
    }
    if(leftVal == 0 && cell == 1 && rightVal == 0){
        //console.log("found rule 2")
        nextGrid[x + 1][y] = 0;
    }
    if(leftVal == 0 && cell == 1 && rightVal == 1){
        //console.log("found rule 3")
        nextGrid[x + 1][y] = 1;
    }
    if(leftVal == 1 && cell == 0 && rightVal == 0){
        //console.log("found rule 4")
        nextGrid[x + 1][y] = 1;
    }
    if(leftVal == 1 && cell == 0 && rightVal == 1){
        //console.log("found rule 5")
        nextGrid[x + 1][y] = 0;
    }
    if(leftVal == 1 && cell == 1 && rightVal == 0){
        //console.log("found rule 6")
        nextGrid[x + 1][y] = 1;
    }
    if(leftVal == 1 && cell == 1 && rightVal == 1){
        //console.log("found rule 7")
        nextGrid[x + 1][y] = 0;
    }
}

function checkRule_cave(x, y, cell){
    var count = countNeighbors(x, y);
    if(cell == 1){
        if(count >= 4){
            nextGrid[x][y] = 1;
        }
        else{
            nextGrid[x][y] = 0;
        }
    }
    else{
        if(count >= 5){
            nextGrid[x][y] = 1;
        }
        else{
            nextGrid[x][y] = 0;
        }
    }
}

function updateGrid_cave(){
    nextGrid = grid.copyWithin();
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++){
            let cell = grid[row][col];
            checkRule_cave(row, col, cell);
        }
    }
    let temp = grid;
    grid = nextGrid;
    nextGrid = temp;
}
function updateGrid_life() {
    nextGrid = grid.copyWithin();
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++){
            let cell = grid[row][col];
            checkRule_life(row, col, cell);
        }
    }
    let temp = grid;
    grid = nextGrid;
    nextGrid = temp;
}

// Update the grid based on the rules of the cellular automata
function updateGrid_elem() {
    nextGrid = grid.copyWithin();
        for (let col = 0; col < numCols; col++) {
            let cell = grid[row][col];
            checkRule_elem(row, col, cell);
        }
    // Swap the grids
    let temp = grid;
    grid = nextGrid;
    nextGrid = temp;
    row++;
}
// Count the number of alive neighbors for a given cell
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let neighborRow = (row + i + numRows) % numRows;
            let neighborCol = (col + j + numCols) % numCols;
            count += grid[neighborRow][neighborCol];
        }
    }
    count -= grid[row][col]; // Exclude the cell itself
    return count;
}

// Render the grid on the canvas
function renderGrid() {
    let canvas = document.getElementById("gridCanvas");
    let ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let cell = grid[row][col];
            ctx.fillStyle = cell === 1 ? "black" : "white";
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

function step_life() {
    updateGrid_life();
    renderGrid();
}

function start_life() {
    initializeGrid_life();
    //step every half second
    interval = setInterval(step_life, 400);
    
}

function step_elem() {
    updateGrid_elem();
    renderGrid();
}
function step_cave(){
    updateGrid_cave();
    renderGrid();
}
renderGrid();
