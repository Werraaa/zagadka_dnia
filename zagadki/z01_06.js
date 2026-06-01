// z01_06.js — Gra 2048 dla Zagadka Dnia

function initPuzzle(container) {
    container.innerHTML = `
        <style>
            .game-2048-wrapper {
                font-family: 'Quicksand', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                padding: 20px;
                user-select: none;
            }

            .game-2048-header {
                display: flex;
                align-items: center;
                gap: 30px;
                flex-wrap: wrap;
                justify-content: center;
            }

            .game-2048-title {
                font-family: 'Fredoka One', cursive;
                font-size: 3rem;
                color: #776e65;
                margin: 0;
            }

            .score-container {
                display: flex;
                gap: 10px;
            }

            .score-box {
                background: #bbada0;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-align: center;
                min-width: 80px;
            }

            .score-box-label {
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                opacity: 0.8;
            }

            .score-box-value {
                font-size: 1.5rem;
                font-weight: 700;
            }

            .game-2048-board {
                background: #bbada0;
                border-radius: 12px;
                padding: 12px;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
                touch-action: none;
            }

            .tile-cell {
                width: 80px;
                height: 80px;
                background: rgba(238, 228, 218, 0.35);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 2rem;
                transition: all 0.12s ease;
            }

            .tile-2 { background: #eee4da; color: #776e65; }
            .tile-4 { background: #ede0c8; color: #776e65; }
            .tile-8 { background: #f2b179; color: #f9f6f2; }
            .tile-16 { background: #f59563; color: #f9f6f2; }
            .tile-32 { background: #f67c5f; color: #f9f6f2; }
            .tile-64 { background: #f65e3b; color: #f9f6f2; }
            .tile-128 { background: #edcf72; color: #f9f6f2; font-size: 1.8rem; }
            .tile-256 { background: #edcc61; color: #f9f6f2; font-size: 1.8rem; }
            .tile-512 { background: #edc850; color: #f9f6f2; font-size: 1.8rem; }
            .tile-1024 { background: #edc53f; color: #f9f6f2; font-size: 1.5rem; }
            .tile-2048 { background: #edc22e; color: #f9f6f2; font-size: 1.5rem; box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.5); }
            .tile-super { background: #3c3a32; color: #f9f6f2; font-size: 1.2rem; }

            .game-2048-controls {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                justify-content: center;
            }

            .game-2048-btn {
                background: #8f7a66;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-family: 'Quicksand', sans-serif;
                font-size: 1rem;
                transition: all 0.2s ease;
            }

            .game-2048-btn:hover {
                background: #9f8b77;
                transform: translateY(-2px);
            }

            .game-2048-message {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(238, 228, 218, 0.85);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .game-2048-message.show {
                opacity: 1;
                pointer-events: auto;
            }

            .game-2048-message h2 {
                font-family: 'Fredoka One', cursive;
                font-size: 2.5rem;
                color: #776e65;
                margin: 0 0 20px 0;
            }

            .game-2048-message.win h2 {
                color: #edc22e;
            }

            .board-container {
                position: relative;
            }

            .game-2048-instructions {
                color: #776e65;
                font-size: 0.9rem;
                text-align: center;
                max-width: 350px;
            }

            @media (max-width: 400px) {
                .tile-cell {
                    width: 65px;
                    height: 65px;
                    font-size: 1.5rem;
                }
                .game-2048-board {
                    gap: 8px;
                    padding: 8px;
                }
                .game-2048-title {
                    font-size: 2.5rem;
                }
            }
        </style>

        <div class="game-2048-wrapper" id="game2048">
            <div class="game-2048-header">
                <h2 class="game-2048-title">2048</h2>
                <div class="score-container">
                    <div class="score-box">
                        <div class="score-box-label">Wynik</div>
                        <div class="score-box-value" id="current-score">0</div>
                    </div>
                    <div class="score-box">
                        <div class="score-box-label">Rekord</div>
                        <div class="score-box-value" id="best-score">0</div>
                    </div>
                </div>
            </div>

            <div class="board-container">
                <div class="game-2048-board" id="game-board"></div>
                <div class="game-2048-message" id="game-message">
                    <h2 id="message-text">Koniec gry!</h2>
                    <button class="game-2048-btn" onclick="game2048.restart()">Zagraj ponownie</button>
                </div>
            </div>

            <div class="game-2048-controls">
                <button class="game-2048-btn" onclick="game2048.restart()">🔄 Nowa gra</button>
            </div>

            <p class="game-2048-instructions">
                Użyj <strong>strzałek</strong> lub <strong>przeciągnij palcem</strong>, aby przesuwać kafelki. 
                Połącz takie same liczby, aby uzyskać <strong>2048</strong>!
            </p>
        </div>
    `;

    // --- LOGIKA GRY ---

    const game2048 = {
        board: [],
        score: 0,
        bestScore: parseInt(localStorage.getItem('best2048') || '0'),
        gameOver: false,
        won: false,

        init() {
            this.board = Array(4).fill(null).map(() => Array(4).fill(0));
            this.score = 0;
            this.gameOver = false;
            this.won = false;
            this.addRandomTile();
            this.addRandomTile();
            this.render();
            this.updateScore();
            this.hideMessage();
            this.bindEvents();
        },

        addRandomTile() {
            const emptyCells = [];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (this.board[r][c] === 0) emptyCells.push({ r, c });
                }
            }
            if (emptyCells.length === 0) return;
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        },

        render() {
            const boardEl = document.getElementById('game-board');
            boardEl.innerHTML = '';
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    const val = this.board[r][c];
                    const tile = document.createElement('div');
                    tile.className = 'tile-cell';
                    if (val > 0) {
                        tile.textContent = val;
                        if (val <= 2048) {
                            tile.classList.add(`tile-${val}`);
                        } else {
                            tile.classList.add('tile-super');
                        }
                    }
                    boardEl.appendChild(tile);
                }
            }
        },

        updateScore() {
            document.getElementById('current-score').textContent = this.score;
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('best2048', this.bestScore);
            }
            document.getElementById('best-score').textContent = this.bestScore;
        },

        slide(row) {
            let arr = row.filter(v => v !== 0);
            const missing = 4 - arr.length;
            const zeros = Array(missing).fill(0);
            return zeros.concat(arr);
        },

        combine(row) {
            for (let i = 3; i > 0; i--) {
                if (row[i] === row[i - 1] && row[i] !== 0) {
                    row[i] *= 2;
                    this.score += row[i];
                    row[i - 1] = 0;
                    if (row[i] === 2048 && !this.won) {
                        this.won = true;
                    }
                }
            }
            return row;
        },

        moveRight() {
            let moved = false;
            for (let r = 0; r < 4; r++) {
                const original = [...this.board[r]];
                let row = this.slide(this.board[r]);
                row = this.combine(row);
                row = this.slide(row);
                this.board[r] = row;
                if (original.join(',') !== row.join(',')) moved = true;
            }
            return moved;
        },

        moveLeft() {
            let moved = false;
            for (let r = 0; r < 4; r++) {
                const original = [...this.board[r]];
                let row = this.board[r].slice().reverse();
                row = this.slide(row);
                row = this.combine(row);
                row = this.slide(row);
                this.board[r] = row.reverse();
                if (original.join(',') !== this.board[r].join(',')) moved = true;
            }
            return moved;
        },

        transpose() {
            const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    newBoard[r][c] = this.board[c][r];
                }
            }
            this.board = newBoard;
        },

        moveDown() {
            this.transpose();
            const moved = this.moveRight();
            this.transpose();
            return moved;
        },

        moveUp() {
            this.transpose();
            const moved = this.moveLeft();
            this.transpose();
            return moved;
        },

        move(direction) {
            if (this.gameOver) return;

            let moved = false;
            switch (direction) {
                case 'up': moved = this.moveUp(); break;
                case 'down': moved = this.moveDown(); break;
                case 'left': moved = this.moveLeft(); break;
                case 'right': moved = this.moveRight(); break;
            }

            if (moved) {
                this.addRandomTile();
                this.render();
                this.updateScore();

                if (this.won) {
                    this.showMessage('Wygrałeś! 🎉', true);
                } else if (this.isGameOver()) {
                    this.gameOver = true;
                    this.showMessage('Koniec gry!', false);
                }
            }
        },

        isGameOver() {
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (this.board[r][c] === 0) return false;
                    if (c < 3 && this.board[r][c] === this.board[r][c + 1]) return false;
                    if (r < 3 && this.board[r][c] === this.board[r + 1][c]) return false;
                }
            }
            return true;
        },

        showMessage(text, isWin) {
            const msgEl = document.getElementById('game-message');
            const textEl = document.getElementById('message-text');
            textEl.textContent = text;
            msgEl.classList.add('show');
            msgEl.classList.toggle('win', isWin);
        },

        hideMessage() {
            document.getElementById('game-message').classList.remove('show', 'win');
        },

        restart() {
            this.init();
        },

        bindEvents() {
            // Klawiatura
            document.addEventListener('keydown', (e) => {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    const dir = e.key.replace('Arrow', '').toLowerCase();
                    this.move(dir);
                }
            });

            // Obsługa dotyku
            const board = document.getElementById('game-board');
            let startX, startY;

            board.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });

            board.addEventListener('touchend', (e) => {
                if (!startX || !startY) return;
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = endX - startX;
                const diffY = endY - startY;
                const threshold = 30;

                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (Math.abs(diffX) > threshold) {
                        this.move(diffX > 0 ? 'right' : 'left');
                    }
                } else {
                    if (Math.abs(diffY) > threshold) {
                        this.move(diffY > 0 ? 'down' : 'up');
                    }
                }
                startX = startY = null;
            }, { passive: true });
        }
    };

    // Expose globally for buttons
    window.game2048 = game2048;
    game2048.init();
}
