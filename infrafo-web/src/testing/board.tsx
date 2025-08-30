"use client";

import Square from "@/testing/square";
import {useCallback, useState} from "react";

export default function Board() {
    type Cell = 'X' | 'O' | null;
    const emptyBoard = useCallback(() => Array(9).fill(null), []);
    const [squares, setSquares] = useState<Cell[]>(emptyBoard);

    function handleClick(i) {
        const nextSquares = squares.slice();
        nextSquares[i] = "X";
        setSquares(nextSquares);
    }

    return (
        <>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={handleClick} />
                <Square value={squares[1]} onSquareClick={handleClick}/>
                <Square value={squares[2]} onSquareClick={handleClick} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={handleClick} />
                <Square value={squares[4]} onSquareClick={handleClick} />
                <Square value={squares[5]} onSquareClick={handleClick} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={handleClick} />
                <Square value={squares[7]} onSquareClick={handleClick} />
                <Square value={squares[8]} onSquareClick={handleClick} />
            </div>
        </>
    )
}