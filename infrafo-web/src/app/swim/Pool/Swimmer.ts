import {Actor} from "@/app/swim/Pool/Actor";
import {CAUGHT, OK, Point, StepResult} from "@/app/swim/Pool/Types";

export class Swimmer extends Actor {
    constructor(start: Point, speed: number) {
        super(speed, start);
    }
    update(dt: number, opponent: Actor): StepResult {
        const dir = this.directionFrom(opponent.position);
        if (!dir) return CAUGHT;

        this.moveAlong(dir.uVector, dt);

        return OK;
    }
}