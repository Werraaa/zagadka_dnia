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
            touch-action: none; /* Blokuje domyślne przewijanie na telefonach */
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
            /* Czytelność cyfr na tle obrazków: cień oraz lekkie przyciemnienie */
            text-shadow: 0px 2px 5px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,0,0,0.5);
            transition: transform 100ms ease-in-out;
        }

        /* Styl nakładki końca gry */
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

        /* Responsywność dla urządzeń mobilnych */
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

        <div class="grid-container" id="grid-container">
            </div>
        <div class="tile-container" id="tile-container">
            </div>
    </div>

    <script>
        const GRID_SIZE = 4;
        const CELL_SIZE = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
        const CELL_GAP = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-gap'));
        
        const gridContainer = document.getElementById('grid-container');
        const tileContainer = document.getElementById('tile-container');
        const scoreDisplay = document.getElementById('score');
        const gameMessage = document.getElementById('game-message');

        // URL do repozytorium na GitHubie z obrazkami raw
        const githubImgBaseUrl = "https://raw.githubusercontent.com/Werraaa/zagadka_dnia/main/";

        let board = [];
        let score = 0;

        // Inicjalizacja tła siatki
        function createGridBackground() {
            gridContainer.innerHTML = '';
            for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                gridContainer.appendChild(cell);
            }
        }

        // Rozpoczęcie nowej gry
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

        // Dodanie losowego kafelka (2 lub 4) w wolne miejsce
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

        // Pobranie dynamicznych wymiarów (w razie zmiany wielkości okna/mobilności)
        function getLayoutStyles() {
            const currentCellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
            const currentCellGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-gap'));
            return { currentCellSize, currentCellGap };
        }

        // Rysowanie kafelków na planszy
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
                        
                        // Pobranie zdjęcia z Twojego GitHub z odpowiednią nazwą (np. 2.jpg, 4.jpg, itd.)
                        tile.style.backgroundImage = `url('${githubImgBaseUrl}${value}.jpg')`;

                        // Pozycjonowanie kafelka na siatce
                        let topPosition = r * (currentCellSize + currentCellGap);
                        let leftPosition = c * (currentCellSize + currentCellGap);
                        tile.style.top = `${topPosition}px`;
                        tile.style.left = `${leftPosition}px`;

                        tileContainer.appendChild(tile);
                    }
                }
            }
        }

        // Logika ruchu i łączenia kafelków (ogólna dla wszystkich kierunków)
        function slide(row) {
            // Usuń zera: [2, 0, 2, 4] -> [2, 2, 4]
            let arr = row.filter(val => val !== 0);
            
            // Połącz sąsiednie takie same liczby: [2, 2, 4] -> [4, 0, 4]
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    score += arr[i];
                    arr[i + 1] = 0;
                }
            }
            
            // Ponownie usuń zera i uzupełnij końcówkę zerami do rozmiaru planszy
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

        // Wykonanie ruchu w zadanym kierunku
        function move(direction) {
            let oldBoard = JSON.stringify(board);
            
            // Obracamy planszę tak, aby zawsze wykonywać ruch "w lewo"
            // 0 obrotów dla 'Left', 1 dla 'Down', 2 dla 'Right', 3 dla 'Up'
            let rotations = 0;
            if (direction === 'Down') rotations = 1;
            if (direction === 'Right') rotations = 2;
            if (direction === 'Up') rotations = 3;

            for (let i = 0; i < rotations; i++) rotateBoardClockwise();

            // Przesunięcie kafelków w lewo
            for (let r = 0; r < GRID_SIZE; r++) {
                board[r] = slide(board[r]);
            }

            // Obrót powrotny do oryginalnej orientacji
            let returnRotations = (4 - rotations) % 4;
            for (let i = 0; i < returnRotations; i++) rotateBoardClockwise();

            // Jeśli stan planszy się zmienił, dodaj nowy kafelek i zaktualizuj ekran
            if (oldBoard !== JSON.stringify(board)) {
                addRandomTile();
                scoreDisplay.innerText = score;
                drawTiles();
                if (isGameOver()) {
                    gameMessage.style.display = 'flex';
                }
            }
        }

        // Sprawdzanie czy gra się skończyła
        function isGameOver() {
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (board[r][c] === 0) return false;
                    if (r < GRID_SIZE - 1 && board[r][r] === board[r + 1][c]) return false; // To poprawione niżej dla poprawnych koordynatów
                    if (r < GRID_SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
                    if (c < GRID_SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
                }
            }
            return true;
        }

        // Obsługa klawiatury
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault(); // Blokada scrollowania strony strzałkami
            }
            switch (e.key) {
                case 'ArrowLeft':  move('Left');  break;
                case 'ArrowRight': move('Right'); break;
                case 'ArrowUp':    move('Up');    break;
                case 'ArrowDown':  move('Down');  break;
            }
        });

        // Obsługa sterowania dotykowego (Swipy na telefonach)
        let touchStartX = 0;
        let touchStartY = 0;
        const gameContainer = document.getElementById('game-container');

        gameContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        gameContainer.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].screenX;
            let touchEndY = e.changedTouches[0].screenY;
            
            let diffX = touchEndX - touchStartX;
            let diffY = touchEndY - touchStartY;
            
            // Minimalna odległość przesunięcia, aby uznać to za swipe
            const threshold = 30; 

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) move('Right');
                    else move('Left');
                }
            } else {
                if (Math.abs(diffY) > threshold) {
                    if (diffY > 0) move('Down');
                    else move('Up');
                }
            }
        }, { passive: true });

        function resetGame() {
            initGame();
        }

        // Reagowanie na zmianę rozmiaru okna, by kafelki się odpowiednio skalowały
        window.addEventListener('resize', drawTiles);

        // Start gry przy załadowaniu strony
        initGame();
    </script>
</body>
</html>
