let currentPlayer = 'X';
let isGameActive = true;
let gameMode = ''; // Pode ser 'multiplayer' ou 'bot'
let board = ['', '', '', '', '', '', '', '', ''];
const cells = document.querySelectorAll('.cell');
const gameStatus = document.querySelector('.game-status');
const multiplayerBtn = document.getElementById('multiplayer-btn');
const botBtn = document.getElementById('bot-btn');
const resetButton = document.getElementById('reset-button');

// Padrões de vitória (linhas vencedoras)
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

function checkWinner() {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameStatus.textContent = `Jogador ${board[a]} venceu!`;
            isGameActive = false;
            resetButton.style.display = 'inline-block'; // Garante que o botão apareça
            return; // Para a função para evitar que continue verificando empate
        }
    }

    // Verifica empate somente se ninguém venceu
    if (!board.includes('') && isGameActive) {
        gameStatus.textContent = 'Empate!';
        isGameActive = false;
        resetButton.style.display = 'inline-block'; // Garante que o botão apareça
    }
}

// Função para reiniciar o jogo
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.classList.remove('X', 'O');
        cell.textContent = '';
    });
    gameStatus.textContent = `Jogador ${currentPlayer}, é sua vez!`;
    // Esconder o botão de reset e mostrar os botões de modo
    resetButton.style.display = 'none';
    multiplayerBtn.style.display = 'inline-block';
    botBtn.style.display = 'inline-block';
}

// Função para selecionar o modo de jogo
function selectMode(mode) {
    gameMode = mode;
    isGameActive = true;
    board = ['', '', '', '', '', '', '', '', '']; // Limpa o tabuleiro
    cells.forEach(cell => {
        cell.classList.remove('X', 'O');
        cell.textContent = '';
    });
    gameStatus.textContent = `Jogador ${currentPlayer}, é sua vez!`;
    // Esconde os botões de modo e exibe o botão de reset
    multiplayerBtn.style.display = 'none';
    botBtn.style.display = 'none';
    resetButton.style.display = 'inline-block';
}

// Função para fazer o movimento do jogador
function makeMove(index) {
    if (!isGameActive || board[index] !== '') return;

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer);

    checkWinner();

    // Alterna o jogador após a jogada
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'bot' && currentPlayer === 'O' && isGameActive) {
        botMove(); // Faz o movimento do bot se for a vez do bot
    }
}

// Função para o movimento do bot (AI simples)
function botMove() {
    let availableMoves = board.map((value, index) => value === '' ? index : null).filter(value => value !== null);
    let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove);
}

// Eventos de clique para as células
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        makeMove(index);
    });
});

// Evento de reinício
resetButton.addEventListener('click', resetGame);

// Selecionar modo de jogo
multiplayerBtn.addEventListener('click', () => selectMode('multiplayer'));
botBtn.addEventListener('click', () => selectMode('bot'));