import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {OK, StepResult, SwimmerStateName} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";

export class MoveAway implements SwimmerState {
    readonly name: SwimmerStateName = "MoveAway";

    update(coach: Actor, dt: number): StepResult {
        return OK;
    }

}