import { Actor } from "@/app/swim/Pool/Actor";
import { CATCH_EPS, CAUGHT, Delta, MyVector, OK, Point, StepResult, UnitVector } from "@/app/swim/Pool/Types";

export class Coach extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;
    private lastSpin: -1 | 1 = 1; // last non-zero direction: +1=CCW, -1=CW

    constructor(speed: number, start: Point, poolRadius: number, poolCenter: Point) {
        super(speed, start);
        this.poolRadius = poolRadius;
        this.poolCenter = poolCenter;
    }

    update(dt: number, opponent: Actor): StepResult {
        // BEFORE moving
        if (this.isCaught(opponent)) return CAUGHT;

        // decide direction along the rim: +1 = CCW, -1 = CW, 0 = stay
        const dir: -1 | 0 | 1 = this.chooseDirCCW(opponent.position);
        if (dir === 0) return OK; // tie case: moving wouldn't help

        // Angular step: ΔA = (v*dt)/R, signed by dir
        const dA = (dir * this.speed * dt) / this.poolRadius;

        // Current radial vector (center -> coach)
        const radial: Delta = this.vecFrom(this.poolCenter); // {dx,dy,len}

        // Scale to exact radius (remove drift)
        const rx = (radial.dx * this.poolRadius) / radial.len;
        const ry = (radial.dy * this.poolRadius) / radial.len;

        // Rotate by ΔA (strictly along arc)
        const c = Math.cos(dA), s = Math.sin(dA);
        const nx = rx * c - ry * s;
        const ny = rx * s + ry * c;

        // New position on the circle
        this.pos = { x: this.poolCenter.x + nx, y: this.poolCenter.y + ny };

        // AFTER moving
        if (this.isCaught(opponent)) return CAUGHT;
        return OK;
    }

    /**
     * Decide the best direction along the rim to reduce distance to the swimmer.
     * Returns: +1 (CCW), -1 (CW), or 0 (stay).
     */
    private chooseDirCCW(opponentPos: Point): -1 | 0 | 1 {
        // Radial (center -> coach)
        const rv: MyVector = {
            vx: this.pos.x - this.poolCenter.x,
            vy: this.pos.y - this.poolCenter.y,
        };
        const rl = Math.hypot(rv.vx, rv.vy);
        if (rl <= CATCH_EPS) return 0; // shouldn't happen, but safe-guard

        // Unit radial
        const rUnit: UnitVector = { ux: rv.vx / rl, uy: rv.vy / rl };

        // CCW tangent: rotate radial left by 90° → (-uy, ux)
        const tCCW: MyVector = { vx: -rUnit.uy, vy: rUnit.ux };

        // Vector to swimmer (swimmer - coach) → makes "dot>0 ⇒ go CCW"
        const toS: MyVector = { vx: opponentPos.x - this.pos.x, vy: opponentPos.y - this.pos.y };

        // Projection onto CCW tangent
        const dot = tCCW.vx * toS.vx + tCCW.vy * toS.vy;

        if (Math.abs(dot) > CATCH_EPS) {
            const s: -1 | 1 = dot > 0 ? 1 : -1; // dot>0 ⇒ CCW; dot<0 ⇒ CW
            this.lastSpin = s;
            return s;
        }

        // Tie: swimmer collinear with center–coach.
        // If |C−S| < R → same half-ray → best is to stay.
        // Else          → opposite half-ray → either side helps → keep lastSpin.
        const distCS = Math.hypot(this.pos.x - opponentPos.x, this.pos.y - opponentPos.y);
        if (distCS < this.poolRadius - CATCH_EPS) return 0;
        return this.lastSpin;
    }
}