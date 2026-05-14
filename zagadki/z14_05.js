/**
 * Zagadka Dnia: 13 Maja (Nonogram 25x25 - Wersja Naprawiona)
 * Nazwa pliku: z13_05.js
 */

function initPuzzle(container) {
    // 1. STYLE CSS - Zoptymalizowane pod ciemny motyw
    const style = document.createElement('style');
    style.innerHTML = `
        .puzzle-wrapper { 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            width: 100%; 
            user-select: none; 
            color: #fff; 
        }
        
        .hidden { display: none !important; }

        /* SEKCJA NONOGRAMU */
        .nonogram-layout { 
            display: inline-grid; 
            grid-template-columns: 140px auto; 
            background: #1e1e1e; 
            padding: 15px; 
            border-radius: 12px; 
            border: 1px solid #333;
            max-width: 95vw;
            overflow-x: auto;
        }

        .hints-top { 
            display: grid; 
            grid-template-columns: repeat(25, 24px); 
            grid-column: 2; 
            height: 120px; 
        }

        .hints-left { 
            display: grid; 
            grid-template-rows: repeat(25, 24px); 
            grid-row: 2; 
            width: 140px; 
        }

        .grid-nonogram { 
            display: grid; 
            grid-template-columns: repeat(25, 24px); 
            grid-template-rows: repeat(25, 24px); 
            border: 2px solid #000; 
            grid-column: 2; 
            grid-row: 2; 
            background: #444; 
            gap: 1px; 
        }
        
        .cell { 
            width: 24px; 
            height: 24px; 
            background: #2a2a2a; 
            cursor: crosshair; 
            box-sizing: border-box; 
            position: relative; 
            transition: background 0.1s;
        }

        .cell:hover { filter: brightness(1.3); }

        /* KRZYŻYK */
        .cell.marked-x::after { 
            content: "×"; 
            color: #ff4444; 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%); 
            font-size: 22px; 
            font-weight: bold; 
            z-index: 5;
        }
        
        /* KOLORY KOMÓREK */
        .c-1 { background-color: #000000 !important; border: 1px solid #333; }
        .c-2 { background-color: #ffffff !important; }
        .c-3 { background-color: #ff0000 !important; }
        .c-4 { background-color: #ffd700 !important; }
        .c-5 { background-color: #ffc0cb !important; }
        .c-6 { background-color: #f5f5dc !important; }
        .c-7 { background-color: #0000ff !important; }
        .c-8 { background-color: #000080 !important; }
        
        /* PODPOWIEDZI */
        .hint-group { display: flex; background: #252525; font-size: 11px; font-weight: 900; box-sizing: border-box; }
        .h-t { flex-direction: column; justify-content: flex-end; align-items: center; border-left: 1px solid #333; padding-bottom: 4px; }
        .h-l { flex-direction: row; justify-content: flex-end; align-items: center; border-top: 1px solid #333; padding-right: 8px; gap: 4px; }

        /* PANEL NARZĘDZI */
        .btn-brush { 
            width: 40px; 
            height: 40px; 
            border-radius: 8px; 
            border: 2px solid #444; 
            cursor: pointer; 
            transition: all 0.2s;
        }
        .btn-brush.active { 
            border-color: #00f2ff; 
            transform: scale(1.15); 
            box-shadow: 0 0 15px rgba(0, 242, 255, 0.5); 
        }

        .btn-check { 
            background: #00f2ff; 
            color: #000; 
            border: none; 
            padding: 15px 40px; 
            border-radius: 50px; 
            cursor: pointer; 
            font-weight: bold; 
            margin-top: 30px; 
            text-transform: uppercase;
            transition: 0.3s;
        }
        .btn-check:hover { background: #00b8c4; transform: scale(1.05); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .puzzle-wrapper { animation: fadeIn 0.8s ease-out; }
    `;
    document.head.appendChild(style);

    // 2. STRUKTURA HTML
    container.innerHTML = `
        <div class="puzzle-wrapper">
            <h2 id="puzzle-title" style="color: #00f2ff; margin-bottom: 25px;">Operacja: Nonogram 25x25</h2>
            
            <div id="section-nonogram">
                <div id="brush-panel" style="margin-bottom: 25px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 15px;">
                    <button class="btn-brush active" data-color="1" style="background:#000" title="Czarny"></button>
                    <button class="btn-brush" data-color="2" style="background:#fff" title="Biały"></button>
                    <button class="btn-brush" data-color="3" style="background:#f00" title="Czerwony"></button>
                    <button class="btn-brush" data-color="4" style="background:#ffd700" title="Złoty"></button>
                    <button class="btn-brush" data-color="5" style="background:#ffc0cb" title="Różowy"></button>
                    <button class="btn-brush" data-color="6" style="background:#f5f5dc" title="Beżowy"></button>
                    <button class="btn-brush" data-color="7" style="background:#00f" title="Niebieski"></button>
                    <button class="btn-brush" data-color="8" style="background:#000080" title="Ciemny Niebieski"></button>
                    <button class="btn-brush" data-color="x" style="background:#333; color: #ff4444; font-size: 24px; font-weight: bold; display: flex; align-items: center; justify-content: center;">×</button>
                    <button class="btn-brush" data-color="0" style="background:#444; border: 1px dashed #777; font-size: 9px; color: #fff;">GUMKA</button>
                </div>

                <div class="nonogram-layout">
                    <div style="background:#151515; grid-row: 1; grid-column: 1; border-radius: 8px 0 0 0;"></div>
                    <div id="t-hints" class="hints-top"></div>
                    <div id="l-hints" class="hints-left"></div>
                    <div id="n-grid" class="grid-nonogram"></div>
                </div>
                
                <div style="text-align: center;">
                    <button class="btn-check" id="btn-check-nono">Weryfikuj Obrazek</button>
                </div>
            </div>

            <div id="final-section" class="hidden" style="text-align: center; padding: 50px;">
                <h1 style="color: #bf00ff; font-size: 3rem;">🎉 MISJA UKOŃCZONA 🎉</h1>
                <p style="font-size: 1.2rem; color: #00f2ff;">Obrazek logiczny został poprawnie rozszyfrowany!</p>
            </div>
        </div>
    `;

    // 3. LOGIKA I DANE
    let isMouseDown = false;
    let currentBrush = '1';
    window.onmousedown = () => isMouseDown = true;
    window.onmouseup = () => isMouseDown = false;

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
            if(v !== '1' && v !== '0') { // Zakładamy, że 1 to tło/puste w Twoim nonogramie lub czarny? 
                // W nonogramach kolorowych każda zmiana koloru to nowa grupa
                if(v === l) c++;
                else { if(c > 0) h.push({c, t: l}); c = 1; l = v; }
            } else if (v === '1') {
                 if(c > 0) h.push({c, t: l}); c = 0; l = '0';
            }
        });
        if(c > 0) h.push({c, t: l});
        return h.length ? h : [{c:0, t:'2'}];
    }

    function paintCell(cell) {
        // Resetujemy klasy komórki do podstawowej
        cell.className = "cell";
        
        if(currentBrush === 'x') {
            cell.classList.add("marked-x");
        } else if(currentBrush !== '0') {
            cell.classList.add("c-" + currentBrush);
        }
    }

    // Inicjalizacja siatki
    const g = document.getElementById("n-grid");
    const lh = document.getElementById("l-hints");
    const th = document.getElementById("t-hints");
    const hintColorMap = {
        '1': '#000', '2': '#fff', '3': '#f44', '4': '#ffd700', 
        '5': '#ffc0cb', '6': '#f5f5dc', '7': '#44f', '8': '#000080'
    };

    // Budowanie siatki i podpowiedzi lewych
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

    // Podpowiedzi górne
    for(let c=0; c<25; c++) {
        const colData = []; for(let r=0; r<25; r++) colData.push(nonoSol[r][c]);
        const hints = getHints(colData);
        const d = document.createElement("div"); d.className="hint-group h-t";
        hints.forEach(h => {
            const s = document.createElement("span");
            s.style.color = hintColorMap[h.t]; s.innerText = h.c;
            d.appendChild(s);
        });
        th.appendChild(d);
    }

    // Obsługa pędzli
    document.querySelectorAll('.btn-brush').forEach(btn => {
        btn.onclick = () => {
            currentBrush = btn.dataset.color;
            document.querySelectorAll('.btn-brush').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    // Sprawdzanie wyniku
    document.getElementById("btn-check-nono").onclick = () => {
        const cells = document.querySelectorAll("#n-grid .cell");
        let errors = 0;
        
        cells.forEach(cell => {
            const r = cell.dataset.r, c = cell.dataset.c;
            const targetCol = nonoSol[r][c];
            
            // Logika sprawdzania:
            // Jeśli rozwiązanie przewiduje kolor (inny niż tło '1'), komórka musi mieć klasę c-X
            if (targetCol !== '1') {
                if (!cell.classList.contains("c-" + targetCol)) errors++;
            } else {
                // Jeśli komórka powinna być tłem (1), nie może mieć żadnej klasy c-X (krzyżyki ignorujemy)
                const hasAnyColor = Array.from(cell.classList).some(cls => cls.startsWith('c-'));
                if (hasAnyColor) errors++;
            }
        });

        if(errors === 0) {
            document.getElementById("section-nonogram").classList.add("hidden");
            document.getElementById("final-section").classList.remove("hidden");
            document.getElementById("puzzle-title").innerText = "STATUS: ZAKOŃCZONO";
        } else {
            alert(`Wykryto błędy w obrazku (${errors}). Sprawdź kolory i spróbuj ponownie!`);
        }
    };
}
