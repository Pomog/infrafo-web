"use client";

import Board from "@/testing/board";
import {useCallback, useState} from "react";
import {Cell} from "@/testing/types";

export default function Game() {

    const emptyBoard = useCallback((): Cell[] => Array<Cell>(9).fill(null), []);
    const [history, setHistory] = useState<ReadonlyArray<ReadonlyArray<Cell>>>([
        emptyBoard(),
    ]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    const reset = () => {
        setHistory([emptyBoard()]);
        setCurrentMove(0);
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
                <ol>{moves}</ol>
            </div>
        </div>
    );
}