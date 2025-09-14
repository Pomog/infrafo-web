import {Actor} from "@/app/swim/Pool/Actor";
import {CATCH_EPS, Delta, MyVector, OK, Point, StepResult, UnitVector} from "@/app/swim/Pool/Types";

export class Coach extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;
    private lastSpin: -1 | 1 = 1;

    constructor(speed: number, start: Point, poolRadius: number, poolCenter: Point) {
        super(speed, start);
        this.poolRadius = poolRadius;
        this.poolCenter = poolCenter;
    }

    update(dt: number, opponent: Actor): StepResult {
        const dir: -1 | 0 | 1 = this.chooseDirCCW(opponent.position);
        if (dir === 0) return OK; // no move this frame

        // angular step: ΔA = (v*dt)/R, signed by dir
        const dA = dir * (this.speed * dt) / this.poolRadius;

        // Current radial vector from center to Coach
        const radialVector: Delta = this.vecFrom(this.poolCenter);

        const normalizedRadialVector: Delta = {
            dx: radialVector.dx * this.poolRadius / radialVector.len,
            dy: radialVector.dy * this.poolRadius / radialVector.len,
            len: radialVector.len,
        };

        // rotate r by ΔA
        const c = Math.cos(dA), s = Math.sin(dA);
        const nx = normalizedRadialVector.dx * c - normalizedRadialVector.dy * s;
        const ny = normalizedRadialVector.dx * s + normalizedRadialVector.dy * c;

        this.pos = { x: radialVector.dx + nx, y: radialVector.dy + ny };

        return OK;
    }

    private chooseDirCCW(opponentPos: Point): -1 | 0 | 1 {
        const radialVector: MyVector = {
            vx: this.pos.x - this.poolCenter.x,
            vy: this.pos.y - this.poolCenter.y,
        };
        const rl = Math.hypot(radialVector.ux, radialVector.uy);

        if (rl <= CATCH_EPS) {
            return this.isOpponentFartherThanRadius(opponentPos);
        }

        const radialUnitVector: UnitVector = {
            ux: radialVector.vx / rl,
            uy: radialVector.vy / rl,
        };

        const ccwVector: MyVector = {
            vx: -radialUnitVector.uy,
            vy: radialUnitVector.ux
        }

        const vectorToOpponent: MyVector = {
            vx: opponentPos.x - this.pos.x,
            vy: opponentPos.y - this.pos.y,
        }

        const dotProduct: number = (ccwVector.vx*vectorToOpponent.vx) + (ccwVector.vy*vectorToOpponent.vy);

        if (Math.abs(dotProduct) > CATCH_EPS) {
            const s: -1 | 1 = (dotProduct > CATCH_EPS ? 1 : -1);
            this.lastSpin = s;
            return s;
        }
        return 0;
    }

    private isOpponentFartherThanRadius(opponentPos: Point): 0 | 1 | -1 {
        return this.poolRadius < this.vecFrom(opponentPos).len ? this.lastSpin : 0;
    };

}