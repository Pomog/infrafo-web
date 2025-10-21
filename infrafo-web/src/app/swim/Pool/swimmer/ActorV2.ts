import {CATCH_EPS, Delta, Point, StepResult, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";

export abstract class ActorV2 {
    pos: Point;

    protected constructor(
        readonly speed: number,
        protected readonly poolRadius: number,
        protected readonly poolCenter: Point,
        protected position: Point,
    ) {
        this.pos = {...position};
        this.poolCenter = { ...this.poolCenter }
    }

    get position(): Readonly<Point> {
        return this.pos;
    }

    setPosition(p: Readonly<Point>): void {
        this.pos.x = p.x;
        this.pos.y = p.y;
        this.limitByPoolSize();
    }

    set position(p: Readonly<Point>) { this.setPosition(p); }

    nudge(dx: number, dy: number): void {
        this.pos.x += dx;
        this.pos.y += dy;
        this.limitByPoolSize();
    }

    moveAlong(u: UnitVector, dt: number): void {
        this.nudge(u.ux * this.speed * dt, u.uy * this.speed * dt);
    }

    get poolCenter(): Readonly<Point> {
        return this.poolCenter
    }

    get poolRadius(): Readonly<number> {
        return this.poolRadius;
    }

    abstract update(opponent: Actor, dt: number): StepResult;

    vecFrom(p: Point): Delta {
        const dx = this.pos.x - p.x;
        const dy = this.pos.y - p.y;
        const len = Math.hypot(dx, dy);
        return {dx, dy, len};
    }

    protected distanceToActor(other: Actor): number {
        return this.vecFrom(other.position).len;
    }

    protected isCaught(other: Actor, eps: number = CATCH_EPS): boolean {
        return this.distanceToActor(other) <= eps;
    }

    protected isFled(){
        const lenFromCenter = this.vecFrom(this.poolCenter);
        return this.poolRadius < lenFromCenter.len;
    }

    limitByPoolSize() {
        const rx = this.pos.x - this.poolCenter.x;
        const ry = this.pos.y - this.poolCenter.y;
        const r = Math.hypot(rx, ry);
        if (r > this.poolRadius) {
            const k = this.poolRadius / r;
            this.pos.x = this.poolCenter.x + rx * k;
            this.pos.y = this.poolCenter.y + ry * k;
        }
    };

    getUnitVectorFrom = (position: Readonly<Point>): UnitVector => {
        const delta = this.vecFrom(position);
        return { ux: delta.dx / delta.len, uy: delta.dy / delta.len };
    };

    private angDiffRad(a: number, b: number): number {
        let d = a - b;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        return d;
    }
}
