import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {DASH_LIMIT, OK, Point, StepResult, SwimmerStateName, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";

export class MoveAway implements SwimmerState {
    readonly name: SwimmerStateName = "MoveAway";
    readonly dashLimit: DASH_LIMIT;
    constructor(public swimmer: SwimmerV4) {}

    update(coach: Actor, dt: number): StepResult {
        const away: UnitVector = this.swimmer.getUnitVectorFrom(coach.position);
        this.swimmer.moveAlong(away, dt);
        if (this.readyToDash()){
            this.swimmer.setCurrentState("BuildGap");
        }
        return OK;
    }

    readyToDash(): boolean {
        console.debug("in MoveAway State center=", this.swimmer['poolCenter']);
        const lenToThePoolCenter: number = this.swimmer.vecFrom(this.swimmer.poolCenter).len;
        const poolRadius = this.swimmer.poolRadius;
        return lenToThePoolCenter/poolRadius > this.dashLimit;
    }

}