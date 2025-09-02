
export type Cell = 'X' | 'O' | null;

export const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // row
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],   // diagonal
] as const satisfies ReadonlyArray<readonly [number, number, number]>;

export type BoardProps = {
    xIsNext: boolean;
    squares: ReadonlyArray<Cell>;
    onPlay: (next: ReadonlyArray<Cell>) => void;
    reset: () => void;
};