let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let currentPlayer = 'X';
let winner = null;

function playComputer() {
    if (!winner) {
        if (board[1][1] === '') {
            play(1, 1);
            return;
        }

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    if (checkWinner(currentPlayer)) {
                        play(row, col);
                        return;
                    }
                    let opponent = (currentPlayer === 'X') ? 'O' : 'X';
                    if (checkWinner(opponent)) {
                        play(row, col);
                        return;
                    }
                }
            }
        }

        let row, col;
        do {
            row = Math.floor(Math.random() * 3);
            col = Math.floor(Math.random() * 3);
        }
        while (board[row][col] !== '');
        play(row, col);
    }
    console.log(board);
}

function play(row, col) {
    if (board[row][col] === '' && !winner) {
        board[row][col] = currentPlayer;
        document.getElementById('board').children[row].children[col].innerText = currentPlayer;
        if (checkWinner()) {
            document.getElementById('status').innerText = `Player ${currentPlayer} wins!`;
            winner = currentPlayer;
        } else if (isBoardFull()) {
            document.getElementById('status').innerText = 'It\'s a tie!';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('status').innerText = `Het is de beurt van ${currentPlayer}`;
        }
    }
}

function checkWinner() {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === currentPlayer && board[i][1] === currentPlayer && board[i][2] === currentPlayer) {
            return true;
        }
        if (board[0][i] === currentPlayer && board[1][i] === currentPlayer && board[2][i] === currentPlayer) {
            return true;
        }
    }
    if (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) {
        return true;
    }
    if (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer) {
        return true;
    }
    return false;
}

function isBoardFull() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

function reset() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    winner = null;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById('board').children[i].children[j].innerText = '';
        }
    }
    document.getElementById('status').innerText = `Het is de beurt van ${currentPlayer}`;
}