/**
 * UI Controller
 */

const SHAPES = {
    // 1. Star
    1: { name: 'Star', svg: '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor" />' },
    // 2. Heart
    2: { name: 'Heart', svg: '<path d="M50 88.9L16.7 55.6C7.2 46.1 7.2 30.9 16.7 21.4s24.7-9.5 33.3 0l0 0 0 0L50 21.4l0 0 0 0 0 0 0 0c8.6-9.5 23.8-9.5 33.3 0s9.5 24.7 0 34.2L50 88.9z" fill="currentColor" />' },
    // 3. Spade
    3: { name: 'Spade', svg: '<path d="M50 15c-20 0-35 20-35 35 0 20 25 35 35 40 10-5 35-20 35-40 0-15-15-35-35-35z M50 90 L50 75" fill="currentColor" stroke="currentColor" stroke-width="5"/>' },
    // 4. Diamond (Card Suit)
    4: { name: 'Diamond Suit', svg: '<path d="M50 5 L85 50 L50 95 L15 50 Z" fill="currentColor" />' },
    // 5. Club
    5: { name: 'Club', svg: '<path d="M50 20 A15 15 0 1 0 30 45 A15 15 0 1 0 50 70 A15 15 0 1 0 70 45 A15 15 0 1 0 50 20 Z M50 70 L50 90" fill="currentColor" stroke="currentColor" stroke-width="5"/>' },
    // 6. Crescent Moon
    6: { name: 'Crescent', svg: '<path d="M70 20 A 40 40 0 1 1 50 90 A 30 30 0 1 0 70 20 Z" fill="currentColor" />' },
    // 7. Shield
    7: { name: 'Shield', svg: '<path d="M20 10 L80 10 L80 40 C80 70 50 90 50 90 C50 90 20 70 20 40 Z" fill="currentColor" />' },
    // 8. Crown
    8: { name: 'Crown', svg: '<polygon points="10,70 90,70 90,30 70,50 50,10 30,50 10,30" fill="currentColor" />' },
    // 9. Ring / Donut
    9: { name: 'Ring', svg: '<path d="M50 15 A35 35 0 1 0 50 85 A35 35 0 1 0 50 15 Z M50 35 A15 15 0 1 1 50 65 A15 15 0 1 1 50 35 Z" fill="currentColor" fill-rule="evenodd"/>' },
    // 10. Spiral
    10: { name: 'Spiral', svg: '<path d="M50 50 m0 -5 a5 5 0 0 1 0 10 a10 10 0 0 1 0 -20 a15 15 0 0 1 0 30 a20 20 0 0 1 0 -40" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>' },
    // 11. Wave
    11: { name: 'Wave', svg: '<path d="M10 50 Q30 20 50 50 T90 50" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>' },
    // 12. Lightning Bolt
    12: { name: 'Lightning', svg: '<polygon points="55,5 25,50 50,50 45,95 75,50 50,50" fill="currentColor" />' },
    // 13. Speech Bubble
    13: { name: 'Speech', svg: '<path d="M10 30 A20 20 0 0 1 90 30 A20 20 0 0 1 90 70 A20 20 0 0 1 30 70 L20 85 L20 70 A20 20 0 0 1 10 30" fill="currentColor" />' },
    // 14. Badge / Seal
    14: { name: 'Badge', svg: '<circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="5" stroke-dasharray="8 4" fill="currentColor" />' }, // simplified
    // 15. Starburst
    15: { name: 'Starburst', svg: '<polygon points="50,10 60,35 85,25 75,50 100,60 75,70 85,95 60,85 50,110 40,85 15,95 25,70 0,60 25,50 15,25 40,35" fill="currentColor" />' },
    // 16. Hexagram
    16: { name: 'Hexagram', svg: '<polygon points="50,5 85,85 15,85" fill="none" stroke="currentColor" stroke-width="5" /><polygon points="50,95 85,15 15,15" fill="none" stroke="currentColor" stroke-width="5" />' }, // Outline style for clarity
    // 17. Pentagon Star (Outline)
    17: { name: 'Pentagon Star', svg: '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="round" />' },
    // 18. Circle
    18: { name: 'Circle', svg: '<circle cx="50" cy="50" r="40" fill="currentColor" />' },
    // 19. Semicircle
    19: { name: 'Semicircle', svg: '<path d="M10 50 A40 40 0 0 1 90 50 Z" fill="currentColor" />' },
    // 20. Quarter Circle
    20: { name: 'Quarter', svg: '<path d="M10 90 L90 90 L90 10 A80 80 0 0 0 10 90 Z" fill="currentColor" />' },
    // 21. Oval
    21: { name: 'Oval', svg: '<ellipse cx="50" cy="50" rx="40" ry="25" fill="currentColor" />' },
    // 22. Equilateral Triangle
    22: { name: 'Eq Triangle', svg: '<polygon points="50,15 90,85 10,85" fill="currentColor" />' },
    // 23. Square
    23: { name: 'Square', svg: '<rect x="15" y="15" width="70" height="70" fill="currentColor" />' },
    // 24. Rectangle
    24: { name: 'Rectangle', svg: '<rect x="10" y="25" width="80" height="50" fill="currentColor" />' },
    // 25. Parallelogram
    25: { name: 'Parallelogram', svg: '<polygon points="25,20 90,20 75,80 10,80" fill="currentColor" />' },
    // 26. Rhombus (Geometric)
    26: { name: 'Rhombus', svg: '<polygon points="50,10 80,50 50,90 20,50" fill="currentColor" />' },
    // 27. Trapezoid
    27: { name: 'Trapezoid', svg: '<polygon points="25,20 75,20 90,80 10,80" fill="currentColor" />' },
    // 28. Kite
    28: { name: 'Kite', svg: '<polygon points="50,10 80,40 50,90 20,40" fill="currentColor" />' },
    // 29. Pentagon
    29: { name: 'Pentagon', svg: '<polygon points="50,10 90,40 75,90 25,90 10,40" fill="currentColor" />' },
    // 30. Hexagon
    30: { name: 'Hexagon', svg: '<polygon points="25,10 75,10 95,50 75,90 25,90 5,50" fill="currentColor" />' },
    // 31. Heptagon
    31: { name: 'Heptagon', svg: '<polygon points="50,10 85,25 90,60 70,90 30,90 10,60 15,25" fill="currentColor" />' }, // Approx
    // 32. Octagon
    32: { name: 'Octagon', svg: '<polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="currentColor" />' }
};

const COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#1A535C', // Dark Blue
    '#FF9F1C', // Orange
    '#D7263D', // Deep Red
    '#9B59B6', // Purple
    '#3498DB', // Blue
    '#2ECC71', // Green
    '#E67E22', // Carrot
    '#F1C40F', // Sun
    '#95A5A6', // Concrete
    '#34495E', // Wet Asphalt
    '#16A085', // Green Sea
    '#27AE60', // Nephritis
    '#2980B9', // Belize Hole
    '#8E44AD', // Wisteria
    '#F39C12', // Orange Peel
    '#C0392B', // Pomegranate
    '#7F8C8D'  // Asbestos
];

// Mapping from Logic Number (1..N) to Visual Shape ID (1..32)
let currentShapeMap = {};

function setShapeMap(map) {
    currentShapeMap = map;
}

function getShapeSVG(num) {
    if (!num) return '';
    // Map logic number to visual shape ID
    const shapeId = currentShapeMap[num] || num;

    if (!SHAPES[shapeId]) return '';
    // Assign color based on shapeId for visual distinction
    const color = COLORS[(shapeId - 1) % COLORS.length];
    return `<svg viewBox="0 0 100 100" class="shape-svg" style="color: ${color};">${SHAPES[shapeId].svg}</svg>`;
}

function renderGrid(container, board, initialBoard, questionCell, onCellClick) {
    container.innerHTML = '';
    const size = board.length;

    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            // Check if this is the question cell
            const isQuestionCell = questionCell && questionCell.r === r && questionCell.c === c;
            if (isQuestionCell) {
                cell.classList.add('question-cell');
            }

            const isInitial = initialBoard[r][c] !== 0;
            if (isInitial) {
                cell.classList.add('initial');
                cell.innerHTML = getShapeSVG(initialBoard[r][c]);
            } else {
                cell.classList.add('user-filled');
                const val = board[r][c];
                if (val !== 0) {
                    cell.innerHTML = getShapeSVG(val);
                    if (isQuestionCell) {
                        cell.classList.add('question-filled');
                    }
                }

                // Only allow click if it's the question cell (or generally allowing interaction, handled by logic)
                cell.onclick = () => {
                    // Deselect previous
                    document.querySelectorAll('.grid-cell.selected').forEach(el => el.classList.remove('selected'));
                    // Select new
                    cell.classList.add('selected');
                    onCellClick(r, c);
                };
            }

            container.appendChild(cell);
        }
    }
}

function renderPalette(container, size, onShapeSelect) {
    container.innerHTML = '';
    for (let i = 1; i <= size; i++) {
        const btn = document.createElement('button');
        btn.className = 'palette-btn';
        btn.innerHTML = getShapeSVG(i);
        btn.onclick = () => onShapeSelect(i);
        container.appendChild(btn);
    }


}

function updateCell(container, r, c, val) {
    const cell = container.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
    if (cell) {
        cell.innerHTML = val === 0 ? '' : getShapeSVG(val);

        // If it's a question cell, toggle a class to hide/show the "?"
        if (cell.classList.contains('question-cell')) {
            if (val !== 0) {
                cell.classList.add('question-filled');
            } else {
                cell.classList.remove('question-filled');
            }
        }

        // Add animation class
        cell.classList.remove('pop-in');
        void cell.offsetWidth; // trigger reflow
        cell.classList.add('pop-in');
    }
}

function showMessage(el, msg, type = 'info') {
    el.innerText = msg;
    el.className = `status-msg ${type}`;
    setTimeout(() => {
        el.className = 'status-msg'; // hide after 3s
    }, 3000);
}
