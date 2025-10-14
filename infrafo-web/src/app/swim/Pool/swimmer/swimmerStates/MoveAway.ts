import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {OK, Point, StepResult, SwimmerStateName, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";

export class MoveAway implements SwimmerState {
    readonly name: SwimmerStateName = "MoveAway";
    constructor(public swimmer: SwimmerV4) {}

    private getUnitVectorFrom = (position: Readonly<Point>): UnitVector => {
        const delta = this.swimmer.vecFrom(position);
        return { ux: delta.dx / delta.len, uy: delta.dy / delta.len };
    };

    private moveAlong(u: UnitVector, dt: number): void {
        const s = this.swimmer;
        s.pos.x += u.ux * s.speed * dt;
        s.pos.y += u.uy * s.speed * dt;
        s.limitByPoolSize?.();
    };

    update(coach: Actor, dt: number): StepResult {
        const away: UnitVector = this.getUnitVectorFrom(coach.position);
        this.moveAlong(away, dt);
        return OK;
    }

}