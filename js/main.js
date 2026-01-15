// import { generatePuzzle, isValid } from './generator.js';
// import * as UI from './ui.js';

const STATE = {
    solution: null,
    initial: null,
    current: null,
    size: 4,
    selectedCell: null, // {r, c}
    questionCell: null, // {r, c} - The cell with the '?'
    score: 0,
    timerInterval: null,
    timeLeft: 300, // 5 minutes
    gameActive: false,
    currentDifficulty: 'easy',
    history: [], // Array of { initial, solution, questionCell, userVal, result: 'correct'|'incorrect' }
    reviewIndex: 0
};

// Update ELEMENTS to include results nodes
const ELEMENTS = {
    grid: document.getElementById('grid-container'),
    palette: document.getElementById('palette-container'),
    status: document.getElementById('status-message'),
    btnStartGame: document.getElementById('btn-start-game'),
    btnHome: document.getElementById('btn-home'),
    btnShowAnswer: document.getElementById('btn-show-answer'),
    timerDisplay: document.getElementById('timer-display'),
    scoreDisplay: document.getElementById('score-display'),
    gameStats: document.getElementById('game-stats'),
    homeScreen: document.getElementById('home-screen'),
    gameArea: document.getElementById('game-area'),
    gameFooter: document.getElementById('game-footer'),
    // Review Controls
    reviewControls: document.getElementById('review-controls'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    reviewStatus: document.getElementById('review-status'),
    // Results Screen
    // Results Screen 
    resultsScreen: document.getElementById('results-screen'),
    resAttempted: document.getElementById('res-attempted'),
    resCorrect: document.getElementById('res-correct'),
    resAccuracy: document.getElementById('res-accuracy'),
    btnStartReview: document.getElementById('btn-start-review'),
    attemptedDisplay: document.getElementById('attempted-display'),
};
// ... (initGame, startGame, tick, update functions same as before) ...

function endGame() {
    STATE.gameActive = false;
    clearInterval(STATE.timerInterval);
    STATE.selectedCell = null;

    // Calculate Stats
    const totalAttempted = STATE.history.length;
    const totalCorrect = STATE.score;
    let accuracy = 0;

    if (totalAttempted > 0) {
        accuracy = Math.round((totalCorrect / totalAttempted) * 100);
    }

    // Show Results Screen
    ELEMENTS.resAttempted.innerText = totalAttempted;
    ELEMENTS.resCorrect.innerText = totalCorrect;
    ELEMENTS.resAccuracy.innerText = `${accuracy}%`;

    // ELEMENTS.resSummary.innerText = ... (Removed old summary if we replaced it with list, 
    // but honestly the list + summary is fine, or we can clear it if not needed).
    // The user didn't ask to remove the summary line, but the list covers it. 
    // I'll leave the summary line blank to be safe or remove the code setting it.

    ELEMENTS.gameArea.style.display = 'none';
    ELEMENTS.gameFooter.style.display = 'none';
    ELEMENTS.gameStats.style.display = 'none'; // Hide small stats
    ELEMENTS.resultsScreen.style.display = 'flex';
}

function startReview() {
    ELEMENTS.resultsScreen.style.display = 'none';
    ELEMENTS.gameArea.style.display = 'block';
    ELEMENTS.gameFooter.style.display = 'flex';

    // Switch to Review Mode if history exists
    if (STATE.history.length > 0) {
        STATE.reviewIndex = 0;
        ELEMENTS.reviewControls.style.display = 'flex';
        ELEMENTS.btnShowAnswer.style.display = 'inline-block'; // Show the button!
        showReviewPuzzle(0);
        showMessage(ELEMENTS.status, `Reviewing Puzzle 1 of ${STATE.history.length}`, 'info');
    } else {
        showMessage(ELEMENTS.status, `No puzzles to review.`, 'info');
    }
}

// ... (existing checkSolution, showReviewPuzzle) ...

if (ELEMENTS.btnStartReview) {
    ELEMENTS.btnStartReview.onclick = startReview;
}

function showAnswer() {
    // If we are in review mode (game not active, history exists)
    if (!STATE.gameActive && STATE.history.length > 0) {
        const data = STATE.history[STATE.reviewIndex];
        // Restore correct map for this puzzle
        setShapeMap(data.map);
        // Render full solution
        renderGrid(ELEMENTS.grid, data.fullBoard, data.puzzleBoard, data.questionCell, () => { });
        showMessage(ELEMENTS.status, `Solution for Puzzle ${STATE.reviewIndex + 1}`, 'info');
    } else {
        // Fallback or debug
        STATE.current = JSON.parse(JSON.stringify(STATE.solution));
        renderGrid(ELEMENTS.grid, STATE.current, STATE.initial, STATE.questionCell, (r, c) => { });
        showMessage(ELEMENTS.status, 'Here is the solution!', 'info');
    }
}

function initGame(difficulty) {
    let size = 4;
    let filledCount = 8; // Default Easy

    if (difficulty === 'medium') {
        size = 5;
        filledCount = 10;
    } else if (difficulty === 'hard') {
        size = 4;
        filledCount = 4;
    }

    STATE.size = size;
    const { fullBoard, puzzleBoard } = generatePuzzle(size, filledCount);

    // Randomize Visual Shapes
    let shapeIndices = Array.from({ length: 32 }, (_, i) => i + 1);
    for (let i = shapeIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shapeIndices[i], shapeIndices[j]] = [shapeIndices[j], shapeIndices[i]];
    }

    let map = {};
    for (let i = 1; i <= size; i++) {
        map[i] = shapeIndices[i - 1];
    }
    setShapeMap(map);

    STATE.solution = fullBoard;
    STATE.initial = puzzleBoard;
    STATE.current = JSON.parse(JSON.stringify(puzzleBoard));
    STATE.selectedCell = null;

    // Select a Question Cell (must be 0 in puzzleBoard)
    let emptyCells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (puzzleBoard[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }

    // Pick random empty cell
    if (emptyCells.length > 0) {
        const randIndex = Math.floor(Math.random() * emptyCells.length);
        STATE.questionCell = emptyCells[randIndex];
    } else {
        STATE.questionCell = null;
    }

    // Auto-select the Question Cell
    STATE.selectedCell = STATE.questionCell;

    renderGrid(ELEMENTS.grid, STATE.current, STATE.initial, STATE.questionCell, (r, c) => {
        if (STATE.gameActive) {
            if (STATE.initial[r][c] !== 0) {
                STATE.selectedCell = null;
            } else {
                STATE.selectedCell = { r, c };
            }
        }
    });

    // Manually trigger styling
    if (STATE.selectedCell) {
        const cell = ELEMENTS.grid.querySelector(`.grid-cell[data-row="${STATE.selectedCell.r}"][data-col="${STATE.selectedCell.c}"]`);
        if (cell) cell.classList.add('selected');
    }

    renderPalette(ELEMENTS.palette, size, (val) => {
        if (STATE.selectedCell && STATE.gameActive) {
            const { r, c } = STATE.selectedCell;

            STATE.current[r][c] = val;
            updateCell(ELEMENTS.grid, r, c, val);

            // AUTO-CHECK Logic
            if (r === STATE.questionCell.r && c === STATE.questionCell.c && val !== 0) {
                checkSolution();
            }
        }
    });
}

function startGame() {
    ELEMENTS.homeScreen.style.display = 'none';
    ELEMENTS.gameArea.style.display = 'block';
    ELEMENTS.gameFooter.style.display = 'flex';
    ELEMENTS.gameStats.style.display = 'flex';
    ELEMENTS.reviewControls.style.display = 'none';

    STATE.score = 0;
    STATE.timeLeft = 300;
    STATE.gameActive = true;
    STATE.currentDifficulty = 'easy';
    STATE.history = []; // Reset history

    updateScoreDisplay();
    updateTimerDisplay();

    ELEMENTS.btnShowAnswer.style.display = 'none';

    showMessage(ELEMENTS.status, 'Find the shape for "?"', 'info');

    initGame(STATE.currentDifficulty);

    if (STATE.timerInterval) clearInterval(STATE.timerInterval);
    STATE.timerInterval = setInterval(tick, 1000);
}

function tick() {
    STATE.timeLeft--;
    updateTimerDisplay();

    if (STATE.timeLeft <= 0) {
        endGame();
    }
}

function updateTimerDisplay() {
    const m = Math.floor(STATE.timeLeft / 60);
    const s = STATE.timeLeft % 60;
    ELEMENTS.timerDisplay.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateScoreDisplay() {
    ELEMENTS.scoreDisplay.innerText = STATE.score;
    // Update attempt count
    // History length is accurate because checkSolution calls this AFTER pushing history
    if (ELEMENTS.attemptedDisplay) {
        ELEMENTS.attemptedDisplay.innerText = STATE.history.length;
    }
}

function getNextDifficulty(currentDiff, success) {
    if (success) {
        if (currentDiff === 'easy') return 'medium';
        return 'hard';
    } else {
        if (currentDiff === 'hard') return 'medium';
        return 'easy';
    }
}

function checkSolution() {
    if (!STATE.gameActive || !STATE.questionCell) return;

    const { r, c } = STATE.questionCell;
    const userVal = STATE.current[r][c];
    const correctVal = STATE.solution[r][c];

    if (userVal === 0) return;

    const isCorrect = userVal === correctVal;

    // Record History
    STATE.history.push({
        puzzleBoard: JSON.parse(JSON.stringify(STATE.initial)),
        fullBoard: JSON.parse(JSON.stringify(STATE.solution)),
        currentBoard: JSON.parse(JSON.stringify(STATE.current)), // Snapshot user's board
        questionCell: { r, c },
        userVal: userVal,
        correctVal: correctVal,
        result: isCorrect ? 'correct' : 'incorrect',
        map: currentShapeMap // Needed to render correctly in review if map changes (it does)
    });

    if (isCorrect) {
        STATE.score++;
        updateScoreDisplay();
        showMessage(ELEMENTS.status, 'Correct! Level Up!', 'success');
        triggerWinAnimation();
        STATE.currentDifficulty = getNextDifficulty(STATE.currentDifficulty, true);
    } else {
        updateScoreDisplay(); // Update stats (attempted count)
        showMessage(ELEMENTS.status, 'Incorrect. Level Down.', 'error');
        STATE.currentDifficulty = getNextDifficulty(STATE.currentDifficulty, false);
    }

    // Next Puzzle
    setTimeout(() => {
        initGame(STATE.currentDifficulty);
    }, 500);
}

// Review Logic
function showReviewPuzzle(index) {
    if (index < 0 || index >= STATE.history.length) return;
    STATE.reviewIndex = index;

    const data = STATE.history[index];

    // Restore the map used for that puzzle! 
    // Wait, global currentShapeMap is used by UI.js. 
    // We need to temporarily set it to render this puzzle.
    setShapeMap(data.map);

    // Construct a board that shows user's answer
    // Actually data.currentBoard has user's answer.
    // But we might want to overlay the correct answer if they were wrong.

    let displayBoard = JSON.parse(JSON.stringify(data.currentBoard));

    // If incorrect, maybe show correct answer next to it? 
    // For now, let's just show what they did. User can infer.

    // Update Status
    ELEMENTS.reviewStatus.innerText = `Puzzle ${index + 1} / ${STATE.history.length} (${data.result.toUpperCase()})`;

    // Render
    // We pass null for questionCell so no special borders, or maybe we want to highlight it?
    // Let's highlight it to show context
    renderGrid(ELEMENTS.grid, displayBoard, data.puzzleBoard, data.questionCell, () => { });

    // Also re-render palette to match the shapes of this puzzle
    renderPalette(ELEMENTS.palette, data.puzzleBoard.length, () => { });

    // Add visual indicator of correctness on the cell?
    // We can't easily modify DOM inside renderGrid without custom logic.
    // Let's us showMessage for context
    if (data.result === 'correct') {
        showMessage(ELEMENTS.status, `Puzzle ${index + 1}: Correct!`, 'success');
    } else {
        showMessage(ELEMENTS.status, `Puzzle ${index + 1}: Incorrect. You picked the wrong shape.`, 'error');
    }
}

// Review Buttons
if (ELEMENTS.btnPrev) {
    ELEMENTS.btnPrev.onclick = () => {
        if (STATE.reviewIndex > 0) {
            showReviewPuzzle(STATE.reviewIndex - 1);
        }
    };
}

if (ELEMENTS.btnNext) {
    ELEMENTS.btnNext.onclick = () => {
        if (STATE.reviewIndex < STATE.history.length - 1) {
            showReviewPuzzle(STATE.reviewIndex + 1);
        }
    };
}



if (ELEMENTS.btnStartGame) {
    ELEMENTS.btnStartGame.onclick = startGame;
}

if (ELEMENTS.btnShowAnswer) {
    ELEMENTS.btnShowAnswer.onclick = showAnswer;
}

function triggerWinAnimation() {
    ELEMENTS.grid.classList.add('win-pulse');
    setTimeout(() => ELEMENTS.grid.classList.remove('win-pulse'), 1000);
}

function showMessage(el, msg, type = 'info') {
    el.innerText = msg;
    el.className = `status-msg ${type}`;
}

// Initial State
