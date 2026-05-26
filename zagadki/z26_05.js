<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gra 2048 - Zagadka Dnia</title>
    <style>
        :root {
            --grid-size: 4;
            --cell-size: 80px;
            --cell-gap: 10px;
        }

        body {
            background-color: #faf8ef;
            color: #776e65;
            font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            user-select: none;
            overflow: hidden;
        }

        .heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: calc(var(--cell-size) * var(--grid-size) + var(--cell-gap) * (var(--grid-size) + 1));
            max-width: 100%;
            box-sizing: border-box;
            padding: 0 10px;
        }

        h1 {
            font-size: 48px;
            font-weight: bold;
            margin: 0;
        }

        .score-container {
            background: #bbada0;
            padding: 5px 20px;
            font-size: 25px;
            font-weight: bold;
            color: white;
            border-radius: 3px;
            text-align: center;
        }

        .score-title {
            font-size: 13px;
            color: #eee4da;
            text-transform: uppercase;
            display: block;
        }

        .game-container {
            position: relative;
            padding: var(--cell-gap);
            background: #bbada0;
            border-radius: 6px;
            width: calc(var(--cell-size) * var(--grid-size) + var(--cell-gap) * (var(--grid-size) - 1));
            height: calc(var(--cell-size) * var(--grid-size) + var(--cell-gap) * (var(--grid-size) - 1));
            box-sizing: content-box;
            touch-action: none;
        }

        .grid-container {
            position: absolute;
            z-index: 1;
            display: grid;
            grid-template-columns: repeat(var(--grid-size), var(--cell-size));
            grid-template-rows: repeat(var(--grid-size), var(--cell-size));
            gap: var(--cell-gap);
        }

        .grid-cell {
            width: var(--cell-size);
            height: var(--cell-size);
            border-radius: 3px;
            background: rgba(238, 228, 218, 0.35);
        }

        .tile-container {
            position: absolute;
            z-index: 2;
        }

        .tile {
            position: absolute;
            width: var(--cell-size);
            height: var(--cell-size);
            border-radius: 3px;
            background-size: cover;
            background-position: center;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 32px;
            color: #fff;
            text-shadow: 0px 2px 5px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,0,0,0.5);
            transition: transform 100ms ease-in-out;
        }

        .game-message {
            display: none;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            background: rgba(238, 228, 218, 0.73);
            z-index: 10;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            animation: fadeIn 800ms ease-in-out both;
        }

        .game-message p {
            font-size: 60px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .retry-button {
            background: #8f7a66;
            border-radius: 3px;
            padding: 0 20px;
            text-decoration: none;
            color: #f9f6f2;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            font-weight: bold;
            border: none;
            font-size: 18px;
        }

        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        @media (max-width: 450px) {
            :root {
                --cell-size: 70px;
                --cell-gap: 7px;
            }
            h1 { font-size: 36px; }
            .tile { font-size: 26px; }
        }
    </style>
</head>
<body>

    <div class="heading">
        <h1>2048</h1>
        <div class="score-container">
            <span class="score-title">Wynik</span>
            <span id="score">0</span>
        </div>
    </div>

    <div class="game-container" id="game-container">
        <div class="game-message" id="game-message">
            <p id="game-over-text">Koniec Gry!</p>
            <button class="retry-button" onclick="resetGame()">Zagraj ponownie</button>
        </div>

        <div class="grid-container" id="grid-container"></div>
        <div class="tile-container" id="tile-container"></div>
    </div>

    <script>
        const GRID_SIZE = 4;
        
        const gridContainer = document.getElementById('grid-container');
        const tileContainer = document.getElementById('tile-container');
        const scoreDisplay = document.getElementById('score');
        const gameMessage = document.getElementById('game-message');

        // Ścieżka relatywna wskazująca wyjście z folderu "zagadki" poziom wyżej, do głównego katalogu ze zdjęciami
        const githubImgBaseUrl = "../";

        let board = [];
        let score = 0;

        function createGridBackground() {
            gridContainer.innerHTML = '';
            for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                gridContainer.appendChild(cell);
            }
        }

        function initGame() {
            createGridBackground();
            board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
            score = 0;
            scoreDisplay.innerText = score;
            gameMessage.style.display = 'none';
            
            addRandomTile();
            addRandomTile();
            drawTiles();
        }

        function addRandomTile() {
            let emptyCells = [];
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (board[r][c] === 0) {
                        emptyCells.push({ r, c });
                    }
                }
            }
            if (emptyCells.length > 0) {
                let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                board[r][c] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        function getLayoutStyles() {
            const currentCellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
            const currentCellGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-gap'));
            return { currentCellSize, currentCellGap };
        }

        function drawTiles() {
            tileContainer.innerHTML = '';
            const { currentCellSize, currentCellGap } = getLayoutStyles();

            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    let value = board[r][c];
                    if (value > 0) {
                        const tile = document.createElement('div');
                        tile.classList.add('tile');
                        tile.innerText = value;
                        
                        // Ładowanie obrazka z folderu poziom wyżej
                        tile.style.backgroundImage = `url('${githubImgBaseUrl}${value}.jpg')`;

                        let topPosition = r * (currentCellSize + currentCellGap);
                        let leftPosition = c * (currentCellSize + currentCellGap);
                        tile.style.top = `${topPosition}px`;
                        tile.style.left = `${leftPosition}px`;

                        tileContainer.appendChild(tile);
                    }
                }
            }
        }

        function slide(row) {
            let arr = row.filter(val => val !== 0);
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    score += arr[i];
                    arr[i + 1] = 0;
                }
            }
            arr = arr.filter(val => val !== 0);
            while (arr.length < GRID_SIZE) {
                arr.push(0);
            }
            return arr;
        }

        function rotateBoardClockwise() {
            let nextBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    nextBoard[c][GRID_SIZE - 1 - r] = board[r][c];
                }
            }
            board = nextBoard;
        }

        function move(direction) {
            let oldBoard = JSON.stringify(board);
            let rotations = 0;
            
            if (direction === 'Down') rotations = 1;
            if (direction === 'Right') rotations = 2;
            if (direction === 'Up') rotations = 3;

            for (let i = 0; i < rotations; i++) rotateBoardClockwise();

            for (let r = 0; r < GRID_SIZE; r++) {
                board[r] = slide(board[r]);
            }

            let returnRotations = (4 - rotations) % 4;
            for (let i = 0; i < returnRotations; i++) rotateBoardClockwise();

            if (oldBoard !== JSON.stringify(board)) {
                addRandomTile();
                scoreDisplay.innerText = score;
                drawTiles();
                if (isGameOver()) {
                    gameMessage.style.display = 'flex';
                }
            }
        }

        function isGameOver() {
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (board[r][c] === 0) return false;
                    if (r < GRID
