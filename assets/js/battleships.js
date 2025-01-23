const statusDisplay = document.getElementById('status');
let player_1 = Array.from({ length: 10 }, () => Array(10).fill(0));
let player_2 = Array.from({ length: 10 }, () => Array(10).fill(0));
let turn = 1;
const SHIPS = [
    { length: 5, count: 1 },
    { length: 4, count: 1 },
    { length: 3, count: 2 },
    { length: 2, count: 1 }
];

let currentPlayer = 1;
let currentShipIndex = 0;
let currentShipCount = 0;
let isPlacingShips = true;
let isHorizontal = true;
let player1Ships = [];
let player2Ships = [];

class Ship {
    constructor(length, startRow, startCol, isHorizontal) {
        this.length = length;
        this.hits = new Set();
        this.coordinates = [];
        
        if (isHorizontal) {
            for (let c = startCol; c < startCol + length; c++) {
                this.coordinates.push(`${String.fromCharCode(65 + startRow)}${c}`);
            }
        } else {
            for (let r = startRow; r < startRow + length; r++) {
                this.coordinates.push(`${String.fromCharCode(65 + r)}${startCol}`);
            }
        }
    }

    hit(coordinate) {
        this.hits.add(coordinate);
        return this.isSunk();
    }

    isSunk() {
        return this.hits.size === this.length;
    }
}

function createBoard(id, number) {
    let boardContainer = document.createElement('div');
    boardContainer.style.display = 'flex';
    boardContainer.style.flexDirection = 'column';
    boardContainer.style.alignItems = 'center';
    boardContainer.style.width = '50%';

    let board = document.createElement('div');
    board.id = `${id}_${number}`;
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(11, 1fr)';
    board.style.gridTemplateRows = 'repeat(11, 1fr)';
    board.style.gap = '6px';
    board.style.width = 'fit-content';
    board.style.cursor = 'crosshair';

    let title = document.createElement('h2');
    title.innerText = `Bord speler ${number}`;
    boardContainer.appendChild(title);

    for (let row = 0; row <= 10; row++) {
        for (let col = 0; col <= 10; col++) {
            let cell = document.createElement('div');
            cell.style.display = 'inline-flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            if (row === 0 && col > 0) {
                cell.innerText = col - 1;
            } else if (col === 0 && row > 0) {
                cell.innerText = String.fromCharCode(64 + row);
            } else if (row > 0 && col > 0) {
                cell.style.border = '2px solid #fff';
                cell.style.width = '36px';
                cell.style.height = '36px';
                cell.setAttribute('data-coordinate', `${String.fromCharCode(64 + row)}${col - 1}`);
            }
            board.appendChild(cell);
        }
    }
    boardContainer.appendChild(board);
    document.getElementById('wrap_boards').appendChild(boardContainer);
}



function reset() {
    player_1 = Array.from({ length: 10 }, () => Array(10).fill(0));
    player_2 = Array.from({ length: 10 }, () => Array(10).fill(0));
    player1Ships = [];
    player2Ships = [];
    turn = 1;
    currentPlayer = 1;
    currentShipIndex = 0;
    currentShipCount = 0;
    isPlacingShips = true;
    isHorizontal = true;

    document.getElementById('wrap_boards').innerHTML = '';
    createBoard('speler', 1);
    createBoard('speler', 2);
    
    startShipPlacement();
    updateStatus();
    document.querySelectorAll('[data-coordinate]').forEach(cell => {
        cell.style.backgroundColor = '';
    });
}

function shoot(tile, player) {
    if (player === turn) {
        const opponentBoardId = player === 1 ? 'speler_1' : 'speler_2';
        const shotTile = document.querySelector(`#${opponentBoardId} [data-coordinate="${tile}"]`);
        if (shotTile) {
            const row = tile.charCodeAt(0) - 65;
            const col = parseInt(tile.slice(1), 10);
            const board = player === 1 ? player_2 : player_1;
            const ships = player === 1 ? player2Ships : player1Ships;
            
            if (board[row][col] === 0) {
                board[row][col] = 2;
                shotTile.style.backgroundColor = 'blue';
                turn = turn === 1 ? 2 : 1;
                updateStatus();
            } else if (board[row][col] === 1) {
                board[row][col] = 3;
                shotTile.style.backgroundColor = 'red';
                
                for (let ship of ships) {
                    if (ship.coordinates.includes(tile)) {
                        if (ship.hit(tile)) {
                            alert(`Een schip met een lengte van ${ship.length} is gezonken!`);
                            if (checkForWin(ships)) {
                                disableShooting();
                                statusDisplay.textContent = `Speler ${player} wint!`;
                                return;
                            }
                        }
                        break;
                    }
                }
                turn = turn === 1 ? 2 : 1;
                updateStatus();
            }
        }
    } else {
        console.warn('Not your turn!');
    }
}

function startShipPlacement() {
    isPlacingShips = true;
    document.getElementById('speler_2').style.display = 'none';
    addShipPlacementListeners();
    updateStatus();
}

function addShipPlacementListeners() {
    const board = document.getElementById(`speler_${currentPlayer}`);
    const cells = board.querySelectorAll('[data-coordinate]');
    cells.forEach(cell => {
        cell.addEventListener('mouseover', previewShipPlacement);
        cell.addEventListener('mouseout', clearPreviews);
        cell.addEventListener('click', placeShip);
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            isHorizontal = !isHorizontal;
            clearPreviews();
            previewShipPlacement({target: cell});
        });
    });
}

function previewShipPlacement(event) {
    clearPreviews();
    const cell = event.target;
    const coordinate = cell.getAttribute('data-coordinate');
    const [row, col] = [coordinate.charCodeAt(0) - 65, parseInt(coordinate.slice(1))];
    const shipLength = SHIPS[currentShipIndex].length;
    if (canPlaceShip(row, col, shipLength, isHorizontal, currentPlayer)) {
        const cells = getShipCells(row, col, shipLength, isHorizontal, currentPlayer);
        cells.forEach(cell => cell.style.backgroundColor = 'gray');
    }
}

function placeShip(event) {
    const cell = event.target;
    const coordinate = cell.getAttribute('data-coordinate');
    const [row, col] = [coordinate.charCodeAt(0) - 65, parseInt(coordinate.slice(1))];
    const shipLength = SHIPS[currentShipIndex].length;
    
    if (canPlaceShip(row, col, shipLength, isHorizontal, currentPlayer)) {
        const board = currentPlayer === 1 ? player_1 : player_2;
        const cells = getShipCells(row, col, shipLength, isHorizontal, currentPlayer);
        const ship = new Ship(shipLength, row, col, isHorizontal);
        if (currentPlayer === 1) {
            player1Ships.push(ship);
        } else {
            player2Ships.push(ship);
        }
        cells.forEach(cell => {
            const coord = cell.getAttribute('data-coordinate');
            const [r, c] = [coord.charCodeAt(0) - 65, parseInt(coord.slice(1))];
            board[r][c] = 1;
            cell.style.backgroundColor = '#666';
        });
        currentShipCount++;
        if (currentShipCount >= SHIPS[currentShipIndex].count) {
            currentShipCount = 0;
            currentShipIndex++;
        }
        if (currentShipIndex >= SHIPS.length) {
            switchPlayer();
        }
    }
}

function canPlaceShip(row, col, length, horizontal, player) {
    const board = player === 1 ? player_1 : player_2;
    if (horizontal) {
        if (col + length > 10) return false;
        for (let c = col; c < col + length; c++) {
            if (board[row][c] === 1) return false;
        }
    } else {
        if (row + length > 10) return false;
        for (let r = row; r < row + length; r++) {
            if (board[r][col] === 1) return false;
        }
    }
    return true;
}

function getShipCells(row, col, length, horizontal, player) {
    const cells = [];
    const board = document.getElementById(`speler_${player}`);
    if (horizontal) {
        for (let c = col; c < col + length; c++) {
            const coord = `${String.fromCharCode(65 + row)}${c}`;
            cells.push(board.querySelector(`[data-coordinate="${coord}"]`));
        }
    } else {
        for (let r = row; r < row + length; r++) {
            const coord = `${String.fromCharCode(65 + r)}${col}`;
            cells.push(board.querySelector(`[data-coordinate="${coord}"]`));
        }
    }
    return cells;
}

function switchPlayer() {
    const oldBoard = document.getElementById(`speler_${currentPlayer}`);
    const oldCells = oldBoard.querySelectorAll('[data-coordinate]');
    oldCells.forEach(cell => {
        cell.removeEventListener('mouseover', previewShipPlacement);
        cell.removeEventListener('mouseout', clearPreviews);
        cell.removeEventListener('click', placeShip);
    });
    if (currentPlayer === 1) {
        currentPlayer = 2;
        currentShipIndex = 0;
        currentShipCount = 0;
        document.getElementById('speler_1').style.display = 'none';
        document.getElementById('speler_2').style.display = 'grid';
        addShipPlacementListeners(); 
        updateStatus();
    } else {
        isPlacingShips = false;
        document.querySelectorAll('[data-coordinate]').forEach(cell => {
            cell.style.backgroundColor = '';
        });
        document.getElementById('speler_1').style.display = 'grid';
        document.getElementById('speler_2').style.display = 'grid';
        enableShooting();
        updateStatus();
    }
}

function clearPreviews() {
    const cells = document.querySelectorAll(`#speler_${currentPlayer} [data-coordinate]`);
    cells.forEach(cell => {
        if (getComputedStyle(cell).backgroundColor !== 'rgb(102, 102, 102)') {
            cell.style.backgroundColor = '';
        }
    });
}

function updateStatus() {
    if (isPlacingShips) {
        statusDisplay.textContent = `Speler ${currentPlayer} is schepen aan het plaatsen.`;
    } else {
        statusDisplay.textContent = `Speler ${turn} mag schieten.`;
    }
}

function enableShooting() {
    const cells = document.querySelectorAll('[data-coordinate]');
    cells.forEach(cell => {
        const coordinate = cell.getAttribute('data-coordinate');
        const boardId = cell.closest('[id^="speler_"]').id;
        const playerNumber = parseInt(boardId.split('_')[1]);
        cell.addEventListener('click', () => {
            shoot(coordinate, playerNumber === 1 ? 1 : 2);
        });
    });
}

function disableShooting() {
    const cells = document.querySelectorAll('[data-coordinate]');
    cells.forEach(cell => {
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
    });
}

function checkForWin(ships) {
    return ships.every(ship => ship.isSunk());
}

function initializeGame() {
    startShipPlacement();
    updateStatus();
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard('speler', 1);
    createBoard('speler', 2);
    initializeGame();
})