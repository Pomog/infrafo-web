import {ActorV2} from "@/app/swim/Pool/swimmer/ActorV2";
import {Actor} from "@/app/swim/Pool/Actor";
import {OK, StepResult, UnitVector} from "@/app/swim/Pool/Types";

/**
 * Convention:
 * vr - form center
 * vt - tangent CWW
 * ω > 0 = CCW; ω < 0 = CW
 * tangent = (ω>=0 ? vt : -vt)
 */
export class CoachV4 extends ActorV2 {
    /** +1 = CCW, -1 = CW */
    constructor(
        speed: number,
        poolRadius: number,
        poolCenter: {x:number;y:number},
        position: {x:number;y:number},
        private readonly dir: 1 | -1 = 1,
    ) {
        super(speed, poolRadius, poolCenter, position);
    }

    private tangentCCW(): UnitVector {
        const vr = this.radialUnitFromCenter();
        return { ux: -vr.uy, uy: vr.ux };
    }
    update(opponent: Actor, dt: number): StepResult {
        return OK;
    }
}