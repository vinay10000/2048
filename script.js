const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
let score = 0;
let grid = [];
let gameOver = false;

// Initialize the game grid
function initGrid() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    gridContainer.innerHTML = '';
    score = 0;
    scoreDisplay.textContent = '0';
    createGrid();
    addNewTile();
    addNewTile();
}

// Create the visual grid
function createGrid() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            gridContainer.appendChild(cell);
        }
    }
}

// Add a new tile (2 or 4) to a random empty cell
function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
        updateVisual();
    }
}

// Update the visual representation of the grid
function updateVisual() {
    const cells = gridContainer.getElementsByClassName('grid-cell');
    for (let i = 0; i < cells.length; i++) {
        const row = parseInt(cells[i].getAttribute('data-row'));
        const col = parseInt(cells[i].getAttribute('data-col'));
        const value = grid[row][col];
        
        cells[i].textContent = value || '';
        cells[i].className = `grid-cell${value ? ` tile-${value}` : ''}`;
        
        if (value) {
            cells[i].style.transform = 'scale(1)';
        }
    }
}

// Update score
function updateScore(value) {
    score += value;
    scoreDisplay.textContent = score.toString();
}

// Move tiles in a direction
function moveTiles(direction) {
    if (gameOver) return;

    const oldGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;

    switch (direction) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }

    if (moved) {
        addNewTile();
        checkGameOver();
    }
}

// Move and merge tiles left
function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(cell => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                updateScore(row[j]);
                row.splice(j + 1, 1);
                moved = true;
            }
        }
        while (row.length < 4) row.push(0);
        if (row.join(',') !== grid[i].join(',')) moved = true;
        grid[i] = row;
    }
    updateVisual();
    return moved;
}

// Move and merge tiles right
function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(cell => cell !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                updateScore(row[j]);
                row.splice(j - 1, 1);
                moved = true;
            }
        }
        while (row.length < 4) row.unshift(0);
        if (row.join(',') !== grid[i].join(',')) moved = true;
        grid[i] = row;
    }
    updateVisual();
    return moved;
}

// Move and merge tiles up
function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== 0) column.push(grid[i][j]);
        }
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2;
                updateScore(column[i]);
                column.splice(i + 1, 1);
                moved = true;
            }
        }
        while (column.length < 4) column.push(0);
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== column[i]) moved = true;
            grid[i][j] = column[i];
        }
    }
    updateVisual();
    return moved;
}

// Move and merge tiles down
function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== 0) column.push(grid[i][j]);
        }
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i] === column[i - 1]) {
                column[i] *= 2;
                updateScore(column[i]);
                column.splice(i - 1, 1);
                moved = true;
            }
        }
        while (column.length < 4) column.unshift(0);
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== column[i]) moved = true;
            grid[i][j] = column[i];
        }
    }
    updateVisual();
    return moved;
}

// Check if game is over
function checkGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
        }
    }
    gameOver = true;
    alert('Game Over! Your score: ' + score);
    return true;
}

// Touch controls
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Add touch event listeners
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

document.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling while playing
}, { passive: false });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
}, false);

// Handle swipe gestures
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50; // Minimum distance for a swipe

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                moveTiles('ArrowRight');
            } else {
                moveTiles('ArrowLeft');
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                moveTiles('ArrowDown');
            } else {
                moveTiles('ArrowUp');
            }
        }
    }
}

// Handle keyboard events
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        moveTiles(e.key);
    }
});

// Initialize the game
initGrid();
