import {ActorV2} from "@/app/swim/Pool/swimmer/ActorV2";
import {Actor} from "@/app/swim/Pool/Actor";
import {CATCH_EPS, CAUGHT, OK, Point, StepResult, UnitVector} from "@/app/swim/Pool/Types";

/**
 * Convention:
 * vr — from center (radial, outward)
 * vt — tangent CCW (rot90(vr))
 * ω > 0 = CCW; ω < 0 = CW
 * tangent = (ω >= 0 ? +vt : -vt)
 */
export class CoachV4 extends ActorV2 {
    /** +1 = CCW, -1 = CW */

    private currentSpin: -1 | 0 | 1 = 0;
    private lastOmega = 0;

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

        // CCW tangent (radial vector rotated π/2)
        const tccw_x = -ry, tccw_y = rx;

        // swimmer-coach vector
        const tsx = target.x - this.position.x;
        const tsy = target.y - this.position.y;

        const dot = tccw_x * tsx + tccw_y * tsy;

        if (Math.abs(Math.sqrt(dot)) > CATCH_EPS) {
            const s: -1 | 1 = dot > 0 ? 1 : -1; // dot>0 → CCW, dot<0 → CW
            this.currentSpin = s;
            return s;
        }

        // Collinearity case: compare the radius and swimmer-coach dist
        const distCS = Math.hypot(this.position.x - target.x, this.position.y - target.y);
        if (distCS < R - CATCH_EPS) return 0;
        return this.currentSpin;
    }

    /**
     * signed angular velocity
     * ω = lastSpin * v / r
     */
    public getSignedAngularVelocity(): number {
        const center = this.getPoolCenter();
        const r = Math.hypot(this.position.x - center.x, this.position.y - center.y);
        return r > 0 ? this.currentSpin * (this.speed / r) : 0;
    }

    update(opponent: Actor, dt: number): StepResult {
        // BEFORE moving check isCaught
        if (this.isCaught(opponent)) return CAUGHT;

        // decide direction along the rim: +1 = CCW, -1 = CW, 0 = stay
        const dir = this.chooseDirCCW(opponent.position);
        if (dir === 0) return OK;

        // Angular step: ΔA = (v*dt)/R, signed by dir
        const dA = (dir * this.speed * dt) / R;

        // Current radial vector (center -> coach)
        const O = this.getPoolCenter();
        const R = this.getPoolRadius();
        const dx = this.position.x - O.x;
        const dy = this.position.y - O.y;
        const rl = Math.hypot(dx, dy);
        if (!(rl > 0)) return OK;

        // Scale radial vector to exact radius (remove drift)
        const rx = (dx * R) / rl;
        const ry = (dy * R) / rl;

        // Rotate by ΔA (strictly along arc)
        const c = Math.cos(dA), s = Math.sin(dA);
        const nx = rx * c - ry * s;
        const ny = rx * s + ry * c;

        // New position on the circle
        this.setPosition({ x: O.x + nx, y: O.y + ny });

        // remember last non-zero spin for tie-breaks
        this.currentSpin = dir;

        // AFTER moving
        if (this.isCaught(opponent)) return CAUGHT;
        return OK;
    }
}