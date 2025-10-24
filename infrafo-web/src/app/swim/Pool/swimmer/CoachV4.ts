import {ActorV2} from "@/app/swim/Pool/swimmer/ActorV2";
import {Actor} from "@/app/swim/Pool/Actor";
import {OK, StepResult} from "@/app/swim/Pool/Types";

export class SwimmerV4 extends ActorV2 {
    update(opponent: Actor, dt: number): StepResult {
        return OK;
    }
}