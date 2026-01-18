
export const initializeGrid = () => {
    const grid = Array(4).fill().map(() => Array(4).fill(null));
    addRandomTile(grid);
    addRandomTile(grid);
    return grid;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const addRandomTile = (grid) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === null) emptyCells.push({ r, c });
        }
    }

    if (emptyCells.length === 0) return;

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[r][c] = {
        id: generateId(),
        value: Math.random() < 0.9 ? 2 : 4,
        isNew: true // Optional: for entrance animation
    };
};

export const move = (grid, direction) => {
    let score = 0;
    let moved = false;

    // Deep clone is messy with objects, let's just clone the array structure
    // But keep object references to preserve identity!
    // However, if we mutate objects (value *= 2), we mutate state.
    // In React, we should clone objects if we change them.
    const newGrid = grid.map(row => [...row]);

    const rotate = (matrix) => {
        const N = matrix.length;
        const res = Array(N).fill().map(() => Array(N).fill(null));
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                res[j][N - 1 - i] = matrix[i][j];
            }
        }
        return res;
    };

    let rotated = newGrid;
    let rotations = 0;
    if (direction === 'ArrowUp') rotations = 3;
    if (direction === 'ArrowRight') rotations = 2;
    if (direction === 'ArrowDown') rotations = 1;

    for (let i = 0; i < rotations; i++) rotated = rotate(rotated);

    // Process slide left logic
    for (let r = 0; r < 4; r++) {
        // filter non-nulls
        const row = rotated[r].filter(tile => tile !== null);
        const newRow = [];
        let skip = false;

        for (let c = 0; c < row.length; c++) {
            if (skip) {
                skip = false;
                continue;
            }

            const current = row[c];
            const next = (c + 1 < row.length) ? row[c + 1] : null;

            if (next && current.value === next.value) {
                // Merge
                // Create new tile with SAME ID as one of them (usually the one moving 'into' position, or just pick one)
                // Let's pick 'current's ID to persist.
                const mergedTile = {
                    ...current,
                    value: current.value * 2,
                    merged: true // Optional flag
                };
                newRow.push(mergedTile);
                score += mergedTile.value;
                skip = true;
            } else {
                newRow.push(current);
            }
        }

        // Pad with nulls
        while (newRow.length < 4) newRow.push(null);

        // Check availability of move by comparing IDs and Vals
        // Simple JSON stringify works if order is same
        // But objects might be different references if merged.
        // Let's compare contents
        for (let c = 0; c < 4; c++) {
            const oldTile = rotated[r][c];
            const newTile = newRow[c];
            if (oldTile !== newTile) {
                // Even if values same, if position changed, moved=true
                moved = true;
            }
        }

        rotated[r] = newRow;
    }

    // Rotate back
    const backRotations = (4 - rotations) % 4;
    for (let i = 0; i < backRotations; i++) rotated = rotate(rotated);

    return { grid: rotated, score, moved };
};

export const checkGameOver = (grid) => {
    // Check for zeros
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === null) return false;
        }
    }

    // Check for merges
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (c + 1 < 4 && grid[r][c].value === grid[r][c + 1].value) return false;
            if (r + 1 < 4 && grid[r][c].value === grid[r + 1][c].value) return false;
        }
    }
    return true;
};

export const checkWin = (grid) => {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] && grid[r][c].value === 1024) return true;
        }
    }
    return false;
};
