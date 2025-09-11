"use client";
import React, {useEffect, useRef} from "react";

const TRACK = 300;
const DOT = 20;
const DT_MAX = 0.05;
const STEP = 1 / 60;

const CONTAINER_H = DOT * 4;
const START_X = TRACK / 2;
const START_Y = (CONTAINER_H - DOT) / 2;

const OMEGA_X = 1;
const OMEGA_Y = 1;
const SPEED_K = 1.0;

const TestAnim2: React.FC = () => {
    const dotRef = useRef<HTMLDivElement | null>(null);

    const runRef = useRef(true);
    const rafId = useRef<number | null>(null);
    const prevRef = useRef<number | undefined>(undefined);

    const tSec = useRef(0);

    useEffect(() => {
        const cx = START_X;
        const cy = START_Y;
        const ax = Math.max(0, cx - 2);
        const ay = Math.max(0, cy - 2);

        let acc = 0;

        const tick = (t: number) => {
            const el = dotRef.current;
            if (!el) return;

            if (prevRef.current === undefined) prevRef.current = t;
            const dt = Math.min(DT_MAX, (t - prevRef.current) / 1000);
            prevRef.current = t;

            acc += dt;
            while (acc >= STEP) {
                tSec.current += STEP * SPEED_K;
                acc -= STEP;
            }

            const x = cx + ax * Math.cos(OMEGA_X * tSec.current);
            const y = cy + ay * Math.sin(OMEGA_Y * tSec.current);

            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

            if (runRef.current) {
                rafId.current = requestAnimationFrame(tick);
            }
        };

        const el = dotRef.current;
        if (el) el.style.transform = `translate3d(${START_X}px, ${START_Y}px, 0)`;
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

        function onClick(this: HTMLElement, e: MouseEvent) {
            e.preventDefault();
            toggleRun();
        }

        function onKey(this: Window, e: KeyboardEvent) {
            if (e.code === "Space") {
                e.preventDefault();
                toggleRun();
            }
        }

        const sceneEl = dotRef.current?.parentElement as HTMLElement | null;
        sceneEl?.addEventListener("click", onClick);
        window.addEventListener("keydown", onKey);

        return () => {
            stopRaf();
            window.removeEventListener("keydown", onKey);
            sceneEl?.removeEventListener("click", onClick);
        };
    }, []);

    return (
        <div
            style={{
                width: TRACK + DOT,
                height: CONTAINER_H,
                background: "#0b1324",
                padding: 0,
                borderRadius: 12,
                userSelect: "none",
                cursor: "pointer",
            }}
            title="Click/Space — pause/resume"
        >
            <div
                ref={dotRef}
                style={{
                    width: DOT, height: DOT, borderRadius: DOT / 2,
                    background: "#22d3ee", willChange: "transform",
                    transform: `translate3d(${START_X}px, ${START_Y}px, 0)`,
                }}
            />
        </div>
    );
};

export default TestAnim2;