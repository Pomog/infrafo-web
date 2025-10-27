import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {MIN_LEN, OK, OVER_COACH, StepResult, SwimmerStateName, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";

export class CurlState implements SwimmerState {
    readonly name: SwimmerStateName = "Curl";

    constructor(public swimmer: SwimmerV4) {
    }

    update(coach: Actor, dt: number): StepResult {
        if (this.swimmer.isOppositeThroughCenter(coach)) {
            this.swimmer.setCurrentState("BuildGap");
            return OK;
        }
        const dir: UnitVector = this.curlDirection(coach);
        this.swimmer.moveAlong(dir, dt);
        return OK;
    }

    private curlDirection(coach: Actor): UnitVector {
        const {r, vr, vt} = this.swimmer.polarState();

        // TODO: add sign - CCW CW
        const omega = this.swimmer.getCoachAngularVelocity(coach);

        const vtMag = Math.abs(omega * r) * OVER_COACH;
        if (!Number.isFinite(vtMag) || vtMag >= this.swimmer.speed) {
            throw new Error(`CurlState: vt=${vtMag.toFixed(4)} >= v_swimmer=${this.swimmer.speed}`);
        }

        const vrMag = Math.sqrt(this.swimmer.speed * this.swimmer.speed - vtMag * vtMag);

        const vtSign = omega >= 0 ? -1 : 1;

        const vx = vt.ux * (vtSign * vtMag) + vr.ux * vrMag;
        const vy = vt.uy * (vtSign * vtMag) + vr.uy * vrMag;

        const vlen = Math.hypot(vx, vy);
        if (!Number.isFinite(vlen) || vlen <= MIN_LEN) {
            return vr;
        }
        return {ux: vx / vlen, uy: vy / vlen};
    }

}