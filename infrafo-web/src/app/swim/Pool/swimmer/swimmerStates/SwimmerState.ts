import {StepResult, SwimmerStateName} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";

export interface SwimmerState {
    readonly name: SwimmerStateName;
    update(coach: Actor, dt: number): StepResult;
}