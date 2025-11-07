import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";
import {Actor} from "@/app/swim/Pool/Actor";
import {MIN_LEN, OK, StepResult, SwimmerStateName} from "@/app/swim/Pool/Types";

export class GapState implements SwimmerState {
    readonly name: SwimmerStateName = "BuildGap";

    constructor(public swimmer: SwimmerV4) {}

    update(coach: Actor, dt: number): StepResult {

        const { r, vr, vt } = this.swimmer.polarState();
        const omega = this.swimmer.getCoachAngularVelocity(coach);

        // Tangential speed needed to match the coach's angular speed at radius r:
        const vtMatch = Math.abs(omega) * r;

        if (!Number.isFinite(vtMatch) || vtMatch >= this.swimmer.speed) {
            // cannot match omega in BuildGap
            return OK;
        }

        //  v_r = sqrt(v^2 − v_t^2)
        const vrMag = Math.sqrt(this.swimmer.speed * this.swimmer.speed - vtMatch * vtMatch);

        // Tangential direction must have the SAME rotational sense as the coach,
        // so that swimmer's angular velocity equals the coach's:
        //   ω >= 0 (CCW) → +vt
        //   ω <  0 (CW)  → -vt
        const tangent = omega >= 0 ? vt : { ux: -vt.ux, uy: -vt.uy };

        // Calculate parameters for non-normalized velocity vector:
        const vx = tangent.ux * vtMatch + vr.ux * vrMag;
        const vy = tangent.uy * vtMatch + vr.uy * vrMag;
        const vlen = Math.hypot(vx, vy);

        if (vlen > MIN_LEN) {
            // Move using a unit direction; magnitude is applied inside moveAlong via swimmer.speed.
            this.swimmer.moveAlong({ ux: vx / vlen, uy: vy / vlen }, dt);
        }

        return OK;
    }
}