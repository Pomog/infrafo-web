import {CATCH_EPS, Delta, Point, StepResult, UnitVector, UnitDirection} from "@/app/swim/Pool/Types";

export abstract class Actor {
    protected pos: Point;

    protected constructor(
        protected readonly speed: number,
        position: Point
    ) {
        this.pos = {...position};
    }

    protected vecFrom(p: Point): Delta {
        const dx = this.pos.x - p.x;
        const dy = this.pos.y - p.y;
        const len = Math.hypot(dx, dy);
        return {dx, dy, len};
    }

    protected speedOf(other: Actor): number {
        return other.speed;
    }

    protected moveAlong(uVector: UnitVector, dt: number): void {
        this.pos = {
            x: this.pos.x + uVector.ux * this.speed * dt,
            y: this.pos.y + uVector.uy * this.speed * dt,
        };
    }

    protected directionFrom(p: Point): UnitDirection | null {
        const {dx, dy, len} = this.vecFrom(p);
        if (len <= CATCH_EPS) return null;

        const uVector: UnitVector = { ux: dx / len, uy: dy / len };
        return { uVector, distance: len };
    }

    /** Distance from this actor to another actor. */
    protected distanceToActor(other: Actor): number {
        return this.vecFrom(other.position).len;
    }

    protected isCaught(other: Actor, eps: number = CATCH_EPS): boolean {
        return this.distanceToActor(other) <= eps;
    }

    protected normalize(x: number, y: number): UnitVector {
        const L = Math.hypot(x, y);
        return L > 0 ? {ux: x / L, uy: y / L} : {ux: 1, uy: 0};
    }

    abstract update(dt: number, opponent: Actor): StepResult;

    public get position(): Readonly<Point> {
        return {...this.pos};
    }
}