

import {useState} from "react";

export default function Square({value, onSquareClick}) {
    const [value, setValue] = useState<string | null>(null);

    return <button
        className="square"
        onClick={onSquareClick}
    >
        {value}
    </button>;
}