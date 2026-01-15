/**
 * Generator Logic for Latin Square Puzzles
 */

// Fisher-Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Check if placing num at board[row][col] is valid
function isValid(board, row, col, num, size) {
  // Check Row
  for (let x = 0; x < size; x++) {
    if (board[row][x] === num) return false;
  }
  // Check Col
  for (let y = 0; y < size; y++) {
    if (board[y][col] === num) return false;
  }
  return true;
}

// Backtracking solver to fill the board
function solveLatinSquare(board, size) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        // Try numbers 1..size
        // randomize order to get different squares
        let nums = Array.from({ length: size }, (_, i) => i + 1);
        shuffle(nums);

        for (let num of nums) {
          if (isValid(board, row, col, num, size)) {
            board[row][col] = num;
            if (solveLatinSquare(board, size)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateLatinSquare(size) {
  let board = Array.from({ length: size }, () => Array(size).fill(0));

  // Fill first row randomly to speed up generation and ensure variety
  let firstRow = Array.from({ length: size }, (_, i) => i + 1);
  shuffle(firstRow);
  board[0] = firstRow;

  if (solveLatinSquare(board, size)) {
    return board;
  } else {
    // Should generally not happen for small N
    console.error("Failed to generate square");
    return generateLatinSquare(size); // retry
  }
}

function generatePuzzle(size, filledCount) {
  const fullBoard = generateLatinSquare(size);
  // Deep copy for the puzzle board
  let puzzleBoard = JSON.parse(JSON.stringify(fullBoard));

  let attempts = size * size - filledCount;
  let positions = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      positions.push([r, c]);
    }
  }
  shuffle(positions);

  // Simple digging: remove cells until we reach filledCount
  // In a robust constraint solver, we'd check uniqueness. 
  // For this version, we just dig.
  // We keep digging until we have 'filledCount' cells remaining.

  let cellsToRemove = (size * size) - filledCount;

  for (let i = 0; i < cellsToRemove; i++) {
    let [r, c] = positions[i];
    puzzleBoard[r][c] = 0; // 0 represents empty
  }

  return {
    fullBoard,
    puzzleBoard
  };
}
