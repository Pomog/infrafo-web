"use client";

import Square from "@/testing/square";
import {BoardProps, Cell, LINES} from "@/testing/types";

export default function Board({ xIsNext, squares, onPlay, reset }: BoardProps) {

    const winner = calculateWinner(squares);
    const isDraw = !winner && !squares.includes(null);
    const nexMove = xIsNext ? 'X' : 'O';
    const gameStatus = winner
        ? `Winner: ${winner}`
        : isDraw
            ? 'Draw'
            : `Next player: ${nexMove}`;

    function handleClick(i) {
        if (squares[i] || winner || isDraw) return;

        const nextSquares = squares.slice();
        nextSquares[i] = nexMove;
        onPlay(nextSquares);
    }

    function calculateWinner(squares: readonly Cell[]): 'X' | 'O' | null {
        for (const [a, b, c] of LINES) {
            const v = squares[a];
            if (v && v === squares[b] && v === squares[c]) return v;
        }
        return null; // O(1)
    }

    return (
        <>
            // TODO: Rewrite Board to use two loops to make the squares instead of hardcoding them.
            <div className="status">{gameStatus}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
                <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
                <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
                <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
                <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
                <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
                <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
            </div>
            <button onClick={reset}>Reset</button>
        </>
    )
}