/**
 * Zagadka Dnia: 13 Maja (Połączenia + Nonogram 25x25)
 * Nazwa pliku: z13_05.js
 */

function initPuzzle(container) {
    // 1. STYLE CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .puzzle-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; user-select: none; font-family: sans-serif; background: #1a1a1a; padding: 20px; border-radius: 15px; color: #fff; }
        .hidden { display: none !important; }
        
        /* SEKCJA 1: POŁĄCZENIA */
        .grid-conn { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 600px; margin: 20px 0; }
        .tile { aspect-ratio: 1/1; background: #2c2c2c; border: 2px solid #444; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; font-weight: bold; text-align: center; padding: 5px; text-transform: uppercase; color: #e1e1e1; transition: transform 0.1s; }
        .tile:hover { background: #3d3d3d; }
        .tile.selected { background: #bb86fc; color: #000; border-color: #fff; }
        .tile.wrong { background: #cf6679; animation: shake 0.4s; }
        .group { padding: 15px; margin: 5px 0; border-radius: 10px; color: white; font-weight: bold; width: 100%; max-width: 600px; text-align: center; font-size: 14px; }

        /* SEKCJA 2: NONOGRAM 25x25 */
        .nonogram-layout { display: inline-grid; grid-template-columns: 120px auto; background: #fff; padding: 10px; border-radius: 8px; color: #000; margin-top: 20px; overflow-x: auto; max-width: 100%; }
        .hints-top { display: grid; grid-template-columns: repeat(25, 22px); grid-column: 2; height: 100px; }
        .hints-left { display: grid; grid-template-rows: repeat(25, 22px); grid-row: 2; width: 120px; }
        .grid-nonogram { display: grid; grid-template-columns: repeat(25, 22px); grid-template-rows: repeat(25, 22px); border: 2px solid #000; grid-column: 2; grid-row: 2; background: #ccc; gap: 1px; }
        
        .cell { width: 22px; height: 22px; background: #fff; border: 1px solid #eee; cursor: crosshair; box-sizing: border-box; position: relative; }
        .cell.marked-x::after { content: "×"; color: red; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; font-weight: bold; }
        
        /* Kolory Nonogramu */
        .c-1 { background-color: #000000 !important; }
        .c-2 { background-color: #ffffff !important; border: 1px solid #ddd; }
        .c-3 { background-color: #ff0000 !important; }
        .c-4 { background-color: #ffd700 !important; }
        .c-5 { background-color: #ffc0cb !important; }
        .c-6 { background-color: #f5f5dc !important; }
        .c-7 { background-color: #0000ff !important; }
        .c-8 { background-color: #000080 !important; }
        
        .hint-group { display: flex; background: #f8f8f8; font-size: 10px; font-weight: 900; box-sizing: border-box; }
        .h-t { flex-direction: column; justify-content: flex-end; align-items: center; border-left: 1px solid #ddd; padding-bottom: 2px; }
        .h-l { flex-direction: row; justify-content: flex-end; align-items: center; border-top: 1px solid #ddd; padding-right: 5px; gap: 2px; }

        /* PRZYCISKI */
        .btn-check { background: #4caf50; color: white; border: none; padding: 12px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; margin: 10px; transition: 0.3s; }
        .btn-check:hover { opacity: 0.8; transform: scale(1.05); }
        .btn-brush { width: 35px; height: 35px; border-radius: 6px; border: 2px solid #444; cursor: pointer; position: relative; }
        .btn-brush.active { border-color: #bb86fc; transform: scale(1.1); box-shadow: 0 0 10px #bb86fc; }

        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    `;
    document.head.appendChild(style);

    // 2. STRUKTURA HTML
    container.innerHTML = `
        <div class="puzzle-wrapper">
            <h2 id="puzzle-title">Zagadka Dnia: Połączenia</h2>
            
            <div id="section-connections">
                <div id="solved-box"></div>
                <div class="grid-conn" id="conn-grid"></div>
                <button class="btn-check" id="btn-check-conn">Zatwierdź grupę (4)</button>
            </div>

            <div id="section-nonogram" class="hidden">
                <h3>Ułóż obrazek logiczny</h3>
                <div id="brush-panel" style="margin-bottom: 15px; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; background: #333; padding: 10px; border-radius: 10px;">
                    <button class="btn-brush active" data-color="1" style="background:#000" title="Czarny"></button>
                    <button class="btn-brush" data-color="2" style="background:#fff" title="Biały"></button>
                    <button class="btn-brush" data-color="3" style="background:#f00" title="Czerwony"></button>
                    <button class="btn-brush" data-color="4" style="background:#ffd700" title="Złoty"></button>
                    <button class="btn-brush" data-color="5" style="background:#ffc0cb" title="Różowy"></button>
                    <button class="btn-brush" data-color="6" style="background:#f5f5dc" title="Beżowy"></button>
                    <button class="btn-brush" data-color="7" style="background:#00f" title="Niebieski"></button>
                    <button class="btn-brush" data-color="8" style="background:#000080" title="Ciemny Niebieski"></button>
                    <button class="btn-brush" data-color="x" style="background:#eee; color: red; font-size: 20px; font-weight: bold; display: flex; align-items: center; justify-content: center;">×</button>
                    <button class="btn-brush" data-color="0" style="background:#fff; border: 1px dashed #000; font-size: 8px; color: #000;">GUMKA</button>
                </div>
                <div class="nonogram-layout">
                    <div style="background:#eee; grid-row: 1; grid-column: 1;"></div>
                    <div id="t-hints" class="hints-top"></div>
                    <div id="l-hints" class="hints-left"></div>
                    <div id="n-grid" class="grid-nonogram"></div>
                </div>
                <br>
                <button class="btn-check" id="btn-check-nono">Sprawdź Nonogram</button>
            </div>

            <div id="final-section" class="hidden" style="text-align: center;">
                <h1 style="color: #bb86fc;">🎉 BRAWO! 🎉</h1>
                <p>Rozwiązałeś wszystkie dzisiejsze zagadki!</p>
            </div>
        </div>
    `;

    // 3. LOGIKA GRY
    let isMouseDown = false;
    let currentBrush = '1';
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);

    // --- LOGIKA: POŁĄCZENIA ---
    const connCats = [
        { name: "Schodki", words: ["Schody","Kamień","Piwo","Rzut"], color: "#845ef7" },
        { name: "Debilard", words: ["Debil","Diament","Kij","Gra"], color: "#f59f00" },
        { name: "Trip do kela", words: ["Sushi","Zamek","Autobus","Gwiazdy"], color: "#2b8a3e" },
        { name: "Kamienie w Polsce", words: ["Agat","Ametyst","Fluoryt","Gips"], color: "#c92a2a" }
    ];

    let connWords = [];
    connCats.forEach(c => c.words.forEach(w => connWords.push({w, cat: c.name, col: c.color})));
    let connSelected = [];
    let connSolvedCount = 0;

    function renderConn() {
        const g = document.getElementById("conn-grid");
        g.innerHTML = "";
        connWords.forEach(item => {
            const d = document.createElement("div");
            d.className = "tile"; 
            d.innerText = item.w;
            if (connSelected.includes(item)) d.classList.add("selected");
            d.onclick = () => {
                if(connSelected.includes(item)) {
                    connSelected = connSelected.filter(i=>i!==item);
                } else if(connSelected.length < 4) {
                    connSelected.push(item);
                }
                renderConn();
            };
            g.appendChild(d);
        });
    }

    document.getElementById("btn-check-conn").onclick = () => {
        if(connSelected.length !== 4) return;
        const cat = connSelected[0].cat;
        if(connSelected.every(i => i.cat === cat)) {
            connSolvedCount++;
            const group = document.createElement("div");
            group.className = "group"; group.style.background = connSelected[0].col;
            group.innerHTML = `<strong>${cat.toUpperCase()}</strong><br>${connSelected.map(i=>i.w).join(", ")}`;
            document.getElementById("solved-box").appendChild(group);
            
            const ws = connSelected.map(i=>i.w);
            connWords = connWords.filter(i => !ws.includes(i.w));
            connSelected = [];
            renderConn();

            if(connSolvedCount === 4) {
                setTimeout(() => {
                    document.getElementById("section-connections").classList.add("hidden");
                    document.getElementById("section-nonogram").classList.remove("hidden");
                    document.getElementById("puzzle-title").innerText = "Zagadka Dnia: Nonogram";
                    initNonogram();
                }, 1000);
            }
        } else {
            document.querySelectorAll(".tile.selected").forEach(t => {
                t.classList.add("wrong");
                setTimeout(() => t.classList.remove("wrong", "selected"), 500);
            });
            connSelected = [];
        }
    };

    // --- LOGIKA: NONOGRAM ---
    const nonoSol = [
        "1111111112111111111111111",
        "1111111122211122213331111",
        "1111111122233233233233311",
        "1111113322332332232222333",
        "1111133322322222142222223",
        "1111333522222233414222221",
        "1113331522222233342226666",
        "1113325525552234444266777",
        "1133222225152246616477777",
        "1133252222522241666477777",
        "1132255222222346661477777",
        "1332222222222324614477777",
        "1332222222233224441177781",
        "1338822277632233333178888",
        "1338887777622222331888888",
        "1138887777622222118888888",
        "1138887777662222288888881",
        "1133877777766111688888883",
        "1133377777776111688888833",
        "1113377777776111638888331",
        "1113377777776666633333331",
        "1113377777777777333333111",
        "1113377777777773333111111",
        "1111337777777733311111111",
        "1111117777777331111111111"
    ].map(row => row.split(''));

    function getHints(arr) {
        let h = [], c = 0, l = '0';
        arr.forEach(v => {
            if(v !== '0') {
                if(v === l) c++;
                else { if(c > 0) h.push({c, t: l}); c = 1; l = v; }
            } else { if(c > 0) h.push({c, t: l}); c = 0; l = '0'; }
        });
        if(c > 0) h.push({c, t: l});
        return h.length ? h : [{c:0, t:'1'}];
    }

    function initNonogram() {
        const g = document.getElementById("n-grid");
        const lh = document.getElementById("l-hints");
        const th = document.getElementById("t-hints");
        
        const hintColorMap = {
            '1': '#000', '2': '#999', '3': '#f00', '4': '#b8860b', 
            '5': '#ff69b4', '6': '#8b4513', '7': '#00f', '8': '#000080'
        };

        // Hints Left & Cells
        for(let r=0; r<25; r++) {
            const hints = getHints(nonoSol[r]);
            const d = document.createElement("div"); d.className="hint-group h-l";
            hints.forEach(h => {
                const s = document.createElement("span"); 
                s.style.color = hintColorMap[h.t]; s.innerText = h.c; 
                d.appendChild(s);
            });
            lh.appendChild(d);

            for(let c=0; c<25; c++) {
                const cell = document.createElement("div"); cell.className="cell";
                cell.dataset.r = r; cell.dataset.c = c;
                cell.onmousedown = (e) => { e.preventDefault(); paintCell(cell); };
                cell.onmouseenter = () => { if(isMouseDown) paintCell(cell); };
                g.appendChild(cell);
            }
        }

        // Hints Top
        for(let c=0; c<25; c++) {
            const col = []; for(let r=0; r<25; r++) col.push(nonoSol[r][c]);
            const hints = getHints(col);
            const d = document.createElement("div"); d.className="hint-group h-t";
            hints.forEach(h => {
                const s = document.createElement("span");
                s.style.color = hintColorMap[h.t]; s.innerText = h.c;
                d.appendChild(s);
            });
            th.appendChild(d);
        }
    }

    function paintCell(cell) {
        cell.className = "cell";
        if(currentBrush === 'x') cell.classList.add("marked-x");
        else if(currentBrush !== '0') cell.classList.add("c-" + currentBrush);
    }

    document.querySelectorAll('.btn-brush').forEach(btn => {
        btn.onclick = () => {
            currentBrush = btn.dataset.color;
            document.querySelectorAll('.btn-brush').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    document.getElementById("btn-check-nono").onclick = () => {
        const cells = document.querySelectorAll("#n-grid .cell");
        let ok = true;
        cells.forEach(cell => {
            const r = cell.dataset.r, c = cell.dataset.c;
            const sol = nonoSol[r][c];
            const hasColor = cell.classList.contains("c-" + sol);
            
            // Jeśli w rozwiązaniu nie jest "0" (puste), komórka musi mieć kolor
            if(sol !== '0' && !hasColor) ok = false;
            // Jeśli użytkownik zamalował coś, co powinno być puste
            if(sol === '0' && cell.classList.length > 1 && !cell.classList.contains("marked-x")) ok = false;
        });

        if(ok) {
            document.getElementById("section-nonogram").classList.add("hidden");
            document.getElementById("final-section").classList.remove("hidden");
        } else {
            alert("Obrazek zawiera błędy! Sprawdź kolory i wolne pola.");
        }
    };

    // Start
    connWords.sort(() => Math.random() - 0.5);
    renderConn();
}
