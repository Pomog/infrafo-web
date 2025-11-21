import {ActorV2} from "@/app/swim/Pool/swimmer/ActorV2";
import {Actor} from "@/app/swim/Pool/Actor";
import {CAUGHT, OK, StepResult, UnitVector} from "@/app/swim/Pool/Types";

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
    ) {
        super(speed, poolRadius, poolCenter, position);
    }

    /** Rotate the radial vector by +90° */
    private tangentCCW(): UnitVector {
        const vr = this.radialUnitFromCenter();
        return { ux: -vr.uy, uy: vr.ux };
    }

    public getSignedAngularVelocity(): number {
        const r = this.vecFrom(this.getPoolCenter()).len;
        return (r > 0) ? this.dir * (this.speed / r) : 0;
    }
    update(opponent: Actor, dt: number): StepResult {
        // BEFORE moving сheck isCaught

        // decide direction along the rim: +1 = CCW, -1 = CW, 0 = stay

        // Angular step: ΔA = (v*dt)/R, signed by dir

        // Current radial vector (center -> coach)

        // Scale radial vector to exact radius (remove drift)

        // Rotate by ΔA (strictly along arc)

        // New position on the circle

        // AFTER moving
        if (this.isCaught(opponent)) return CAUGHT;
        return OK;
    }
}