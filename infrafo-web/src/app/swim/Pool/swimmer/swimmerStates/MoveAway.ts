import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {OK, Point, StepResult, SwimmerStateName, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";

export class MoveAway implements SwimmerState {
    readonly name: SwimmerStateName = "MoveAway";
    swimmer: SwimmerV4;

    constructor(private ctx: SwimmerV4) {
        this.swimmer = ctx;
    }

    update(coach: Actor, dt: number): StepResult {
        function getUnitVectorFrom(position: Readonly<Point>): UnitVector {
            // TODO and What is THIS in this case? SwimmerState OR SwimmerV4 ???
            const dx = this.pos.x - position.x;
            const dy = this.pos.y - position.y;
            const len = Math.hypot(dx, dy);
            return {
                ux: dx / len,
                uy: dy / len
            };
        }

        function moveAlong(uVector: UnitVector, dt: number): void {
            this.pos.x = this.pos.x + uVector.ux * this.speed * dt;
            this.pos.y = this.pos.y + uVector.uy * this.speed * dt;
            this.limitByPoolSize();
        }

        const unitVectorCoachSwimmer: UnitVector = getUnitVectorFrom(coach.position);
        return OK;
    }

}