import {Actor} from "@/app/swim/Pool/Actor";
import {OK, Delta, Point, Polar, StepResult, UnitVector} from "@/app/swim/Pool/Types";


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

    private polarState(): Polar {
        const vectorFromCenter: Delta = this.vecFrom(this.poolCenter);

        const theta: number = Math.atan2(vectorFromCenter.dy, vectorFromCenter.dx);

        // radial unit vector OS
        const vr: UnitVector = this.normalize(vectorFromCenter.dx, vectorFromCenter.dy);

        // tangential unit vector OS, rotate vr
        const vt: UnitVector = {ux: -vr.uy, uy: vr.ux};

        return { r: vectorFromCenter.len, theta, vr, vt };
    }

    private normalize(x: number, y: number): UnitVector {
        const L = Math.hypot(x, y);
        return L > 0 ? { ux: x / L, uy: y / L } : { ux: 1, uy: 0 };
    }





        update(dt: number, opponent: Actor): StepResult {
        return OK ;
    }

}