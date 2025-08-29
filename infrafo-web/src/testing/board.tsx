"use client";

import Square from "@/testing/square";
import {useState} from "react";

export default function Board() {
    type Cell = 'X' | 'O' | null;
    const emptyBoard = () => Array(9).fill(null);
    const [squares, setSquares] = useState<Cell[]>(emptyBoard);

    return (
        <>
            <div className="board-row">
                <Square/>
                <Square/>
                <Square/>
            </div>
            <div className="board-row">
                <Square/>
                <Square/>
                <Square/>
            </div>
            <div className="board-row">
                <Square/>
                <Square/>
                <Square/>
            </div>
        </>
    )
}