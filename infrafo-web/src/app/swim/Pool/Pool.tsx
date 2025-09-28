"use client";

import React, { useEffect, useRef, useState } from "react";
import { Coach } from "@/app/swim/Pool/Coach";
import { Point, StepResult } from "@/app/swim/Pool/Types";
import {Swimmer3} from "@/app/swim/Pool/Swimmer3";

const STEP = 1 / 60;
const DT_MAX = 0.05;

const R = 100;   // pool radius
const SCALE = 2; // UI scale
const PAD = 24;  // padding around pool (px)
const DOT = 14;  // dot size (px)

const SWIMMER_SPEED = 20;
const COACH_SPEED = 80;

export default function SwimAnim() {
    const swimmerRef = useRef<Swimmer3 | null>(null);
    const coachRef = useRef<Coach | null>(null);

    const rafId = useRef<number | null>(null);
    const prevT = useRef<number | undefined>(undefined);
    const acc = useRef(0);

    // status + a dummy counter to force re-render each frame
    const [running, setRunning] = useState(true);
    const [status, setStatus] = useState<"running" | "caught" | "fled">("running");
    const [, force] = useState(0); // <-- trigger render

    useEffect(() => {
        const center: Point = { x: 0, y: 0 };
        // pass radius/center to Swimmer to detect "fled"
        swimmerRef.current = new Swimmer3(SWIMMER_SPEED, { x: 1, y: 0 }, R, center);
        coachRef.current = new Coach(COACH_SPEED, { x: R, y: 0 }, R, center);

        rafId.current = requestAnimationFrame(tick);
        return () => {
            if (rafId.current != null) cancelAnimationFrame(rafId.current);
            rafId.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tick = (t: number) => {
        if (!swimmerRef.current || !coachRef.current) return;

        if (prevT.current === undefined) prevT.current = t;
        const dtRaw = (t - prevT.current) / 1000;
        const dt = Math.min(DT_MAX, dtRaw);
        prevT.current = t;
        acc.current += dt;

        let stopNow = false;

        while (running && status === "running" && acc.current >= STEP) {
            const s = swimmerRef.current!;
            const c = coachRef.current!;

            const r1: StepResult = s.update(STEP, c);
            const r2: StepResult = c.update(STEP, s);

            if (r1.kind === "caught" || r2.kind === "caught") {
                setStatus("caught");
                setRunning(false);
                stopNow = true;
                break;
            }
            if (r1.kind === "fled") {
                setStatus("fled");
                setRunning(false);
                stopNow = true;
                break;
            }
            acc.current -= STEP;
        }

        // force a repaint so DOM reads latest positions from refs
        force((n) => (n + 1) | 0);

        if (stopNow) {
            if (rafId.current != null) cancelAnimationFrame(rafId.current);
            rafId.current = null;
            return;
        }

        if (running && status === "running") {
            rafId.current = requestAnimationFrame(tick);
        }
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                toggleRun();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const toggleRun = () => {
        setRunning((r) => {
            const next = !r;
            if (next && status === "running") {
                prevT.current = undefined; // avoid a huge dt spike on resume
                rafId.current = requestAnimationFrame(tick);
            } else if (!next && rafId.current != null) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
            return next;
        });
    };

    // project domain coords (center at 0,0) to screen px
    const centerPx = { x: PAD + R * SCALE, y: PAD + R * SCALE };
    const toScreen = (p: Point) => ({
        x: centerPx.x + p.x * SCALE,
        y: centerPx.y + p.y * SCALE,
    });

    const sPos = swimmerRef.current?.position ?? { x: 1, y: 0 };
    const cPos = coachRef.current?.position ?? { x: R, y: 0 };
    const s = toScreen(sPos);
    const c = toScreen(cPos);

    const W = PAD * 2 + R * 2 * SCALE;
    const H = W;

    return (
        <div
            role="button"
            onClick={toggleRun}
            title="Click or Space — pause/resume"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.code === "Space") { e.preventDefault(); toggleRun(); }
            }}
            style={{
                width: W,
                height: H + 40,
                display: "grid",
                gridTemplateRows: `${H}px 40px`,
                placeItems: "center",
                userSelect: "none",
                cursor: "pointer",
                gap: 8,
            }}
        >
            {/* Pool */}
            <div
                style={{
                    width: W,
                    height: H,
                    position: "relative",
                    background: "#0b1324",
                    borderRadius: H / 2,
                    boxShadow: `inset 0 0 0 2px #284a8a`,
                }}
            >
                {/* swimmer (cyan) */}
                <div
                    style={{
                        position: "absolute",
                        width: DOT,
                        height: DOT,
                        borderRadius: DOT / 2,
                        background: "#22d3ee",
                        willChange: "transform",
                        transform: `translate3d(${s.x - DOT / 2}px, ${s.y - DOT / 2}px, 0)`,
                    }}
                />
                {/* coach (amber) */}
                <div
                    style={{
                        position: "absolute",
                        width: DOT,
                        height: DOT,
                        borderRadius: DOT / 2,
                        background: "#f59e0b",
                        willChange: "transform",
                        transform: `translate3d(${c.x - DOT / 2}px, ${c.y - DOT / 2}px, 0)`,
                    }}
                />
                {/* center dot (optional) */}
                <div
                    style={{
                        position: "absolute",
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        background: "#94a3b8",
                        transform: `translate3d(${centerPx.x - 2}px, ${centerPx.y - 2}px, 0)`,
                        opacity: 0.6,
                    }}
                />
            </div>

            <div style={{ color: "#9ca3af" }}>
                {status === "running"
                    ? "Running… Click/Space to pause"
                    : status === "fled"
                        ? "Swimmer fled! Click/Space to pause"
                        : "Caught! Click/Space to pause"}
            </div>
        </div>
    );
}
