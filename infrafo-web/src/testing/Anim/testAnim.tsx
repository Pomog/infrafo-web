"use client";
import React, {useEffect, useRef} from 'react';

const TRACK = 300;
const DOT = 20;
const SPEED = 120;
const DT_MAX = 0.05;
const STEP = 1 / 60

const CONTAINER_H = DOT * 3;
const START_X = TRACK / 2;
const START_Y = (CONTAINER_H - DOT) / 2;

const TestAnim: React.FC<{}> = () => {
    const dotRef = useRef<HTMLDivElement | null>(null);

    const dirRef = useRef<1 | -1>(1);
    const runRef = useRef(true);
    const rafId = useRef<number | null>(null);
    const prevRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        let x: number = START_X;
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

            el.style.transform = `translate3d(${x}px,${START_Y}px,0)`;

            if (runRef.current) {
                rafId.current = requestAnimationFrame(tick);
            }
        };

        rafId.current = requestAnimationFrame(tick);

        const stopRaf = () => {
            const id = rafId.current;
            if (id !== null) {
                cancelAnimationFrame(id);
                rafId.current = null;
            }
        };

        const toggleRun = () => {
            if (runRef.current) {
                runRef.current = false;
                stopRaf();
            } else {
                runRef.current = true;
                prevRef.current = undefined;
                rafId.current = requestAnimationFrame(tick);
            }
        };

        const onKey: EventListener = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                toggleRun();
            }
        };

        const onClick: EventListener = (e: MouseEvent) => {
            e.preventDefault?.();
            toggleRun();
        };

        const sceneEl = dotRef.current?.parentElement;
        sceneEl?.addEventListener("click", onClick);
        window.addEventListener("keydown", onKey);


        return () => {
            stopRaf();
            window.removeEventListener("keydown", onKey);
            sceneEl?.removeEventListener("click", onClick);
        }
    }, []);

    return (
        <div
            style={{
            width: TRACK + DOT,
            height: DOT*3,
            background: '#0b1324',
            padding: 0,
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
                    transform: `translate3d(${START_X}px, ${START_Y}px, 0)`,
                }}
            />
        </div>
    );
};

export default TestAnim;