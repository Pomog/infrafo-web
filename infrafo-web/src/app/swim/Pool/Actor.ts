import {CATCH_EPS, Delta, Point, StepResult, UnitVector} from "@/app/swim/Pool/Types";

export abstract class Actor {
    protected pos: Point;

    protected constructor(
        protected readonly speed: number,
        startPoint: Point
    ) {
        this.pos = {...startPoint};
    }

    protected vecFrom(p: Point): Delta {
        const dx = this.pos.x - p.x;
        const dy = this.pos.y - p.y;
        const len = Math.hypot(dx, dy);
        return {dx, dy, len};
    }

    protected moveAlong(uVector: UnitVector, dt): void {
        this.pos = {
            x: this.pos.x + uVector.ux * this.speed * dt,
            y: this.pos.y + uVector.uy * this.speed * dt,
        };
    }


    protected unitFrom(p: Point): { uVector: UnitVector; len: number } | null {
        const {dx, dy, len} = this.vecFrom(p);
        if (len <= CATCH_EPS) return null;

        const uVector: UnitVector = {ux: dx / len, uy: dy / len};
        return {uVector, len}
    }

    abstract update(dt: number, opponent: Actor): StepResult;

    public get position(): Point {
        return {...this.pos};
    }
}