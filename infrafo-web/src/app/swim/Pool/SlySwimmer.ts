import {Actor} from "@/app/swim/Pool/Actor";
import {OK, Point, StepResult} from "@/app/swim/Pool/Types";


export class SlySwimmer extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;
    private vt: number = 0;
    private lastTangSign: -1 | 1 = 1;
    private tangentialVelocity: number = 0;
    private radialVelocity: number = 0;

    constructor(speed: number, start: Point, poolRadius: number, poolCenter: Point) {
        super(speed, start);
        this.poolRadius = poolRadius;
        this.poolCenter = poolCenter;
    }
    update(dt: number, opponent: Actor): StepResult {
        return OK ;
    }

}