"use client";

import Board from "@/testing/board";
import {useCallback, useState} from "react";
import {Cell} from "@/testing/types";

export default function Game() {

    const emptyBoard = useCallback((): Cell[] => Array<Cell>(9).fill(null), []);
    const [history, setHistory] = useState<ReadonlyArray<ReadonlyArray<Cell>>>([
        emptyBoard(),
    ]);
    const [xIsNext, setXIsNext] = useState<boolean>(true);

    const currentSquares = history[history.length - 1];

    function handlePlay(nextSquares) {
        setHistory(prev => [...prev, nextSquares]);
        setXIsNext(prev => !prev);
    }

    const reset = () => {
        setHistory([emptyBoard()]);
        setXIsNext(true);
    };

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                    reset={reset} />
            </div>
            <div className="game-info">
                <ol>{/*TODO*/}</ol>
            </div>
        </div>
    );
}