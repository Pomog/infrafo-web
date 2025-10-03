import {SwimmerState} from "@/app/swim/Pool/swimmer/State";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";
import {Actor} from "@/app/swim/Pool/Actor";
import {OK, StepResult, SwimmerStateName} from "@/app/swim/Pool/Types";

export class GapState implements SwimmerState {
    readonly name: SwimmerStateName = "BuildGap";

    constructor(private ctx: SwimmerV4) {}

    update(coach: Actor, dt: number): StepResult {
        return OK;
    }

}