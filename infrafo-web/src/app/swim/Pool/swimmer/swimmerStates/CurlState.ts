import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {OK, StepResult, SwimmerStateName} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";

export class CurlState implements SwimmerState {
    readonly name: SwimmerStateName = "Curl";

    constructor(public swimmer: SwimmerV4) {}

    update(coach: Actor, dt: number): StepResult {
        return OK;
    }

}