

import {useState} from "react";

export default function Square() {
    const [value, setValue] = useState<string | null>(null);

    function handleClick() {
        setValue('X');
    }

    return <button
        className="square"
        onClick={handleClick}
    >
        {value}
    </button>;
}