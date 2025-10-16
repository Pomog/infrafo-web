import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {OK, StepResult, SwimmerStateName, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";

export class DashState implements SwimmerState {
    readonly name: SwimmerStateName = "Dash";

    constructor(public swimmer: SwimmerV4) {}

    update(coach: Actor, dt: number): StepResult {
        const away: UnitVector = this.swimmer.getUnitVectorFrom(this.swimmer.poolCenter);
        this.swimmer.moveAlong(away, dt);
        return OK;
    }


}