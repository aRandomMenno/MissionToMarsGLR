// @ 0 is empty, 1 is unguessed ship, 2 is shoot and miss, 3 is shoot and hit
let player_1 = Array.from({ length: 10 }, () => Array(10).fill(0));
let player_2 = Array.from({ length: 10 }, () => Array(10).fill(0));

let turn = 1;

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

    board.addEventListener('mouseover', (event) => {
        if (event.target.tagName === 'DIV' && event.target.hasAttribute('data-coordinate')) {
            const currentColor = getComputedStyle(event.target).backgroundColor;
            if (currentColor !== 'red' && currentColor !== 'rgb(255, 0, 0)' && currentColor !== 'rgb(0, 0, 255)') {
                event.target.style.backgroundColor = 'var(--color-hover)';
            }
        }
    });
    board.addEventListener('mouseout', (event) => {
        if (event.target.tagName === 'DIV' && event.target.hasAttribute('data-coordinate')) {
            const currentColor = getComputedStyle(event.target).backgroundColor;
            if (currentColor !== 'red' && currentColor !== 'rgb(255, 0, 0)' && currentColor !== 'rgb(0, 0, 255)') {
                event.target.style.backgroundColor = '';
            }
        }
    });

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
                cell.addEventListener('click', () => {
                    shoot(`${String.fromCharCode(64 + row)}${col - 1}`, number);
                });
                cell.setAttribute('data-coordinate', `${String.fromCharCode(64 + row)}${col - 1}`);
            }
            board.appendChild(cell);
        }
    }
    boardContainer.appendChild(board);
    document.getElementById('wrap_boards').appendChild(boardContainer);
}

function initializeGame() {
    console.log('game starting!')
}

function reset() {
    player_1 = Array.from({ length: 10 }, () => Array(10).fill(0));
    player_2 = Array.from({ length: 10 }, () => Array(10).fill(0));
    turn = 1;
    document.getElementById('wrap_boards').innerHTML = '';
    createBoard('speler', 1);
    createBoard('speler', 2);
    console.log('Game reset!');
}

function shoot(tile, player) {
    if (player === turn) {
        console.log('Player', player, 'Shot at:', tile);

        const opponentBoardId = player === 1 ? 'speler_1' : 'speler_2';
        const boardArray = player === 1 ? player_2 : player_1;
        const shotTile = document.querySelector(`#${opponentBoardId} [data-coordinate="${tile}"]`);

        if (shotTile) {
            const row = tile.charCodeAt(0) - 65;
            const col = parseInt(tile.slice(1), 10);

            console.log('Row:', row, 'Column:', col);
            const board = player === 1 ? player_2 : player_1;

            if (board[row][col] === 0) {
                console.log('Miss!');
                board[row][col] = 2;
                shotTile.style.backgroundColor = 'blue';
                turn = turn === 1 ? 2 : 1;
                console.log('Turn switched to Player', turn);
            } else if (board[row][col] === 1) {
                console.log('Hit!');
                board[row][col] = 3;
                shotTile.style.backgroundColor = 'red';
                turn = turn === 1 ? 2 : 1;
                console.log('Turn switched to Player', turn);
            } else {
                console.log('Tile already shot! the player may make another guess');
            }
        }
    } else {
        console.warn('Not your turn!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard('speler', 1);
    createBoard('speler', 2);

    initializeGame();
})