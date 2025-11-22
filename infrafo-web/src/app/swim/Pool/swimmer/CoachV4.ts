import {ActorV2} from "@/app/swim/Pool/swimmer/ActorV2";
import {Actor} from "@/app/swim/Pool/Actor";
import {CATCH_EPS, CAUGHT, OK, Point, StepResult, UnitVector} from "@/app/swim/Pool/Types";

/**
 * Convention:
 * vr - form center
 * vt - tangent CWW
 * ω > 0 = CCW; ω < 0 = CW
 * tangent = (ω>=0 ? vt : -vt)
 */
export class CoachV4 extends ActorV2 {
    /** +1 = CCW, -1 = CW */

    private lastSpin: -1 | 1 = 1;

    constructor(
        speed: number,
        poolRadius: number,
        poolCenter: { x: number; y: number },
        position: { x: number; y: number },
    ) {
        super(speed, poolRadius, poolCenter, position);
    }

    /** Rotate the radial vector by +90° */
    private tangentCCW(): UnitVector {
        const vr = this.radialUnitFromCenter();
        return {ux: -vr.uy, uy: vr.ux};
    }

    /**
     * +1 — move CCW (increase angle),
     * -1 — move CW (decrease angle),
     * 0 — stop if moving along the arc doesn't improve anything.
     */
    private chooseDirCCW(target: Point): -1 | 0 | 1 {
        const O = this.getPoolCenter();
        const R = this.getPoolRadius();

        // radial vector
        const rx = this.position.x - O.x;
        const ry = this.position.y - O.y;

        // CCW tangent (radial unit vector turn π/2)
        const tccw_x = -ry, tccw_y = rx;

        // swimmer-coach vector
        const tsx = target.x - this.position.x;
        const tsy = target.y - this.position.y;

        const dot = tccw_x * tsx + tccw_y * tsy;

        if (Math.abs(dot) > CATCH_EPS) {
            const s: -1 | 1 = dot > 0 ? 1 : -1; // dot>0 → CCW, dot<0 → CW
            this.lastSpin = s;
            return s;
        }

        // Collinearity case: compare the radius and swimmer-coach dist
        const distCS = Math.hypot(this.position.x - target.x, this.position.y - target.y);
        if (distCS < R - CATCH_EPS) return 0;
        return this.lastSpin;
    }

    /**
     * signed angular velocity
     * ω = lastSpin * v / r
     */
    public getSignedAngularVelocity(): number {
        const center = this.getPoolCenter();
        const rx = this.position.x - center.x;
        const ry = this.position.y - center.y;
        const r = Math.hypot(rx, ry);
        return r > 0 ? this.lastSpin * (this.speed / r) : 0;
    }

    update(opponent: Actor, dt: number): StepResult {
        // BEFORE moving check isCaught
        if (this.isCaught(opponent)) return CAUGHT;

        // decide direction along the rim: +1 = CCW, -1 = CW, 0 = stay

        // Angular step: ΔA = (v*dt)/R, signed by dir

        // Current radial vector (center -> coach)

        // Scale radial vector to exact radius (remove drift)

        // Rotate by ΔA (strictly along arc)

        // New position on the circle

        // AFTER moving
        if (this.isCaught(opponent)) return CAUGHT;
        return OK;
    }
}