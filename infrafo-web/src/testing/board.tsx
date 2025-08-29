"use client";

import Square from "@/testing/square";
import {useCallback, useState} from "react";

export default function Board() {
    type Cell = 'X' | 'O' | null;
    const emptyBoard = useCallback(() => Array(9).fill(null), []);
    const [squares, setSquares] = useState<Cell[]>(emptyBoard);

    return (
        <>
            <div className="board-row">
                <Square value={squares[0]} />
                <Square value={squares[1]} />
                <Square value={squares[2]} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} />
                <Square value={squares[4]} />
                <Square value={squares[5]} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} />
                <Square value={squares[7]} />
                <Square value={squares[8]} />
            </div>
        </>
    )
}