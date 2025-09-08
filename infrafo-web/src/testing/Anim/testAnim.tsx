"use client";
import React, {useEffect, useRef} from 'react';

const TestAnim: React.FC<{}> = () => {
    const dotRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let x = 0;
        const speed = 50;
        let prev = performance.now();
        let rafId: number;

        const tick = (t: number) => {
            const el = dotRef.current;
            if (!el) return;

            const dt = (t - prev) / 1000;
            prev = t;

            x = (x + speed * dt) % 300;
            el.style.transform = `translate3d(${x}px,0,0)`;

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div style={{width: 340, height: 80, background: '#0b1324', padding: 20, borderRadius: 12}}>
            <div
                ref={dotRef}
                style={{
                    width: 20, height: 20, borderRadius: 10,
                    background: '#22d3ee', willChange: 'transform'
                }}
            />
        </div>
    );
};

export default TestAnim;