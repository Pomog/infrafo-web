"use client";

import Square from "@/testing/square";
import {useCallback, useState} from "react";

export default function Board() {
    type Cell = 'X' | 'O' | null;

    const LINES = [
        [0, 1, 2], // row
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // columns
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // diagonal
        [2, 4, 6],
    ] as const satisfies ReadonlyArray<readonly [number, number, number]>;

    const emptyBoard = useCallback(() => Array(9).fill(null), []);
    const [squares, setSquares] = useState<Cell[]>(emptyBoard);

    const [xIsNext, setXIsNext] = useState<boolean>(true);

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) return;

        setSquares(prev => {
            const next = prev.slice();
            next[i] = xIsNext ? 'X' : 'O';
            return next;
        });

        setXIsNext(prev => !prev);
    }

    function calculateWinner(squares: readonly Cell[]): 'X' | 'O' | null {
        for (const [a, b, c] of LINES) {
            const v = squares[a];
            if (v && v === squares[b] && v === squares[c]) return v;
        }
        return null;
    }

    return (
        <>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    )
}