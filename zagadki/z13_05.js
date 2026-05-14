
/**
 * Zagadka Dnia: 13 Maja (Połączenia + Nonogram + Rebus)
 * Nazwa pliku: z13_05.js
 */

function initPuzzle(container) {
    // 1. Definiujemy style CSS specyficzne dla tej zagadki
    const style = document.createElement('style');
    style.innerHTML = `
        .puzzle-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; user-select: none; }
        .hidden { display: none !important; }
        
        /* SEKCJA 1: POŁĄCZENIA */
        .grid-conn { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 500px; margin: 20px 0; }
        .tile { aspect-ratio: 1/1; background: #2c2c2c; border: 2px solid #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 11px; font-weight: bold; text-align: center; padding: 5px; text-transform: uppercase; color: #e1e1e1; }
        .tile.selected { background: #bb86fc; color: #000; }
        .tile.wrong { background: #cf6679; animation: shake 0.4s; }
        .group { padding: 15px; margin: 5px 0; border-radius: 10px; color: white; font-weight: bold; width: 100%; max-width: 500px; text-align: center; font-size: 14px; }

        /* SEKCJA 2: NONOGRAM */
        .nonogram-layout { display: inline-grid; grid-template-columns: 100px auto; background: white; padding: 15px; border-radius: 8px; color: #000; margin-top: 20px; }
        .hints-top { display: grid; grid-template-columns: repeat(20, 30px); grid-column: 2; }
        .hints-left { display: grid; grid-template-rows: repeat(5, 30px); grid-row: 2; }
        .grid-nonogram { display: grid; grid-template-columns: repeat(20, 30px); grid-template-rows: repeat(5, 30px); border: 2px solid #000; grid-column: 2; grid-row: 2; }
        .cell { width: 30px; height: 30px; border: 1px solid #ccc; cursor: crosshair; box-sizing: border-box; position: relative; background: #fff; }
        .cell.marked-x::after { content: "×"; color: red; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 20px; font-weight: bold; }
        
        /* Kolory komórek */
        .c-c { background-color: #000000 !important; } .c-r { background-color: #ff0000 !important; }
        .c-n { background-color: #0000ff !important; } .c-z { background-color: #008000 !important; }
        .c-b { background-color: #8d4925 !important; } .c-p { background-color: #ffa500 !important; }
        
        .hint-group { display: flex; background: #fff; font-size: 11px; font-weight: 900; box-sizing: border-box; }
        .h-t { flex-direction: column; justify-content: flex-end; align-items: center; border-left: 1px solid #eee; padding-bottom: 5px; }
        .h-l { flex-direction: row; justify-content: flex-end; align-items: center; border-top: 1px solid #eee; padding-right: 8px; gap: 4px; }

        /* INPUTY I PRZYCISKI */
        .puzzle-input { padding: 12px; width: 280px; border-radius: 5px; border: 1px solid #444; background: #222; color: #fff; font-size: 16px; margin-bottom: 10px; }
        .btn-check { background: #4caf50; color: white; border: none; padding: 12px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; margin: 10px; }
        .btn-brush { width: 40px; height: 40px; border-radius: 8px; border: 2px solid transparent; cursor: pointer; }
        .btn-brush.active { border-color: #bb86fc; box-shadow: 0 0 8px #bb86fc; }

        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    `;
    document.head.appendChild(style);

    // 2. Struktura HTML zagadki
    container.innerHTML = `
        <div class="puzzle-wrapper">
            <div id="section-connections">
                <div id="solved-box"></div>
                <div class="grid-conn" id="conn-grid"></div>
                <button class="btn-check" id="btn-check-conn">Sprawdź połączenie</button>
            </div>

            <button id="btn-go-to-nono" class="hidden btn-check" style="background: #bb86fc;">Zagadka 2: Obrazek</button>

            <div id="section-nonogram" class="hidden">
                <div id="brush-panel" style="margin-bottom: 15px; display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn-brush active" data-color="c" style="background:#000"></button>
                    <button class="btn-brush" data-color="r" style="background:#f00"></button>
                    <button class="btn-brush" data-color="n" style="background:#00f"></button>
                    <button class="btn-brush" data-color="z" style="background:#008000"></button>
                    <button class="btn-brush" data-color="b" style="background:#8d4925"></button>
                    <button class="btn-brush" data-color="p" style="background:#ffa500"></button>
                    <button class="btn-brush" data-color="x" style="background:#eee; color: red; font-size: 24px; font-weight: bold; padding: 0;">×</button>
                    <button class="btn-brush" data-color="0" style="background:#fff; border: 1px dashed #000; color: #000; font-size: 10px;">GUMKA</button>
                </div>
                <div class="nonogram-layout">
                    <div style="background:#eee; grid-row: 1; grid-column: 1;"></div>
                    <div id="t-hints" class="hints-top"></div>
                    <div id="l-hints" class="hints-left"></div>
                    <div id="n-grid" class="grid-nonogram"></div>
                </div>
                <br>
                <button class="btn-check" id="btn-check-nono">Zatwierdź obrazek</button>

                <div id="rebus-section" class="hidden" style="margin-top: 20px; text-align: center;">
                    <img src="rebus.png" id="rebus-img" style="border: 2px solid #bb86fc; max-width: 100%; margin-bottom: 15px;">
                    <br>
                    <input type="text" id="rebus-input" class="puzzle-input" placeholder="Wpisz hasło...">
                    <br>
                    <button class="btn-check" id="btn-check-rebus">Sprawdź Hasło</button>
                </div>
            </div>

            <div id="final-section" class="hidden" style="text-align: center;">
                <h2 style="color: #bb86fc;">🎉 GRATULACJE!</h2>
                <img src="goralki.jpg" style="width: 100%; border-radius: 15px; box-shadow: 0 0 30px #bb86fc;">
            </div>
        </div>
    `;

    // 3. Logika Gry
    let isMouseDown = false;
    let currentBrush = 'c';
    container.onmousedown = () => isMouseDown = true;
    container.onmouseup = () => isMouseDown = false;

    // --- POŁĄCZENIA ---
    const connCats = [
        { name: "Schodki", words: ["Schody","Kamień","Piwo","Rzut"], color: "#845ef7" },
        { name: "Debilard", words: ["Debil","Diament","Kij","Gra"], color: "#f59f00" },
        { name: "Trip do kela", words: ["Sushi","Zamek","Autobus","Gwiazdy"], color: "#2b8a3e" },
        { name: "Kamienie występujące w Polsce", words: ["Agat","Ametyst","Fluoryt","Gips"], color: "#c92a2a" }
    ];
    let connWords = [];
    connCats.forEach(c => c.words.forEach(w => connWords.push({w, cat: c.name, col: c.color})));
    let connSelected = [];
    let connSolved = 0;

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
                    d.classList.remove("selected");
                } else if(connSelected.length < 4) {
                    connSelected.push(item);
                    d.classList.add("selected");
                }
            };
            g.appendChild(d);
        });
    }

    document.getElementById("btn-check-conn").onclick = () => {
        if(connSelected.length !== 4) return;
        const cat = connSelected[0].cat;
        if(connSelected.every(i => i.cat === cat)) {
            connSolved++;
            const group = document.createElement("div");
            group.className = "group"; group.style.background = connSelected[0].col;
            group.innerHTML = `<strong>${cat.toUpperCase()}</strong><br>${connSelected.map(i=>i.w).join(", ")}`;
            document.getElementById("solved-box").appendChild(group);
            const ws = connSelected.map(i=>i.w);
            connWords = connWords.filter(i => !ws.includes(i.w));
            connSelected = [];
            renderConn();
            if(connSolved === 4) {
                document.getElementById("btn-check-conn").classList.add("hidden");
                document.getElementById("btn-go-to-nono").classList.remove("hidden");
            }
        } else {
            document.querySelectorAll(".tile.selected").forEach(t => {
                t.classList.add("wrong");
                setTimeout(() => t.classList.remove("wrong", "selected"), 500);
            });
            connSelected = [];
        }
    };

    // --- NONOGRAM ---
    const nonoSol = [
        "000000000000n00000zz",
        "000c0000000000bb00zz",
        "00ccc000c00000bb0000",
        "00000000000000000000", // Zmieniony wiersz 4 (pusty) dla czytelności przykładu
        "ccccccccccc00p000000"
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
        return h.length ? h : [{c:0, t:'0'}];
    }

    function initNonogram() {
        const g = document.getElementById("n-grid");
        const lh = document.getElementById("l-hints");
        const th = document.getElementById("t-hints");
        const colorMap = { c:'#000', r:'#f00', n:'#00f', z:'#008000', b:'#8d4925', p:'#ffa500', '0':'#ccc' };

        // Hints Left & Cells
        for(let r=0; r<5; r++) {
            const hints = getHints(nonoSol[r]);
            const d = document.createElement("div"); d.className="hint-group h-l";
            hints.forEach(h => {
                const s = document.createElement("span"); s.style.color = colorMap[h.t];
                s.innerText = h.c; d.appendChild(s);
            });
            lh.appendChild(d);

            for(let c=0; c<20; c++) {
                const cell = document.createElement("div"); cell.className="cell";
                cell.dataset.r = r; cell.dataset.c = c;
                cell.onmousedown = (e) => { e.preventDefault(); paintCell(cell); };
                cell.onmouseenter = () => { if(isMouseDown) paintCell(cell); };
                g.appendChild(cell);
            }
        }

        // Hints Top
        for(let c=0; c<20; c++) {
            const col = []; for(let r=0; r<5; r++) col.push(nonoSol[r][c]);
            const hints = getHints(col);
            const d = document.createElement("div"); d.className="hint-group h-t";
            hints.forEach(h => {
                const s = document.createElement("span"); s.style.color = colorMap[h.t];
                s.innerText = h.c; d.appendChild(s);
            });
            th.appendChild(d);
        }
    }

    function paintCell(cell) {
        cell.className = "cell";
        if(currentBrush === 'x') cell.classList.add("marked-x");
        else if(currentBrush !== '0') cell.classList.add("c-" + currentBrush);
    }

    // Obsługa pędzli
    document.querySelectorAll('.btn-brush').forEach(btn => {
        btn.onclick = () => {
            currentBrush = btn.dataset.color;
            document.querySelectorAll('.btn-brush').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    document.getElementById("btn-go-to-nono").onclick = () => {
        document.getElementById("section-connections").classList.add("hidden");
        document.getElementById("btn-go-to-nono").classList.add("hidden");
        document.getElementById("section-nonogram").classList.remove("hidden");
        initNonogram();
    };

    document.getElementById("btn-check-nono").onclick = () => {
        const cells = document.querySelectorAll("#n-grid .cell");
        let ok = true;
        cells.forEach(cell => {
            const r = cell.dataset.r, c = cell.dataset.c;
            const sol = nonoSol[r][c];
            if(sol === '0') {
                if(cell.classList.contains("marked-x")) return;
                if(cell.classList.length > 1) ok = false;
            } else if(!cell.classList.contains("c-" + sol)) ok = false;
        });

        if(ok) {
            document.getElementById("rebus-section").classList.remove("hidden");
            document.getElementById("rebus-img").style.width = (20 * 30) + "px";
        } else alert("Obrazek zawiera błędy!");
    };

    document.getElementById("btn-check-rebus").onclick = () => {
        const val = document.getElementById("rebus-input").value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if(val === "goralki") {
            document.getElementById("section-nonogram").classList.add("hidden");
            document.getElementById("final-section").classList.remove("hidden");
        } else alert("Niepoprawne hasło!");
    };

    // Start gry
    connWords.sort(() => Math.random() - 0.5);
    renderConn();
}
