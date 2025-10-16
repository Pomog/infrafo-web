import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {OK, Point, StepResult, SwimmerStateName, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";

export class MoveAway implements SwimmerState {
    readonly name: SwimmerStateName = "MoveAway";
    constructor(public swimmer: SwimmerV4) {}



    update(coach: Actor, dt: number): StepResult {
        const away: UnitVector = this.swimmer.getUnitVectorFrom(coach.position);
        this.swimmer.moveAlong(away, dt);
        return OK;
    }

}