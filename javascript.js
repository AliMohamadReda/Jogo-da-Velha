let currentPlayer = 'X';
let isGameActive = true;
let gameMode = ''; // Pode ser 'multiplayer' ou 'bot'
let difficulty = 'easy';
let scoreX = 0;
let scoreO = 0;

let board = ['', '', '', '', '', '', '', '', ''];
const cells = document.querySelectorAll('.cell');
const gameStatus = document.querySelector('.game-status');
const multiplayerBtn = document.getElementById('multiplayer-btn');
const botBtn = document.getElementById('bot-btn');
const resetButton = document.getElementById('reset-button');
const difficultyContainer = document.getElementById('difficulty-container');
const scoreXDisplay = document.getElementById('score-x');
const scoreODisplay = document.getElementById('score-o');
const difficultySelect = document.getElementById('difficulty');

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function updateScoreboard() {
    scoreXDisplay.textContent = scoreX;
    scoreODisplay.textContent = scoreO;
}

function checkWinner() {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameStatus.textContent = `Jogador ${board[a]} venceu!`;
            isGameActive = false;
            if (board[a] === 'X') scoreX++;
            else if (board[a] === 'O') scoreO++;
            updateScoreboard();
            resetButton.style.display = 'inline-block';
            return;
        }
    }

    if (!board.includes('') && isGameActive) {
        gameStatus.textContent = 'Empate!';
        isGameActive = false;
        resetButton.style.display = 'inline-block';
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.classList.remove('X', 'O');
        cell.textContent = '';
    });
    gameStatus.textContent = `Jogador ${currentPlayer}, é sua vez!`;
    resetButton.style.display = 'none';
    multiplayerBtn.style.display = 'inline-block';
    botBtn.style.display = 'inline-block';
    difficultyContainer.style.display = 'none';
}

function selectMode(mode) {
    gameMode = mode;
    isGameActive = true;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.classList.remove('X', 'O');
        cell.textContent = '';
    });
    gameStatus.textContent = `Jogador ${currentPlayer}, é sua vez!`;
    multiplayerBtn.style.display = 'none';
    botBtn.style.display = 'none';
    resetButton.style.display = 'inline-block';
    difficultyContainer.style.display = (mode === 'bot') ? 'block' : 'none';
    updateScoreboard();
}

function makeMove(index) {
    if (!isGameActive || board[index] !== '') return;

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer);

    checkWinner();

    if (isGameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.textContent = `Jogador ${currentPlayer}, é sua vez!`;
    }

    if (gameMode === 'bot' && currentPlayer === 'O' && isGameActive) {
        setTimeout(botMove, 300); // Delay para parecer mais natural
    }
}

function botMove() {
    let availableMoves = board.map((value, index) => value === '' ? index : null).filter(value => value !== null);
    let move;

    if (difficulty === 'easy') {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        move = null;

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            const line = [board[a], board[b], board[c]];
            const countO = line.filter(v => v === 'O').length;
            const countEmpty = line.filter(v => v === '').length;

            if (countO === 2 && countEmpty === 1) {
                move = pattern.find(i => board[i] === '');
                break;
            }
        }

        if (move === null) {
            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                const line = [board[a], board[b], board[c]];
                const countX = line.filter(v => v === 'X').length;
                const countEmpty = line.filter(v => v === '').length;

                if (countX === 2 && countEmpty === 1) {
                    move = pattern.find(i => board[i] === '');
                    break;
                }
            }
        }

        if (move === null) {
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    }

    makeMove(move);
}

// Eventos
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        makeMove(index);
    });
});

resetButton.addEventListener('click', resetGame);
multiplayerBtn.addEventListener('click', () => selectMode('multiplayer'));
botBtn.addEventListener('click', () => selectMode('bot'));
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
});
