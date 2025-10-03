import {ActorV2} from "@/app/swim/Pool/swimmer/ActorV2";
import {SwimmerState} from "@/app/swim/Pool/swimmer/State";
import {Point, SwimmerStateName} from "@/app/swim/Pool/Types";
import {GapState} from "@/app/swim/Pool/swimmer/GapState";
import {DashState} from "@/app/swim/Pool/swimmer/DashState";
import {CurlState} from "@/app/swim/Pool/swimmer/CurlState";

export class SwimmerV4 extends ActorV2 {
    private readonly states: Record<SwimmerStateName, SwimmerState>;
    private current: SwimmerState;

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
        this.goto("Curl");
    };

    public goto(next: SwimmerStateName) {
        this.current = this.states[next];
    };

}