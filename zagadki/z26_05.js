// Tradycyjna, bezpośrednia deklaracja funkcji globalnej - index.html zauważy ją natychmiast!
function initPuzzle(puzzleContent) {
    
    // Czyszczenie ekranu z domyślnego tekstu ładowania
    puzzleContent.innerHTML = "";

    // --- 1. DYNAMICZNE STYLOWANIE (CSS) ---
    const styles = `
        :root {
            --g2048-grid-size: 4;
            --g2048-cell-size: 80px;
            --g2048-cell-gap: 10px;
        }

        .game-2048-wrapper {
            background-color: #faf8ef;
            color: #776e65;
            font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            border-radius: 10px;
            user-select: none;
            box-sizing: border-box;
            width: 100%;
        }

        .g2048-heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: calc(var(--g2048-cell-size) * var(--g2048-grid-size) + var(--g2048-cell-gap) * (var(--g2048-grid-size) + 1));
            max-width: 100%;
            box-sizing: border-box;
            padding: 0 10px;
            margin-bottom: 15px;
        }

        .g2048-title {
            font-size: 44px;
            font-weight: bold;
            margin: 0;
            color: #776e65;
        }

        .g2048-score-container {
            background: #bbada0;
            padding: 5px 20px;
            font-size: 22px;
            font-weight: bold;
            color: white;
            border-radius: 3px;
            text-align: center;
        }

        .g2048-score-title {
            font-size: 11px;
            color: #eee4da;
            text-transform: uppercase;
            display: block;
        }

        .g2048-game-container {
            position: relative;
            padding: var(--g2048-cell-gap);
            background: #bbada0;
            border-radius: 6px;
            width: calc(var(--g2048-cell-size) * var(--g2048-grid-size) + var(--g2048-cell-gap) * (var(--g2048-grid-size) - 1));
            height: calc(var(--g2048-cell-size) * var(--g2048-grid-size) + var(--g2048-cell-gap) * (var(--g2048-grid-size) - 1));
            box-sizing: content-box;
            touch-action: none;
        }

        .g2048-grid-container {
            position: absolute;
            z-index: 1;
            display: grid;
            grid-template-columns: repeat(var(--g2048-grid-size), var(--g2048-cell-size));
            grid-template-rows: repeat(var(--g2048-grid-size), var(--g2048-cell-size));
            gap: var(--g2048-cell-gap);
        }

        .g2048-grid-cell {
            width: var(--g2048-cell-size);
            height: var(--g2048-cell-size);
            border-radius: 3px;
            background: rgba(238, 228, 218, 0.35);
        }

        .g2048-tile-container {
            position: absolute;
            z-index: 2;
        }

        .g2048-tile {
            position: absolute;
            width: var(--g2048-cell-size);
            height: var(--g2048-cell-size);
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
            transition: transform 100ms ease-in-out, top 100ms, left 100ms;
        }

        .g2048-message {
            display: none;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            background: rgba(238, 228, 218, 0.73);
            z-index: 10;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-radius: 6px;
        }

        .g2048-message p {
            font-size: 40px;
            font-weight: bold;
            margin: 0 0 20px 0;
            color: #776e65;
        }

        .g2048-retry-button {
            background: #8f7a66;
            border-radius: 3px;
            padding: 0 20px;
            color: #f9f6f2;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            font-weight: bold;
            border: none;
            font-size: 16px;
        }

        @media (max-width: 450px) {
            :root {
                --g2048-cell-size: 65px;
                --g2048-cell-gap: 6px;
            }
            .g2048-title { font-size: 32px; }
            .g2048-tile { font-size: 24px; }
        }
    `;

    // Czyszczenie starych styli, jeśli gracz klikał coś wcześniej
    const oldStyle = document.getElementById("g2048-styles");
    if (oldStyle) oldStyle.remove();

    const styleSheet = document.createElement("style");
    styleSheet.id = "g2048-styles";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- 2. BUDOWANIE STRUKTURY HTML ---
    const gameWrapper = document.createElement("div");
    gameWrapper.classList.add("game-2048-wrapper");

    gameWrapper.innerHTML = `
        <div class="g2048-heading">
            <div class="g2048-title">2048</div>
            <div class="g2048-score-container">
                <span class="g2048-score-title">Wynik</span>
                <span id="g2048-score">0</span>
            </div>
        </div>
        <div class="g2048-game-container" id="g2048-game-container">
            <div class="g2048-message" id="g2048-message">
                <p>Koniec Gry!</p>
                <button class="g2048-retry-button" id="g2048-retry">Zagraj ponownie</button>
            </div>
            <div class="g2048-grid-container" id="g2048-grid-container"></div>
            <div class="g2048-tile-container" id="g2048-tile-container"></div>
        </div>
    `;
    puzzleContent.appendChild(gameWrapper);

    // --- 3. LOGIKA SILNIKA GRY ---
    const GRID_SIZE = 4;
    const gridContainer = document.getElementById('g2048-grid-container');
    const tileContainer = document.getElementById('g2048-tile-container');
    const scoreDisplay = document.getElementById('g2048-score');
    const gameMessage = document.getElementById('g2048-message');
    const retryButton = document.getElementById('g2048-retry');

    // Skoro kod jest w /zagadki/ a zdjęcia w katalogu głównym (poziom wyżej), używamy ścieżki relatywnej
    const githubImgBaseUrl = "../";

    let board = [];
    let score = 0;

    function createGridBackground() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('g2048-grid-cell');
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
                if (board[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length > 0) {
            let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function getLayoutStyles() {
        const currentCellSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--g2048-cell-size'));
        const currentCellGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--g2048-cell-gap'));
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
                    tile.classList.add('g2048-tile');
                    tile.innerText = value;
                    
                    // Pobieranie zdjęcia poziom wyżej
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
            for (let c = 0; c < GRID_SIZE; r++) { // poprawione sprawdzanie pętli obrotu
                nextBoard[c][GRID_SIZE - 1 - r] = board[r][c];
            }
        }
        board = nextBoard;
    }
    
    // Uproszczona wersja rotacji bez ryzyka pętli
    function rotateBoard() {
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

        for (let i = 0; i < rotations; i++) rotateBoard();

        for (let r = 0; r < GRID_SIZE; r++) {
            board[r] = slide(board[r]);
        }

        let returnRotations = (4 - rotations) % 4;
        for (let i = 0; i < returnRotations; i++) rotateBoard();

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
                if (r < GRID_SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
                if (c < GRID_SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
            }
        }
        return true;
    }

    // Sterowanie klawiaturą
    const keydownHandler = (e) => {
        if (!document.getElementById('g2048-game-container')) {
            window.removeEventListener('keydown', keydownHandler);
            return;
        }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        switch (e.key) {
            case 'ArrowLeft':  move('Left');  break;
            case 'ArrowRight': move('Right'); break;
            case 'ArrowUp':    move('Up');    break;
            case 'ArrowDown':  move('Down');  break;
        }
    };
    window.addEventListener('keydown', keydownHandler);

    // Sterowanie dotykowe
    let touchStartX = 0;
    let touchStartY = 0;
    const gameContainer = document.getElementById('g2048-game-container');

    gameContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    gameContainer.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        let diffX = touchEndX - touchStartX;
        let diffY = touchEndY - touchStartY;
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

    retryButton.addEventListener('click', initGame);
    
    const resizeHandler = () => {
        if (!document.getElementById('g2048-game-container')) {
            window.removeEventListener('resize', resizeHandler);
            return;
        }
        drawTiles();
    };
    window.addEventListener('resize', resizeHandler);

    // Wywołanie startowe gry
    initGame();
}
