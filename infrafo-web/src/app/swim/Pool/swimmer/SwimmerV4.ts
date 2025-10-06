import {ActorV2} from "@/app/swim/Pool/swimmer/ActorV2";
import {SwimmerState} from "@/app/swim/Pool/swimmer/swimmerStates/SwimmerState";
import {CAUGHT, FLED, Point, StepResult, SwimmerStateName} from "@/app/swim/Pool/Types";
import {GapState} from "@/app/swim/Pool/swimmer/swimmerStates/GapState";
import {DashState} from "@/app/swim/Pool/swimmer/swimmerStates/DashState";
import {CurlState} from "@/app/swim/Pool/swimmer/swimmerStates/CurlState";
import {Actor} from "@/app/swim/Pool/Actor";

export class SwimmerV4 extends ActorV2 {
    private readonly states: Record<SwimmerStateName, SwimmerState>;
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
        } satisfies Record<SwimmerStateName, SwimmerState>;
        this.setCurrentState("Curl");
    }

    public setCurrentState(next: SwimmerStateName) {
        this.currentState = this.states[next];
    };

    update(coach: Actor, dt: number): StepResult {
        if (this.isCaught(coach)) return CAUGHT;
        if (this.isFled()) return FLED;
        return this.currentState.update(coach, dt);
    }

}