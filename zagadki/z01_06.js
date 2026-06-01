// z01_06.js — Zagadka Dnia: 2048 (z obrazkami)
// Wywoływana przez stronę główną jako: initPuzzle(containerElement)

function initPuzzle(container) {

  // ─── ŚCIEŻKA DO OBRAZKÓW ─────────────────────────────────────────────────────
  // Obrazki leżą w katalogu głównym repozytorium, ładowane przez jsDelivr
  const IMG_BASE = 'https://cdn.jsdelivr.net/gh/Werraaa/zagadka_dnia@main/';

  // Które wartości mają swój obrazek
  const IMG_VALUES = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

  function imgUrl(v) {
    if (IMG_VALUES.includes(v)) return `${IMG_BASE}${v}.jpg`;
    return null;
  }

  // ─── STYLE ──────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

    .p2048-wrap {
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
      font-family: 'DM Sans', sans-serif;
      user-select: none;
    }

    .p2048-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .p2048-title {
      font-family: 'Syne', sans-serif;
      font-size: 3rem;
      font-weight: 800;
      color: #1a3a6c;
      line-height: 1;
      margin: 0;
    }

    .p2048-scores {
      display: flex;
      gap: 10px;
    }

    .p2048-score-box {
      background: #1a3a6c;
      color: white;
      border-radius: 8px;
      padding: 8px 16px;
      text-align: center;
      min-width: 64px;
    }

    .p2048-score-label {
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      opacity: 0.7;
    }

    .p2048-score-val {
      font-family: 'Syne', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      line-height: 1.2;
    }

    .p2048-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
      justify-content: flex-end;
    }

    .p2048-btn {
      background: #bf00ff;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 9px 20px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      letter-spacing: 0.3px;
    }

    .p2048-btn:hover { background: #9900cc; }
    .p2048-btn:active { transform: scale(0.96); }

    .p2048-board-wrap {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
    }

    .p2048-board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #d0d9e8;
      padding: 10px;
      border-radius: 14px;
    }

    .p2048-cell {
      aspect-ratio: 1;
      border-radius: 8px;
      background: #c2cde0;
    }

    .p2048-tiles {
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      pointer-events: none;
    }

    /* Kafelek — kontener */
    .p2048-tile {
      position: absolute;
      border-radius: 8px;
      overflow: hidden;
      transition: top 0.12s ease, left 0.12s ease;
      box-shadow: 0 3px 12px rgba(0,0,0,0.22);
    }

    .p2048-tile.new-tile {
      animation: p2048-pop 0.2s ease forwards;
    }

    .p2048-tile.merge-tile {
      animation: p2048-merge 0.18s ease forwards;
    }

    @keyframes p2048-pop {
      0%   { transform: scale(0); }
      60%  { transform: scale(1.12); }
      100% { transform: scale(1); }
    }

    @keyframes p2048-merge {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    /* Obrazek wypełniający kafelek */
    .p2048-tile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 8px;
    }

    /* Fallback — kafelek bez obrazka (kolorowe tło + liczba na środku) */
    .p2048-tile-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      border-radius: 8px;
    }

    /* Etykieta z liczbą — lewy dolny róg */
    .p2048-tile-label {
      position: absolute;
      bottom: 5px;
      left: 6px;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      line-height: 1;
      /* cień żeby widać było na każdym tle */
      text-shadow:
        0 0 4px rgba(0,0,0,0.9),
        0 1px 3px rgba(0,0,0,0.8),
        1px 1px 0 rgba(0,0,0,0.6);
      color: #fff;
      pointer-events: none;
      z-index: 2;
    }

    /* Delikatne przyciemnienie w dolnej części dla lepszej czytelności etykiety */
    .p2048-tile-shade {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%);
      border-radius: 0 0 8px 8px;
      pointer-events: none;
      z-index: 1;
    }

    .p2048-overlay {
      display: none;
      position: absolute;
      inset: 0;
      border-radius: 14px;
      background: rgba(26,58,108,0.88);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 20;
      animation: p2048-fadein 0.3s ease;
    }

    .p2048-overlay.visible { display: flex; }

    @keyframes p2048-fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .p2048-overlay-msg {
      font-family: 'Syne', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: white;
      text-align: center;
    }

    .p2048-overlay-sub {
      color: rgba(255,255,255,0.7);
      font-size: 0.9rem;
      text-align: center;
    }

    .p2048-hint {
      margin-top: 12px;
      font-size: 0.78rem;
      color: #7f8c8d;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  // ─── FALLBACK TILE COLORS (gdy brak obrazka) ────────────────────────────────
  const TILE_STYLES = {
    2:    { bg: '#eef6ff', color: '#1a3a6c', fs: '1.7rem' },
    4:    { bg: '#d9ecff', color: '#1a3a6c', fs: '1.7rem' },
    8:    { bg: '#bf00ff', color: '#ffffff', fs: '1.7rem' },
    16:   { bg: '#9900cc', color: '#ffffff', fs: '1.6rem' },
    32:   { bg: '#1a3a6c', color: '#ffffff', fs: '1.6rem' },
    64:   { bg: '#0d2345', color: '#ffffff', fs: '1.5rem' },
    128:  { bg: '#d4a000', color: '#ffffff', fs: '1.3rem' },
    256:  { bg: '#c47f00', color: '#ffffff', fs: '1.3rem' },
    512:  { bg: '#b05e00', color: '#ffffff', fs: '1.2rem' },
    1024: { bg: '#8b3a00', color: '#ffffff', fs: '1rem'  },
    2048: { bg: '#ff2d55', color: '#ffffff', fs: '1rem'  },
  };

  function tileStyle(v) {
    return TILE_STYLES[v] || { bg: '#333', color: '#fff', fs: '0.85rem' };
  }

  // Rozmiar etykiety zależy od długości liczby
  function labelSize(v) {
    const len = String(v).length;
    if (len <= 2) return '0.85rem';
    if (len === 3) return '0.72rem';
    return '0.6rem';
  }

  // ─── HTML STRUCTURE ──────────────────────────────────────────────────────────
  container.innerHTML = `
    <div class="p2048-wrap">
      <div class="p2048-header">
        <div class="p2048-title">2048</div>
        <div class="p2048-scores">
          <div class="p2048-score-box">
            <div class="p2048-score-label">Wynik</div>
            <div class="p2048-score-val" id="p2048-score">0</div>
          </div>
          <div class="p2048-score-box">
            <div class="p2048-score-label">Rekord</div>
            <div class="p2048-score-val" id="p2048-best">0</div>
          </div>
        </div>
      </div>
      <div class="p2048-controls">
        <button class="p2048-btn" id="p2048-undo">↩ Cofnij</button>
        <button class="p2048-btn" id="p2048-new">Nowa gra</button>
      </div>
      <div class="p2048-board-wrap" id="p2048-board-wrap">
        <div class="p2048-board" id="p2048-board"></div>
        <div class="p2048-tiles" id="p2048-tiles"></div>
        <div class="p2048-overlay" id="p2048-overlay">
          <div class="p2048-overlay-msg" id="p2048-overlay-msg">Koniec gry!</div>
          <div class="p2048-overlay-sub" id="p2048-overlay-sub">Żaden ruch nie jest możliwy.</div>
          <button class="p2048-btn" id="p2048-restart-btn">Zagraj ponownie</button>
        </div>
      </div>
      <div class="p2048-hint">Steruj strzałkami ↑↓←→ lub przeciągaj palcem</div>
    </div>
  `;

  // ─── BOARD CELLS (statyczne tło) ─────────────────────────────────────────────
  const boardEl = document.getElementById('p2048-board');
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.className = 'p2048-cell';
    boardEl.appendChild(cell);
  }

  // ─── STATE ───────────────────────────────────────────────────────────────────
  let grid, score, prevGrid, prevScore, best, gameOver, won;

  function loadBest() {
    try { return parseInt(localStorage.getItem('p2048-best') || '0'); } catch { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem('p2048-best', v); } catch {}
  }

  function newGame() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    prevGrid = null;
    prevScore = 0;
    gameOver = false;
    won = false;
    best = loadBest();
    document.getElementById('p2048-overlay').classList.remove('visible');
    addRandom();
    addRandom();
    render();
  }

  // ─── GAME LOGIC ──────────────────────────────────────────────────────────────
  function addRandom() {
    const empty = [];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        if (!grid[r][c]) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function copyGrid(g) { return g.map(row => [...row]); }

  function slideRow(row) {
    let nums = row.filter(v => v);
    let merged = [];
    let gained = 0;
    let i = 0;
    while (i < nums.length) {
      if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
        merged.push(nums[i] * 2);
        gained += nums[i] * 2;
        i += 2;
      } else {
        merged.push(nums[i]);
        i++;
      }
    }
    while (merged.length < 4) merged.push(0);
    return { row: merged, gained };
  }

  function move(dir) {
    prevGrid = copyGrid(grid);
    prevScore = score;

    let moved = false;
    let gained = 0;

    for (let i = 0; i < 4; i++) {
      let row;
      if (dir === 0) row = grid[i];
      else if (dir === 1) row = [...grid[i]].reverse();
      else if (dir === 2) row = [grid[0][i], grid[1][i], grid[2][i], grid[3][i]];
      else row = [grid[3][i], grid[2][i], grid[1][i], grid[0][i]];

      const { row: newRow, gained: g } = slideRow(row);
      gained += g;

      if (dir === 0) {
        if (grid[i].join() !== newRow.join()) moved = true;
        grid[i] = newRow;
      } else if (dir === 1) {
        const rev = [...newRow].reverse();
        if (grid[i].join() !== rev.join()) moved = true;
        grid[i] = rev;
      } else if (dir === 2) {
        for (let r = 0; r < 4; r++) {
          if (grid[r][i] !== newRow[r]) moved = true;
          grid[r][i] = newRow[r];
        }
      } else {
        const rev = [...newRow].reverse();
        for (let r = 0; r < 4; r++) {
          if (grid[r][i] !== rev[r]) moved = true;
          grid[r][i] = rev[r];
        }
      }
    }

    if (!moved) return;

    score += gained;
    if (score > best) { best = score; saveBest(best); }

    addRandom();
    render();

    if (!won && grid.some(row => row.includes(2048))) {
      won = true;
      showOverlay('🎉 Wygrałeś!', 'Osiągnąłeś kafelek 2048!');
    } else if (isGameOver()) {
      gameOver = true;
      showOverlay('Koniec gry!', 'Żaden ruch nie jest możliwy.');
    }
  }

  function isGameOver() {
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) {
        if (!grid[r][c]) return false;
        if (c < 3 && grid[r][c] === grid[r][c+1]) return false;
        if (r < 3 && grid[r][c] === grid[r+1][c]) return false;
      }
    return true;
  }

  function undo() {
    if (!prevGrid) return;
    grid = prevGrid;
    score = prevScore;
    prevGrid = null;
    gameOver = false;
    document.getElementById('p2048-overlay').classList.remove('visible');
    render();
  }

  function showOverlay(msg, sub) {
    document.getElementById('p2048-overlay-msg').textContent = msg;
    document.getElementById('p2048-overlay-sub').textContent = sub;
    document.getElementById('p2048-overlay').classList.add('visible');
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  function render() {
    document.getElementById('p2048-score').textContent = score;
    document.getElementById('p2048-best').textContent = best;

    const tilesEl = document.getElementById('p2048-tiles');
    tilesEl.innerHTML = '';

    const boardRect = boardEl.getBoundingClientRect();
    const gap = 10;
    const size = (boardRect.width - gap * 5) / 4;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const v = grid[r][c];
        if (!v) continue;

        const tile = document.createElement('div');
        tile.className = 'p2048-tile';
        tile.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          top: ${r * (size + gap)}px;
          left: ${c * (size + gap)}px;
        `;

        const url = imgUrl(v);

        if (url) {
          // ── Kafelek z obrazkiem ──
          const img = document.createElement('img');
          img.className = 'p2048-tile-img';
          img.src = url;
          img.alt = v;
          // Fallback na błąd ładowania — pokaż kolorowe tło
          img.onerror = () => {
            img.style.display = 'none';
            const s = tileStyle(v);
            tile.style.background = s.bg;
            label.style.fontSize = s.fs;
            label.style.position = 'static';
            label.style.textShadow = 'none';
            label.style.color = s.color;
            shade.style.display = 'none';
          };
          tile.appendChild(img);

          // Gradient cień dla czytelności etykiety
          const shade = document.createElement('div');
          shade.className = 'p2048-tile-shade';
          tile.appendChild(shade);

          // Etykieta liczbowa
          const label = document.createElement('div');
          label.className = 'p2048-tile-label';
          label.style.fontSize = labelSize(v);
          label.textContent = v;
          tile.appendChild(label);

        } else {
          // ── Fallback: kolorowy kafelek bez obrazka ──
          const s = tileStyle(v);
          const fb = document.createElement('div');
          fb.className = 'p2048-tile-fallback';
          fb.style.cssText = `background:${s.bg}; color:${s.color}; font-size:${s.fs};`;
          fb.textContent = v;
          tile.appendChild(fb);
        }

        tilesEl.appendChild(tile);
      }
    }
  }

  // ─── INPUT: KEYBOARD ─────────────────────────────────────────────────────────
  function onKey(e) {
    const map = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 };
    if (map[e.key] !== undefined && !gameOver) {
      e.preventDefault();
      move(map[e.key]);
    }
  }
  document.addEventListener('keydown', onKey);

  // ─── INPUT: TOUCH / SWIPE ────────────────────────────────────────────────────
  let touchStart = null;
  const boardWrap = document.getElementById('p2048-board-wrap');

  boardWrap.addEventListener('touchstart', e => {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  boardWrap.addEventListener('touchend', e => {
    if (!touchStart || gameOver) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return;
    if (absDx > absDy) move(dx > 0 ? 1 : 0);
    else move(dy > 0 ? 3 : 2);
    touchStart = null;
  }, { passive: true });

  // ─── BUTTONS ─────────────────────────────────────────────────────────────────
  document.getElementById('p2048-new').addEventListener('click', newGame);
  document.getElementById('p2048-undo').addEventListener('click', undo);
  document.getElementById('p2048-restart-btn').addEventListener('click', newGame);

  // ─── START ───────────────────────────────────────────────────────────────────
  newGame();
  window.addEventListener('resize', render);
}
