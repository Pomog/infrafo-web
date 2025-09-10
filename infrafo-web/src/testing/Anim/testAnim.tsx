"use client";
import React, {useEffect, useRef} from 'react';

const TRACK = 300;
const DOT = 20;
const SPEED = 120;
const DT_MAX = 0.05;
const STEP = 1 / 60

const TestAnim: React.FC<{}> = () => {
    const dotRef = useRef<HTMLDivElement | null>(null);

    const dirRef = useRef<1 | -1>(1);
    const runRef = useRef(true);
    const rafId = useRef<number | null>(null);
    const prevRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        let x: number = 0;
        let acc = 0;

        const tick = (t: number) => {
            const el = dotRef.current;
            if (!el) return;

            if (prevRef.current === undefined) prevRef.current = t;

            const dt = Math.min(DT_MAX, (t - prevRef.current) / 1000);
            prevRef.current = t;

            acc += dt;

            while (acc >= STEP) {
                x += SPEED * STEP * dirRef.current;

                if (x >= TRACK) {
                    x = TRACK;
                    dirRef.current = -1;
                } else if (x <= 0) {
                    x = 0;
                    dirRef.current = 1;
                }

                acc -= STEP;
            }

            el.style.transform = `translate3d(${x}px,0,0)`;

            if (runRef.current) {
                rafId.current = requestAnimationFrame(tick);
            }
        };

        rafId.current = requestAnimationFrame(tick);

        const toggleRun = () => {
            if (runRef.current) {
                runRef.current = false;
                if (rafId.current != null) {
                    if (typeof rafId.current === "number") {
                        cancelAnimationFrame(rafId.current);
                    }
                    rafId.current = null;
                }
            } else {
                runRef.current = true;
                prevRef.current = undefined;
                rafId.current = requestAnimationFrame(tick);
            }
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                toggleRun();
            }
        };

        const sceneEl = dotRef.current?.parentElement;
        sceneEl?.addEventListener("click", toggleRun);
        window.addEventListener("keydown", onKey);


        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            window.removeEventListener("keydown", onKey);
            sceneEl?.removeEventListener("click", toggleRun);
        }
    }, []);

    return (
        <div style={{
            width: TRACK + DOT * 2,
            height: 80,
            background: '#0b1324',
            padding: 20,
            borderRadius: 12,
            perspective: '500px',
            userSelect: "none",
            cursor: "pointer",
        }}
             title="Click/Space - pause"
        >
            <div
                ref={dotRef}
                style={{
                    width: DOT, height: DOT, borderRadius: DOT / 2,
                    background: '#22d3ee', willChange: 'transform',
                }}
            />
        </div>
    );
};

export default TestAnim;