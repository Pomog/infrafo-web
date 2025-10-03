import {CATCH_EPS, Delta, Point, StepResult} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";

export abstract class ActorV2 {
    protected pos: Point;

    protected constructor(
        protected readonly speed: number,
        protected readonly poolRadius: number,
        protected readonly poolCenter: Point,
        position: Point,
    ) {
        this.pos = {...position};
        this.poolCenter = { ...this.poolCenter }
    }

    get position(): Point {
        return { ...this.pos };
    }

    abstract update(opponent: Actor, dt: number): StepResult;

    protected vecFrom(p: Point): Delta {
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
        return this.poolRadius < lenFromCenter;
    }
}
