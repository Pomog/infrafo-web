import {RuleContext, StatePolicy, StateRule} from "@/app/swim/Pool/swimmer/swimmerStates/StatePolicy";
import {CATCH_EPS, SwimmerStateName} from "@/app/swim/Pool/Types";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";
import {Actor} from "@/app/swim/Pool/Actor";

export class DefaultStatePolicy implements StatePolicy {

    constructor(private readonly rules: StateRule[]) {
        if (!rules || rules.length === 0) {
            throw new Error("DefaultStatePolicy: provide at least one rule");
        }
    }

    decide(current: SwimmerStateName, swimmer: SwimmerV4, coach: Actor): SwimmerStateName | null {
        const ratio    = swimmer.normalizedDistanceFromCenter();
        const opposite = swimmer.isOppositeThroughCenter(coach);
        const dist     = swimmer.vecFrom(coach.position).len;
        const nearCatch = Number.isFinite(dist) && dist <= 10 * CATCH_EPS;

        const ctx: RuleContext = { current, swimmer, coach, ratio, opposite, dist, nearCatch };

        for (const rule of this.rules) {
            const decision = rule(ctx);
            if (decision) return decision;
        }

        return null;
    }
}