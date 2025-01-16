let rows = 9
let cols = 9
let totalMines = 10
let board = []
let gameOver = false

function init() {
    board = []
    document.getElementById("board").innerHTML = ""
    let minePositions = []
    while (minePositions.length < totalMines) {
        let pos = Math.floor(Math.random() * rows * cols)
        if (!minePositions.includes(pos)) minePositions.push(pos)
    }
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let row = []
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            let index = rowIndex * cols + colIndex
            let cell = {}
            cell.mine = minePositions.includes(index)
            cell.revealed = false
            cell.marked = false
            row.push(cell)
        }
        board.push(row)
    }
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            let cellDiv = document.createElement("div")
            cellDiv.setAttribute("data-row", rowIndex)
            cellDiv.setAttribute("data-col", colIndex)
            cellDiv.addEventListener("click", reveal)
            cellDiv.addEventListener("contextmenu", mark)
            document.getElementById("board").appendChild(cellDiv)
        }
    }
}

function adjacentMines(rowIndex, colIndex) {
    let count = 0
    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
        for (let colDelta = -1; colDelta <= 1; colDelta++) {
            let newRow = rowIndex + rowDelta
            let newCol = colIndex + colDelta
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (board[newRow][newCol].mine) count++
            }
        }
    }
    return count
}

function reveal(event) {
    if (gameOver) return
    let rowIndex = parseInt(event.target.getAttribute("data-row"))
    let colIndex = parseInt(event.target.getAttribute("data-col"))
    let cell = board[rowIndex][colIndex]
    if (cell.revealed || cell.marked) return
    cell.revealed = true
    event.target.classList.add("revealed")
    if (cell.mine) {
        event.target.innerText = "X"
        event.target.style.color = "var(--color-error)"
        event.target.style.fontWeight = '900'
        gameOver = true
        return
    }
    let count = adjacentMines(rowIndex, colIndex)
    if (count > 0) {
        event.target.innerText = count
    } else {
        for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
            for (let colDelta = -1; colDelta <= 1; colDelta++) {
                let newRow = rowIndex + rowDelta
                let newCol = colIndex + colDelta
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    if (!board[newRow][newCol].revealed) {
                        let neighbor = document.querySelector(`div[data-row='${newRow}'][data-col='${newCol}']`)
                        if (neighbor) neighbor.click()
                    }
                }
            }
        }
    }
    checkWin()
}

function mark(event) {
    event.preventDefault()
    if (gameOver) return
    let rowIndex = parseInt(event.target.getAttribute("data-row"))
    let colIndex = parseInt(event.target.getAttribute("data-col"))
    let cell = board[rowIndex][colIndex]
    if (!cell.revealed) {
        cell.marked = !cell.marked
        event.target.innerText = cell.marked ? "#" : ""
    }
    checkWin()
}

function checkWin() {
    let revealedCount = 0
    let markedMines = 0
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            if (board[rowIndex][colIndex].revealed) revealedCount++
            if (board[rowIndex][colIndex].marked && board[rowIndex][colIndex].mine) markedMines++
        }
    }
    if (revealedCount === rows * cols - totalMines) {
        gameOver = true
        alert("You win!")
    }
    if (markedMines === totalMines) {
        gameOver = true
        alert("All mines marked! You win!")
    }
}

function resetGame() {
    gameOver = false
    rows = 9
    cols = 9
    totalMines = 10
    document.getElementById("board").style.gridTemplateColumns = `repeat(9, 2em)`
    init()
}

function setBoardSize(size) {
    let sizes = {
        small: { rows: 9, cols: 9, mines: 10 },
        medium: { rows: 16, cols: 16, mines: 40 },
        large: { rows: 16, cols: 30, mines: 99 }
    }
    let config = sizes[size]
    rows = config.rows
    cols = config.cols
    totalMines = config.mines
    gameOver = false
    document.getElementById("board").style.gridTemplateColumns = `repeat(${cols}, 2em)`
    init()
}

window.addEventListener("load", init)