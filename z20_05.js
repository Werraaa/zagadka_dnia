/**
 * Zagadka Dnia: 20 Maja (Połączenia)
 * Nazwa pliku: z20_05.js
 */

function initPuzzle(container) {
    // 1. Definiujemy style CSS specyficzne dla gry w połączenia
    const style = document.createElement('style');
    style.innerHTML = `
        .puzzle-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; user-select: none; }
        .hidden { display: none !important; }
        
        /* SEKCJA: POŁĄCZENIA */
        .grid-conn { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 500px; margin: 20px 0; }
        .tile { aspect-ratio: 1/1; background: #2c2c2c; border: 2px solid #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 11px; font-weight: bold; text-align: center; padding: 5px; text-transform: uppercase; color: #e1e1e1; }
        .tile.selected { background: #bb86fc; color: #000; }
        .tile.wrong { background: #cf6679; animation: shake 0.4s; }
        .group { padding: 15px; margin: 5px 0; border-radius: 10px; color: white; font-weight: bold; width: 100%; max-width: 500px; text-align: center; font-size: 14px; }

        /* PRZYCISKI I NAGŁÓWKI */
        .btn-check { background: #4caf50; color: white; border: none; padding: 12px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; margin: 10px; }

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

            <div id="final-section" class="hidden" style="text-align: center; margin-top: 20px;">
                <h2 style="color: #bb86fc;">🎉 GRATULACJE!</h2>
                <p style="color: #e1e1e1;">Udało Ci się rozwiązać dzisiejsze połączenia!</p>
            </div>
        </div>
    `;

    // 3. Logika Gry i Dane wyjściowe
    const connCats = [
        { name: "Można się na to wspiąć", words: ["Drzewo", "Ściana", "Drabina", "Palce"], color: "#845ef7" },
        { name: "Można to ułożyć", words: ["Włosy", "Puzzle", "Plan", "Zagadka"], color: "#f59f00" },
        { name: "Można to zrobić z ziemniaka", words: ["Frytki", "Stempel", "Wódka", "Bateria"], color: "#2b8a3e" },
        { name: "Rzeczy, z którymi ćwiczył wojfer87", words: ["Sztanga", "Kanapa", "Łóżko", "Stół"], color: "#c92a2a" }
    ];

    let connWords = [];
    connCats.forEach(c => c.words.forEach(w => connWords.push({ w, cat: c.name, col: c.color })));
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
                    connSelected = connSelected.filter(i => i !== item);
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
            group.className = "group"; 
            group.style.background = connSelected[0].col;
            group.innerHTML = `<strong>${cat.toUpperCase()}</strong><br>${connSelected.map(i => i.w).join(", ")}`;
            document.getElementById("solved-box").appendChild(group);
            
            const ws = connSelected.map(i => i.w);
            connWords = connWords.filter(i => !ws.includes(i.w));
            connSelected = [];
            renderConn();
            
            if(connSolved === 4) {
                document.getElementById("btn-check-conn").classList.add("hidden");
                document.getElementById("final-section").classList.remove("hidden");
            }
        } else {
            document.querySelectorAll(".tile.selected").forEach(t => {
                t.classList.add("wrong");
                setTimeout(() => t.classList.remove("wrong", "selected"), 500);
            });
            connSelected = [];
        }
    };

    // Tasowanie słów na starcie
    connWords.sort(() => Math.random() - 0.5);
    renderConn();
}
