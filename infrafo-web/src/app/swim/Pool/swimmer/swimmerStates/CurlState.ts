import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {ANG_DEAD, MIN_LEN, OK, OVER_COACH, StepResult, SwimmerStateName, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";

export class CurlState implements SwimmerState {
    readonly name: SwimmerStateName = "Curl";

    constructor(public swimmer: SwimmerV4) {}

    update(coach: Actor, dt: number): StepResult {
        if (this.isOppositeThroughCenter(coach)) {
            this.swimmer.setCurrentState("BuildGap");
            return OK;
        }
        const dir: UnitVector = this.curlDirection(coach);
        this.swimmer.moveAlong(dir, dt);
        return OK;
    }

    private isOppositeThroughCenter(coach: Actor): boolean {
        const c = this.swimmer.getPoolCenter();
        const s = this.swimmer.position;
        const k = coach.position;

        const csx = s.x - c.x, csy = s.y - c.y;   // center -> swimmer
        const ckx = k.x - c.x, cky = k.y - c.y;   // center -> coach

        const csLen = Math.hypot(csx, csy);
        const ckLen = Math.hypot(ckx, cky);
        if (!(csLen > MIN_LEN && ckLen > MIN_LEN)) return false;

        const csux = csx / csLen, csuy = csy / csLen; // unit(center->swimmer)
        const ckux = ckx / ckLen, ckuy = cky / ckLen; // unit(center->coach)

        const dot   = csux * ckux + csuy * ckuy;      // cos Δθ
        const cross = csux * ckuy - csuy * ckux;      // sin Δθ (z-компонента)

        const cosTol = Math.cos(ANG_DEAD);
        const sinTol = Math.sin(ANG_DEAD);

        return Math.abs(cross) <= sinTol && dot <= -cosTol;
    }

    private curlDirection(coach: Actor): UnitVector {
        const { r, vr, vt } = this.swimmer.polarState();           // vr — радиально наружу, vt — касательная CCW

        // TODO: add sign - CCW CW
        const omega = this.swimmer.getCoachAngularVelocity(coach); // рад/с

        const vtMag = Math.abs(omega * r) * OVER_COACH;            // требуемая касательная скорость
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
        return { ux: vx / vlen, uy: vy / vlen };
    }

}