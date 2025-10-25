import {ActorV2} from "@/app/swim/Pool/swimmer/ActorV2";
import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {CAUGHT, Delta, FLED, Point, Polar, StepResult, SwimmerStateName, UnitVector} from "@/app/swim/Pool/Types";
import {GapState} from "@/app/swim/Pool/swimmer/swimmerStates/GapState";
import {DashState} from "@/app/swim/Pool/swimmer/swimmerStates/DashState";
import {CurlState} from "@/app/swim/Pool/swimmer/swimmerStates/CurlState";
import {Actor} from "@/app/swim/Pool/Actor";
import {MoveAway} from "@/app/swim/Pool/swimmer/swimmerStates/MoveAway";

export class SwimmerV4 extends ActorV2 {
    private readonly states: { BuildGap: GapState; Dash: DashState; Curl: CurlState; MoveAway:  MoveAway};
    private currentState: SwimmerState;

    constructor(
        speed: number,
        poolRadius: number,
        poolCenter: Point,
        position: Point,
    ) {
        super(speed, poolRadius, poolCenter, position);
        this.states = {
            BuildGap: new GapState(this),
            Dash: new DashState(this),
            Curl: new CurlState(this),
            MoveAway: new MoveAway(this),

        } satisfies Record<SwimmerStateName, SwimmerState>;
        this.setCurrentState("MoveAway");
    }

    public setCurrentState(next: SwimmerStateName) {
        this.currentState = this.states[next];
    };

    public polarState(): Polar {
        const deltaCenter: Delta = this.vecFrom(this.poolCenter);

        const theta: number = Math.atan2(deltaCenter.dy, deltaCenter.dx);

        // radial unit vector OS
        const vr: UnitVector = this.normalize(deltaCenter.dx, deltaCenter.dy);

        // tangential unit vector OS, rotate vr
        const vt: UnitVector = {ux: -vr.uy, uy: vr.ux};

        return {r: deltaCenter.len, theta, vr, vt};
    }

    public getCoachAngularVelocity(coach: Actor): number {
        return this.speedOf(coach)/this.poolRadius;
    };

    public update(coach: Actor, dt: number): StepResult {
        if (this.isCaught(coach)) return CAUGHT;
        if (this.isFled()) return FLED;
        return this.currentState.update(coach, dt);
    }

}